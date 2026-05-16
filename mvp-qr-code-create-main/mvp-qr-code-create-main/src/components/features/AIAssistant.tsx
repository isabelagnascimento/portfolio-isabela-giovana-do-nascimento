import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Wand2, Loader2, X } from 'lucide-react';
import { generateQrConfig } from '@/services/geminiService';
import { trackEvent } from '@/lib/firebase';
import { useQRStore } from '@/store/useQRStore';
import { motion, AnimatePresence } from 'motion/react';

export const AIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setOptions } = useQRStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    const config = await generateQrConfig(prompt);
    
    if (config) {
      setOptions(config);
      trackEvent('ai_design_generate', { prompt });
      setPrompt('');
      setIsOpen(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="mb-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-200 group transition-all"
              aria-label="Pedir ajuda para a IA"
            >
              <Sparkles className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              Design com IA (Beta)
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-secondary/50 border border-primary/10 rounded-[2rem] p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">O que você deseja criar?</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: QR para meu menu com cor verde e bordas redondas"
                className="rounded-xl border-border focus-visible:ring-primary bg-background text-foreground"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                autoFocus
                aria-label="Descreva o design do QR Code"
              />
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-5 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gerar'}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium px-1">
              Dica: Descreva cores, estilos ou o propósito do código.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
