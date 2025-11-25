import { create } from 'zustand'

export const useStore = create((set) => ({
  theme: 'void', // void | light
  view: 'intro', // intro | home | terminal | contact
  audioEnabled: false,
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'void' ? 'light' : 'void';
    document.body.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
  setView: (view) => set({ view }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}))
