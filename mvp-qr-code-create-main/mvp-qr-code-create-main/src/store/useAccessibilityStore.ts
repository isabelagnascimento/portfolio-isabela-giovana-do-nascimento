import { create } from 'zustand';

interface AccessibilityState {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xl';
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'xl') => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  highContrast: false,
  fontSize: 'normal',
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  setFontSize: (size) => set({ fontSize: size }),
}));
