import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import { GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login - Student Hub',
  description: 'Log in to access your Student Hub account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-8">
      <header className="text-center mb-10">
        <GraduationCap className="h-20 w-20 mx-auto text-primary mb-4" />
        <h1 className="text-5xl font-extrabold text-primary tracking-tight">
          Student Hub
        </h1>
        <p className="text-muted-foreground text-xl mt-2">
          Your central platform for academic success.
        </p>
      </header>
      
      <main className="w-full flex justify-center">
        <LoginForm />
      </main>

      <footer className="text-center py-8 mt-10 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Student Hub. All rights reserved.
      </footer>
    </div>
  );
}
