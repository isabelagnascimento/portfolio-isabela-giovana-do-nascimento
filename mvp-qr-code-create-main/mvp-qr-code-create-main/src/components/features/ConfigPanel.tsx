import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useQRStore } from '@/store/useQRStore';
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { Palette, Maximize, Type, Image as ImageIcon, Box, Mic, MicOff, Upload, X, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistant } from './AIAssistant';
import { storage, auth, trackEvent } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useSystemConfig } from '@/hooks/useSystemConfig';

export const ConfigPanel = () => {
  const { options, setOptions } = useQRStore();
  const { config } = useSystemConfig();
  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidHex = (hex: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);

  const handleUpdate = (updates: any) => {
    setOptions(updates);
  };

  const handleNestedUpdate = (key: string, updates: any) => {
    // Basic validation to prevent empty strings or invalid types from crashing
    if (updates.color !== undefined && (typeof updates.color !== 'string' || updates.color.trim() === '')) {
      return; 
    }
    
    setOptions({
      [key]: updates
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Use user ID to organize files, or fallback to 'public'
      const userId = auth.currentUser?.uid || 'guest';
      const storageRef = ref(storage, `logos/${userId}/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          handleUpdate({ image: downloadURL });
          trackEvent('logo_upload', { size: file.size, type: file.type });
          setIsUploading(false);
          setUploadProgress(0);
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
    }
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      trackEvent('voice_input_start');
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUpdate({ data: transcript });
    };

    recognition.start();
  }, [options.data]);

  return (
    <div className="flex flex-col gap-4" role="form" aria-label="Configurações do QR Code">
      {config.aiDesigner && <AIAssistant />}
      <Accordion type="multiple" defaultValue={['main']} className="w-full space-y-3">
        
        {/* Main Options */}
        <AccordionItem value="main" className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all">
          <AccordionTrigger 
            className="text-sm font-bold px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors focus:bg-muted/50"
            aria-label="Configurações de Conteúdo e Tamanho"
          >
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4 text-primary" />
              Conteúdo & Tamanho
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-4 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="data" className="text-xs font-bold text-muted-foreground uppercase">Texto ou URL</Label>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={`h-8 w-8 rounded-full ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-muted-foreground hover:text-primary'}`}
                  onClick={startListening}
                  title="Entrada por Voz"
                  aria-label={isListening ? "Parar reconhecimento de voz" : "Iniciar reconhecimento de voz"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              <Input 
                id="data" 
                className="rounded-xl border-border focus-visible:ring-primary bg-background text-foreground"
                value={options.data} 
                onChange={(e) => handleUpdate({ data: e.target.value })}
                placeholder="https://example.com"
                aria-required="true"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="size-slider" className="text-xs font-bold text-muted-foreground uppercase">Tamanho</Label>
                  <span className="text-[10px] font-bold text-primary" aria-live="polite">{options.width}px</span>
                </div>
                <Slider 
                  id="size-slider"
                  value={[options.width || 300]} 
                  min={100} 
                  max={1000} 
                  step={10}
                  onValueChange={(vals) => handleUpdate({ width: vals[0], height: vals[0] })}
                  aria-label="Ajustar tamanho do QR Code"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="margin-slider" className="text-xs font-bold text-muted-foreground uppercase">Margem</Label>
                  <span className="text-[10px] font-bold text-primary" aria-live="polite">{options.margin}px</span>
                </div>
                <Slider 
                  id="margin-slider"
                  value={[options.margin || 0]} 
                  min={0} 
                  max={100} 
                  onValueChange={(vals) => handleUpdate({ margin: vals[0] })}
                  aria-label="Ajustar margem do QR Code"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dots Options */}
        <AccordionItem value="dots" className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <AccordionTrigger 
            className="text-sm font-bold px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors"
            aria-label="Configurações de Estilo dos Pontos"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-indigo-500" />
              Estilo dos Pontos
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-4 pt-0">
            <div className="space-y-3">
              <Label htmlFor="dots-type" className="text-xs font-bold text-muted-foreground uppercase">Estilo</Label>
              <Select 
                value={options.dotsOptions?.type} 
                onValueChange={(val) => handleNestedUpdate('dotsOptions', { type: val as DotType })}
              >
                <SelectTrigger id="dots-type" className="rounded-xl border-border bg-background text-foreground">
                  <SelectValue placeholder="Escolha o estilo" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-card text-foreground border-border">
                  <SelectItem value="square">Quadrado</SelectItem>
                  <SelectItem value="dots">Pontos</SelectItem>
                  <SelectItem value="rounded">Arredondado</SelectItem>
                  <SelectItem value="extra-rounded">Super Arredondado</SelectItem>
                  <SelectItem value="classy">Elegante</SelectItem>
                  <SelectItem value="classy-rounded">Elegante Arredondado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="dots-color" className="text-xs font-bold text-muted-foreground uppercase">Cor</Label>
              <div className="flex gap-2">
                <div className="relative w-12 h-10 flex-shrink-0">
                  <Input 
                    id="dots-color"
                    type="color" 
                    className="absolute inset-0 w-full h-full p-1 cursor-pointer opacity-0"
                    value={options.dotsOptions?.color || '#000000'}
                    onChange={(e) => handleNestedUpdate('dotsOptions', { color: e.target.value })}
                    aria-label="Escolher cor dos pontos"
                  />
                  <div className="w-full h-full rounded-lg border border-border shadow-inner" style={{ backgroundColor: options.dotsOptions?.color || '#000000' }} />
                </div>
                <Input 
                  className="rounded-xl border-border bg-background text-foreground font-mono text-xs"
                  value={options.dotsOptions?.color || '#000000'}
                  onChange={(e) => handleNestedUpdate('dotsOptions', { color: e.target.value })}
                  aria-label="Código hexadecimal da cor dos pontos"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Corners Options */}
        <AccordionItem value="corners" className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
          <AccordionTrigger 
            className="text-sm font-bold px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors"
            aria-label="Configurações de Cantos"
          >
            <div className="flex items-center gap-3">
              <Maximize className="w-4 h-4 text-emerald-500" />
              Cantos
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-6 pt-0">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Formato Externo</h4>
              <div className="space-y-3">
                <Label htmlFor="corner-square-type" className="text-xs font-bold text-muted-foreground uppercase">Estilo</Label>
                <Select 
                  value={options.cornersSquareOptions?.type} 
                  onValueChange={(val) => handleNestedUpdate('cornersSquareOptions', { type: val as CornerSquareType })}
                >
                  <SelectTrigger id="corner-square-type" className="rounded-xl border-border bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-card text-foreground border-border">
                    <SelectItem value="square">Quadrado</SelectItem>
                    <SelectItem value="dot">Ponto</SelectItem>
                    <SelectItem value="rounded">Arredondado</SelectItem>
                    <SelectItem value="extra-rounded">Super Arredondado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="corner-square-color" className="text-xs font-bold text-muted-foreground uppercase">Cor</Label>
                <div className="flex gap-2">
                  <div className="relative w-12 h-10 flex-shrink-0">
                    <Input 
                      id="corner-square-color"
                      type="color" 
                      className="absolute inset-0 w-full h-full p-1 cursor-pointer opacity-0"
                      value={options.cornersSquareOptions?.color || '#000000'}
                      onChange={(e) => handleNestedUpdate('cornersSquareOptions', { color: e.target.value })}
                      aria-label="Escolher cor do formato externo do canto"
                    />
                    <div className="w-full h-full rounded-lg border border-border" style={{ backgroundColor: options.cornersSquareOptions?.color || '#000000' }} />
                  </div>
                  <Input 
                    className="rounded-xl border-border bg-background text-foreground font-mono text-xs" 
                    value={options.cornersSquareOptions?.color} 
                    onChange={(e) => handleNestedUpdate('cornersSquareOptions', { color: e.target.value })}
                    aria-label="Código hexadecimal da cor do formato externo"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Ponto Interno</h4>
              <div className="space-y-3">
                <Label htmlFor="corner-dot-type" className="text-xs font-bold text-muted-foreground uppercase">Estilo</Label>
                <Select 
                  value={options.cornersDotOptions?.type} 
                  onValueChange={(val) => handleNestedUpdate('cornersDotOptions', { type: val as CornerDotType })}
                >
                  <SelectTrigger id="corner-dot-type" className="rounded-xl border-border bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-card text-foreground border-border">
                    <SelectItem value="square">Quadrado</SelectItem>
                    <SelectItem value="dot">Ponto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="corner-dot-color" className="text-xs font-bold text-muted-foreground uppercase">Cor</Label>
                <div className="flex gap-2">
                  <div className="relative w-12 h-10 flex-shrink-0">
                    <Input 
                      id="corner-dot-color"
                      type="color" 
                      className="absolute inset-0 w-full h-full p-1 cursor-pointer opacity-0"
                      value={options.cornersDotOptions?.color || '#000000'}
                      onChange={(e) => handleNestedUpdate('cornersDotOptions', { color: e.target.value })}
                      aria-label="Escolher cor do ponto interno do canto"
                    />
                    <div className="w-full h-full rounded-lg border border-border" style={{ backgroundColor: options.cornersDotOptions?.color || '#000000' }} />
                  </div>
                  <Input 
                    className="rounded-xl border-border bg-background text-foreground font-mono text-xs" 
                    value={options.cornersDotOptions?.color} 
                    onChange={(e) => handleNestedUpdate('cornersDotOptions', { color: e.target.value })}
                    aria-label="Código hexadecimal da cor do ponto interno"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Background Options */}
        <AccordionItem value="background" className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-purple-500 transition-all">
          <AccordionTrigger 
            className="text-sm font-bold px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors"
            aria-label="Configurações de Fundo"
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-purple-500" />
              Fundo
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-4 pt-0">
            <div className="space-y-3">
              <Label htmlFor="bg-color" className="text-xs font-bold text-muted-foreground uppercase">Cor de Fundo</Label>
              <div className="flex gap-2">
                <div className="relative w-12 h-10 flex-shrink-0">
                  <Input 
                    id="bg-color"
                    type="color" 
                    className="absolute inset-0 w-full h-full p-1 cursor-pointer opacity-0"
                    value={options.backgroundOptions?.color || '#ffffff'}
                    onChange={(e) => handleNestedUpdate('backgroundOptions', { color: e.target.value })}
                    aria-label="Escolher cor de fundo do QR Code"
                  />
                  <div className="w-full h-full rounded-lg border border-border shadow-sm" style={{ backgroundColor: options.backgroundOptions?.color || '#ffffff' }} />
                </div>
                <Input 
                  className="rounded-xl border-border bg-background text-foreground font-mono text-xs" 
                  value={options.backgroundOptions?.color} 
                  onChange={(e) => handleNestedUpdate('backgroundOptions', { color: e.target.value })}
                  aria-label="Código hexadecimal da cor de fundo"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Image Options */}
        <AccordionItem value="image" className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-rose-500 transition-all">
          <AccordionTrigger 
            className="text-sm font-bold px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors"
            aria-label="Configurações de Logo"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-rose-500" />
                Logo Central
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 space-y-4 pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="logo-url" className="text-xs font-bold text-muted-foreground uppercase">Logo</Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isUploading}
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary transition-colors relative"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Local Image"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                  {options.image && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-rose-400 hover:text-rose-600 transition-colors"
                      onClick={() => handleUpdate({ image: '' })}
                      title="Remove Logo"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <Input 
                id="logo-url"
                className="rounded-xl border-border focus-visible:ring-rose-500 bg-background text-foreground text-sm"
                value={options.image || ''} 
                onChange={(e) => handleUpdate({ image: e.target.value })}
                placeholder="URL da Imagem ou Upload"
                aria-label="URL da imagem do logo central"
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="image-size-slider" className="text-xs font-bold text-muted-foreground uppercase">Tamanho do Logo</Label>
                <span className="text-[10px] font-bold text-primary" aria-live="polite">{Math.round((options.imageOptions?.imageSize || 0) * 100)}%</span>
              </div>
              <Slider 
                id="image-size-slider"
                value={[options.imageOptions?.imageSize || 0.4]} 
                min={0.1} 
                max={0.5} 
                step={0.05}
                onValueChange={(vals) => handleNestedUpdate('imageOptions', { imageSize: vals[0] })}
                aria-label="Ajustar tamanho do logo central"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};
