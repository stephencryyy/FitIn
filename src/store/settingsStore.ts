import { create } from 'zustand';
import { i18n, SupportedLocale } from '@/src/i18n';

interface SettingsState {
  locale: SupportedLocale;
  unitSystem: 'metric' | 'imperial';
  darkMode: boolean;
  restTimerDefault: number;
  setLocale: (locale: SupportedLocale) => void;
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setDarkMode: (enabled: boolean) => void;
  setRestTimerDefault: (seconds: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  locale: (i18n.locale as SupportedLocale) || 'en',
  unitSystem: 'metric',
  darkMode: false,
  restTimerDefault: 90,
  setLocale: (locale) => {
    if (locale !== 'en' && locale !== 'ru') return;
    i18n.locale = locale;
    set({ locale });
  },
  setUnitSystem: (unitSystem) => set({ unitSystem }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setRestTimerDefault: (restTimerDefault) => set({ restTimerDefault }),
}));
