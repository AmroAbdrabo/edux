import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import { GraduationCap } from 'lucide-react';
import { getTranslator } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslator(params.locale);
  return {
    title: `${t('signIn')} - ${t('studentHub')}`,
    description: t('loginPrompt'),
  };
}

export default async function LoginPage({ params }: { params: { locale: string } }) {
  const t = await getTranslator(params.locale);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-8 relative">
      <header className="text-center mb-10">
        <GraduationCap className="h-20 w-20 mx-auto text-primary mb-4" />
        <h1 className="text-5xl font-extrabold text-primary tracking-tight">
          {t('studentHub')}
        </h1>
        <p className="text-muted-foreground text-xl mt-2">
          {t('platformDescription')}
        </p>
      </header>
      
      <main className="w-full flex justify-center">
        <LoginForm locale={params.locale} />
      </main>

      <footer className="text-center py-8 mt-10 text-muted-foreground text-sm">
        {t('copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
