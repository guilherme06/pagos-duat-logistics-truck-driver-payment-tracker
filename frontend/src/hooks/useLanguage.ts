import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getTranslation, Translations } from '../lib/translations';

interface LanguageStore {
  language: Language;
  translations: Translations;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'es',
      translations: getTranslation('es'),
      setLanguage: (language: Language) => {
        set({
          language,
          translations: getTranslation(language),
        });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
