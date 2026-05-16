import { Button } from '@/components/ui/button';
import { useQRStore } from '@/store/useQRStore';
import { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import { trackEvent } from '@/lib/firebase';

const PRESETS = [
  {
    id: 'cool-blue',
    name: 'Ocean Breeze',
    color: '#3b82f6',
    options: {
      dotsOptions: { type: 'rounded' as DotType, color: '#3b82f6' },
      cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType, color: '#1d4ed8' },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: '#1d4ed8' }
    }
  },
  {
    id: 'elegant-dark',
    name: 'Midnight',
    color: '#0f172a',
    options: {
      dotsOptions: { type: 'classy' as DotType, color: '#0f172a' },
      cornersSquareOptions: { type: 'square' as CornerSquareType, color: '#1e293b' },
      cornersDotOptions: { type: 'square' as CornerDotType, color: '#1e293b' }
    }
  },
  {
    id: 'spring-vibes',
    name: 'Spring',
    color: '#10b981',
    options: {
      dotsOptions: { type: 'dots' as DotType, color: '#10b981' },
      cornersSquareOptions: { type: 'rounded' as CornerSquareType, color: '#059669' },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: '#059669' }
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    color: '#f43f5e',
    options: {
      dotsOptions: { type: 'extra-rounded' as DotType, color: '#f43f5e' },
      cornersSquareOptions: { type: 'extra-rounded' as CornerSquareType, color: '#e11d48' },
      cornersDotOptions: { type: 'dot' as CornerDotType, color: '#e11d48' }
    }
  }
];

export const QRPresets = () => {
  const { options, setOptions } = useQRStore();

  const currentDotsColor = options.dotsOptions?.color;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
      {PRESETS.map((preset) => (
        <motion.button
          key={preset.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setOptions(preset.options);
            trackEvent('preset_select', { preset_id: preset.id, preset_name: preset.name });
          }}
          className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
            currentDotsColor === preset.color ? 'border-primary bg-secondary' : 'border-transparent bg-slate-50 hover:bg-slate-100'
          }`}
          aria-label={`Aplicar tema ${preset.name}`}
        >
          <div 
            className="w-10 h-10 rounded-xl shadow-inner flex items-center justify-center"
            style={{ backgroundColor: preset.color }}
          >
            {currentDotsColor === preset.color && <Check className="w-5 h-5 text-white" />}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{preset.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
