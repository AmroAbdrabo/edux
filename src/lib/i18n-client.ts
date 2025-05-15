// src/lib/i18n-client.ts

// Client-side translation loader
export const loadTranslations = async (locale: string) => {
  try {
    // Dynamically import the translations for the given locale.
    // Webpack (used by Next.js) will handle code-splitting for these JSON files.
    const translations = await import(`@/locales/${locale}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Could not load client-side translations for locale: ${locale}`, error);
    // Fallback to English if the requested locale's translations are not found.
    const fallback = await import(`@/locales/en.json`);
    return fallback.default;
  }
};
