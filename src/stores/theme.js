import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light',
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    applyTheme(theme) {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },

    toggleTheme() {
      const nextTheme = this.theme === 'light' ? 'dark' : 'light';
      this.applyTheme(nextTheme);
    },

    initTheme() {
      this.applyTheme(this.theme);
    },
  },
});
