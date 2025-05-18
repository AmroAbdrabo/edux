import { GraduationCap, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 mr-3" />
          <h1 className="text-3xl font-bold tracking-tight">EduX</h1>
        </div>
        <div className="flex flex-col items-center">
          <UserCircle className="h-8 w-8" />
          <span className="text-xs mt-1">John Doe</span>
        </div>
      </div>
    </header>
  );
}
