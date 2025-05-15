
'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter(); // Added useRouter

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would add authentication logic here.
    console.log('Login attempt:', { email, password });
    toast({
      title: 'Login Attempted',
      description: 'Login functionality is a mock. Redirecting to dashboard.', // Updated description
    });
    // For now, we'll just log, show a toast, and redirect.
    // setEmail(''); // Keep form fields filled for demo or clear as needed
    // setPassword('');

    // Redirect to the student hub page
    router.push('/student-hub'); 
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="space-y-1 text-center p-6">
        <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access your UNIL account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center text-sm font-medium text-foreground">
              <Mail className="mr-2 h-5 w-5 text-primary" /> Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-base"
              aria-label="Email Address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center text-sm font-medium text-foreground">
              <Lock className="mr-2 h-5 w-5 text-primary" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-base"
              aria-label="Password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col p-6">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 rounded-md shadow-md transition-colors duration-150">
            <LogIn className="mr-2 h-5 w-5" /> Sign In
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Forgot your password?{' '}
            <a href="#" className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
              Reset it here
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
