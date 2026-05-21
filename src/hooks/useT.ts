import { useCallback } from 'react';
import { i18n } from '@/src/i18n';
import { useSettingsStore } from '@/src/store/settingsStore';

export function useT() {
  // Subscribe to locale changes so components re-render
  const locale = useSettingsStore((s) => s.locale);

  return useCallback(
    (key: string, options?: Record<string, unknown>) => {
      i18n.locale = locale;
      return i18n.t(key, options);
    },
    [locale],
  );
}
