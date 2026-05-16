import { create } from 'zustand';
import { Options, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel, Mode, TypeNumber } from 'qr-code-styling';

interface QRState {
  options: Options;
  setOptions: (options: Partial<Options>) => void;
  reset: () => void;
}

const initialOptions: Options = {
  width: 300,
  height: 300,
  type: 'svg',
  data: 'https://qr-code-styling.com',
  margin: 10,
  qrOptions: {
    typeNumber: 0 as TypeNumber,
    mode: 'Byte' as Mode,
    errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
  },
  imageOptions: {
    hideBackgroundDots: true,
    imageSize: 0.4,
    margin: 10
  },
  dotsOptions: {
    color: '#4267b2',
    type: 'rounded' as DotType
  },
  backgroundOptions: {
    color: '#ffffff'
  },
  cornersSquareOptions: {
    color: '#4267b2',
    type: 'extra-rounded' as CornerSquareType
  },
  cornersDotOptions: {
    color: '#4267b2',
    type: 'dot' as CornerDotType
  }
};

export const useQRStore = create<QRState>((set) => ({
  options: initialOptions,
  setOptions: (newOptions) => set((state) => {
    const updatedOptions = { ...state.options } as any;
    
    // Deep merge for specific QR styling nested objects
    const nestedKeys = [
      'qrOptions', 
      'imageOptions', 
      'dotsOptions', 
      'backgroundOptions', 
      'cornersSquareOptions', 
      'cornersDotOptions'
    ];

    for (const key of Object.keys(newOptions)) {
      const k = key as keyof Options;
      if (nestedKeys.includes(key) && typeof newOptions[k] === 'object' && newOptions[k] !== null) {
        updatedOptions[k] = {
          ...((state.options as any)[k] || {}),
          ...(newOptions[k] as any)
        };
      } else {
        updatedOptions[k] = newOptions[k];
      }
    }

    return { options: updatedOptions as Options };
  }),
  reset: () => set({ options: initialOptions })
}));
