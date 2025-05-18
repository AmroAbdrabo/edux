// src/lib/i18n.ts
import 'server-only'; // Ensures this runs only on the server for getTranslator

const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const loader = dictionaries[locale] || dictionaries.en; // Fallback to 'en'
  try {
    return await loader();
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${locale}". Falling back to 'en'.`, error);
    return await dictionaries.en();
  }
};

// Helper for simpler t() usage with string replacement on the server
export const getTranslator = async (locale: string) => {
    const dictionary = await getDictionary(locale);
    return (key: string, params?: Record<string, string | number | undefined>, options?: { defaultValue?: string }): string => {
        let translation = dictionary[key];
        if (translation === undefined) {
          translation = options?.defaultValue ?? key;
        }

        if (params) {
            Object.keys(params).forEach((paramKey) => {
                const value = params[paramKey];
                if (value !== undefined) {
                  translation = translation.replace(`{${paramKey}}`, String(value));
                }
            });
        }
        return translation;
    };
};