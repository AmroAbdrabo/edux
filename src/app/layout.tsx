import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata can be generated dynamically in page.tsx or layout.tsx for localized titles
// For a static example here, it will be generic.
export const metadata: Metadata = {
  title: 'Student Hub', // This will be overridden by more specific metadata in pages
  description: 'Your central platform for academic management.',
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={params.locale ?? 'en'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageSwitcher />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
