import { Button } from '@/components/ui/button';
import { useQRStore } from '@/store/useQRStore';
import { Download, FileJson, Trash2, Image as ImageIcon, FileCode, CheckCircle2, ChevronDown, Layers } from 'lucide-react';
import { trackEvent, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { useSystemConfig } from '@/hooks/useSystemConfig';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import QRCodeStyling from 'qr-code-styling';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Label } from '@/components/ui/label';

export const ExportButtons = () => {
  const { options, reset } = useQRStore();
  const { user } = useAuth();
  const { config } = useSystemConfig();
  const [downloading, setDownloading] = useState(false);
  const [format, setFormat] = useState<'png' | 'svg'>('png');
  const [size, setSize] = useState('1000');
  const [status, setStatus] = useState<string | null>(null);

  // Filter sizes based on admin config
  const availableSizes = [
    { label: '500 px', value: '500' },
    { label: '1000 px', value: '1000' },
    { label: '2000 px', value: '2000', hiRes: true },
    { label: '4000 px', value: '4000', hiRes: true },
  ].filter(s => !s.hiRes || config.hiResExport);

  const handleDownload = async () => {
    setDownloading(true);
    setStatus('Gerando...');
    
    // Create a temporary instance with the target size for high-quality export
    const exportOptions = {
      ...options,
      width: parseInt(size),
      height: parseInt(size),
    };

    const qrCode = new QRCodeStyling(exportOptions);
    
    try {
      await qrCode.download({ 
        name: `qr-code-${size}x${size}`, 
        extension: format 
      });
      trackEvent('qr_download', { format, size });
      
      // Save to history if user is logged in
      if (user) {
        try {
          await addDoc(collection(db, 'history'), {
            userId: user.uid,
            data: options.data,
            format: format,
            size: parseInt(size),
            timestamp: serverTimestamp()
          });
        } catch (e) {
          console.error("History log failed:", e);
        }
      }

      setStatus('Sucesso!');
      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setStatus('Erro');
      setTimeout(() => setStatus(null), 2000);
    } finally {
      setDownloading(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "qr-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="flex flex-col gap-5 w-full" role="group" aria-label="Opções de Exportação">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-1">Formato</Label>
            <Select value={format} onValueChange={(val: any) => setFormat(val)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:ring-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                <SelectItem value="png">PNG (Imagem)</SelectItem>
                <SelectItem value="svg">SVG (Vetorial)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-1">Resolução</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11 focus:ring-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white rounded-xl">
                {availableSizes.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full bg-white text-slate-900 hover:bg-slate-50 rounded-2xl h-16 font-bold shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
          aria-label={`Baixar QR Code em ${format.toUpperCase()} com ${size} pixels`}
        >
          <AnimatePresence mode="wait">
            {status ? (
              <motion.div 
                key="status"
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center gap-2"
              >
                {status.includes('Sucesso') ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : null}
                {status}
              </motion.div>
            ) : (
              <motion.div 
                key="normal"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center gap-2"
              >
                <Download className="w-5 h-5 text-blue-600" aria-hidden="true" /> 
                Baixar agora
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {format === 'svg' && (
          <p className="text-[10px] text-white/30 text-center italic px-4 leading-relaxed">
            * O formato SVG permite ampliações ilimitadas sem perda de qualidade, ideal para acessibilidade e impressão.
          </p>
        )}
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-white/5">
        <Button 
          onClick={handleExportJSON} 
          variant="secondary" 
          className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-12 font-semibold transition-all"
          aria-label="Exportar configuração em JSON"
        >
          <FileJson className="w-4 h-4 mr-2 text-white/40" aria-hidden="true" /> JSON Config
        </Button>
        <Button 
          onClick={reset} 
          variant="ghost" 
          className="text-white/20 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl h-12 transition-all p-3"
          title="Reset All"
          aria-label="Resetar todas as configurações"
        >
          <Trash2 className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
