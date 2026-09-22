import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { I18nManager } from 'react-native';
import { SUPPORTED_LOCALES, type LocaleCode, type TranslationKeys } from './types';
import { translations } from './translations';

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

function resolveDeviceLocale(): LocaleCode {
  const deviceLocales = getLocales();

  for (const locale of deviceLocales) {
    const languageCode = locale.languageCode?.toLowerCase();
    if (!languageCode) continue;

    if (SUPPORTED_LOCALES.includes(languageCode as LocaleCode)) {
      return languageCode as LocaleCode;
    }

    // Handle zh-Hans / zh-Hant etc. via languageCode already being "zh"
    const tag = locale.languageTag?.toLowerCase() ?? '';
    const primary = tag.split(/[-_]/)[0];
    if (SUPPORTED_LOCALES.includes(primary as LocaleCode)) {
      return primary as LocaleCode;
    }
  }

  return 'en';
}

export const locale = resolveDeviceLocale();
i18n.locale = locale;

const isRtl = locale === 'ar';
if (I18nManager.isRTL !== isRtl) {
  I18nManager.allowRTL(isRtl);
  I18nManager.forceRTL(isRtl);
}

export function t(key: keyof TranslationKeys, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export function getTranslation(): TranslationKeys {
  return translations[locale] ?? translations.en;
}

export { i18n, SUPPORTED_LOCALES };
