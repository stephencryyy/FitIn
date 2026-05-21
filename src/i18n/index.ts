import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './translations/en';
import ru from './translations/ru';

/**
 * Currently supported locales. Keep focused: only fully-translated languages here.
 * Spanish and German are planned but not ready yet.
 */
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧', available: true },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', available: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', available: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', available: false },
] as const;

export type SupportedLocale = 'en' | 'ru' | 'es' | 'de';

export const i18n = new I18n({ en, ru });

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Auto-detect device locale, but only pick from available ones
const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
const availableCodes = SUPPORTED_LOCALES.filter((l) => l.available).map((l) => l.code);
i18n.locale = availableCodes.includes(deviceLocale as any) ? deviceLocale : 'en';

export function setLocale(locale: SupportedLocale) {
  if (locale === 'es' || locale === 'de') return; // Not available
  i18n.locale = locale;
}

export function getLocale(): SupportedLocale {
  return i18n.locale as SupportedLocale;
}
