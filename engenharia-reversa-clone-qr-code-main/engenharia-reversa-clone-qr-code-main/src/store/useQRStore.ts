import { create } from 'zustand';
import { AppState, defaultOptions } from '../types';

export const useQRStore = create<AppState>((set) => ({
  options: defaultOptions,
  setOptions: (newOptions) => 
    set((state) => ({
      options: { ...state.options, ...newOptions }
    })),
  resetOptions: () => set({ options: defaultOptions }),
}));
