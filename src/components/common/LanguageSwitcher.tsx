'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from 'react';
import { loadTranslations } from '@/lib/i18n-client'; // Updated import path

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState('en');
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const segments = pathname.split('/');
    const localeFromPath = segments[1];
    const supportedLocales = ['en', 'fr'];
    
    if (supportedLocales.includes(localeFromPath)) {
      setCurrentLocale(localeFromPath);
    } else {
      setCurrentLocale('en'); // Default locale if not in path or not supported
    }
  }, [pathname]);

  useEffect(() => {
    const fetchTranslations = async () => {
      if (currentLocale) {
        const t = await loadTranslations(currentLocale);
        setTranslations(t);
      }
    };
    fetchTranslations();
  }, [currentLocale]);

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    // Check if the first segment is a locale
    if (['en', 'fr'].includes(segments[1])) {
      segments.splice(1, 1); // Remove the old locale
    }
    // Ensure the path starts with a slash, especially if segments became empty (e.g. root path)
    const newPathBase = segments.join('/') || '/';
    const newPath = `/${newLocale}${newPathBase.startsWith('/') ? newPathBase : '/' + newPathBase}`;
    
    router.push(newPath);
    router.refresh(); // Refresh to ensure server components re-render with new locale
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => changeLanguage('en')} disabled={currentLocale === 'en'}>
            {translations.switchToEnglish || 'English'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('fr')} disabled={currentLocale === 'fr'}>
            {translations.switchToFrench || 'Français'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}