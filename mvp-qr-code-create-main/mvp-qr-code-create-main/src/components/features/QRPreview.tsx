import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { useQRStore } from '@/store/useQRStore';
import { motion } from 'motion/react';

export const QRPreview = () => {
  const { options } = useQRStore();
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize QR Code Styling instance once
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(options);
    }
    
    // Ensure it's appended to the container
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      qrCodeRef.current.append(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Only on mount

  useEffect(() => {
    const updateQR = async () => {
      if (!qrCodeRef.current) return;

      try {
        // Some properties like width, height and margin might not be perfectly handled by update() 
        // in all versions/renderers of the library. We check if a re-init is safer.
        await qrCodeRef.current.update(options);
      } catch (error) {
        console.error('Erro ao atualizar QR Code:', error);
        
        // Recovery mechanism: re-create the instance
        qrCodeRef.current = new QRCodeStyling(options);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          qrCodeRef.current.append(containerRef.current);
        }
      }
    };

    const timer = setTimeout(updateQR, 16);
    return () => clearTimeout(timer);
  }, [options]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-full overflow-hidden" role="region" aria-label="Visualização do QR Code">
      <motion.div 
        layout
        ref={containerRef} 
        className="bg-card p-4 rounded-[3rem] shadow-2xl shadow-primary/5 border border-border overflow-hidden flex items-center justify-center transition-all duration-500 hover:scale-[1.02] [&_canvas]:max-w-full [&_canvas]:h-auto [&_svg]:max-w-full [&_svg]:h-auto"
        style={{ 
          width: '100%', 
          maxWidth: options.width ? Math.min(options.width, 400) : 300,
          aspectRatio: '1/1'
        }}
        role="img"
        aria-label={`Código QR contendo: ${options.data || 'nenhum dado'}`}
      />
    </div>
  );
};
