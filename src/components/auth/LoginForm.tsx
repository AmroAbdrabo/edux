
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadTranslations } from '@/lib/i18n-client'; // Updated import path

interface LoginFormProps {
  locale: string;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [translations, setTranslations] = useState<any>({});
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchTranslations = async () => {
      const t = await loadTranslations(locale);
      setTranslations(t);
    };
    fetchTranslations();
  }, [locale]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    toast({
      title: translations.loginAttempted || 'Login Attempted',
      description: translations.loginMockRedirect || 'Login functionality is a mock. Redirecting to dashboard.',
    });
    
    // Determine the base path by removing potential existing locale prefix
    // Pathname already includes locale, e.g. /fr/login or /en/login
    // So we want to redirect to /<locale>/student-hub
    const targetPath = `/${locale}/student-hub`;
    router.push(targetPath); 
  };

  if (Object.keys(translations).length === 0) {
    return (
      <Card className="w-full max-w-md shadow-2xl bg-card">
        <CardHeader className="space-y-1 text-center p-6">
          <CardTitle className="text-3xl font-bold text-primary">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p>{translations.loadingTranslations || 'Loading translations...'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="space-y-1 text-center p-6">
        <CardTitle className="text-3xl font-bold text-primary">{translations.welcomeBack}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {translations.loginPrompt}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center text-sm font-medium text-foreground">
              <Mail className="mr-2 h-5 w-5 text-primary" /> {translations.emailAddress}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={translations.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
              aria-label={translations.emailAddress}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-sm font-medium text-foreground">
              <Lock className="mr-2 h-5 w-5 text-primary" /> {translations.password}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-base"
              aria-label={translations.password}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col p-6">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-md shadow-md transition-colors duration-150">
            <LogIn className="mr-2 h-5 w-5" /> {translations.signIn}
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {translations.forgotPassword}{' '}
            <a href="#" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
              {translations.resetItHere}
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
