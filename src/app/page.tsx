// This file is effectively removed and replaced by src/app/[locale]/page.tsx
// However, to avoid issues with the build system expecting a root page.tsx,
// it can be a placeholder. The middleware should handle redirecting from `/`
// to `/[defaultLocale]`.

export default function RootPage() {
  // This page should ideally not be reached if middleware correctly
  // redirects from `/` to `/[locale]`.
  // Returning null or a minimal placeholder is safer than redirecting again,
  // which can cause redirect loops with the middleware.
  return null;
}
