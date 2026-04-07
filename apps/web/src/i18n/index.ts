import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Language } from '@shared/types/general_types';
import { translations } from '@/lib/translations';

const fallbackLanguage: Language = 'uz-latn';
const supportedLanguages: Language[] = ['uz-latn', 'uz-cyrl', 'ru'];

const resources = {
  'uz-latn': { translation: translations['uz-latn'] },
  'uz-cyrl': { translation: translations['uz-cyrl'] },
  ru: { translation: translations.ru },
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return fallbackLanguage;
  }

  const saved = localStorage.getItem('language') as Language | null;
  if (saved && supportedLanguages.includes(saved)) {
    return saved;
  }

  return fallbackLanguage;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: fallbackLanguage,
    supportedLngs: supportedLanguages,
    keySeparator: false,
    defaultNS: 'translation',
    ns: ['translation'],
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });
}

export default i18n;
