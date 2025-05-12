import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <GraduationCap className="h-8 w-8 mr-3" />
        <h1 className="text-3xl font-bold tracking-tight">UNIL EduX</h1>
      </div>
    </header>
  );
}
