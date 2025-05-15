// This file is effectively removed and replaced by src/app/[locale]/page.tsx
// However, to avoid issues with the build system expecting a root page.tsx,
// we can make it a simple redirect to the default locale or a placeholder.
// For now, let's assume middleware handles the redirect.
// If issues arise, we might need a redirect component here.

// For simplicity and to ensure middleware handles this, we can keep it minimal
// or remove it if middleware correctly routes from `/` to `/[locale]`.
// If Next.js requires a root page.tsx, this could be a placeholder.
// The middleware should handle redirecting from `/` to `/[defaultLocale]`.

// Let's make this a redirect component to be safe, though middleware should ideally handle it.
import { redirect } from 'next/navigation';

export default function RootPage() {
  // The middleware should handle redirecting to the default locale.
  // If for some reason middleware is bypassed or not configured for the root,
  // this provides a fallback.
  // However, with path-based localization, /page.tsx at the root is less common.
  // We will rely on the middleware to redirect from `/` to `/en` (or default locale).
  // Thus, this page should ideally not be reached directly if middleware is active.
  
  // If your next.config.js i18n is set up, Next.js might automatically handle this.
  // For clarity, explicit middleware is better.
  redirect('/en'); // Redirect to default locale
}
