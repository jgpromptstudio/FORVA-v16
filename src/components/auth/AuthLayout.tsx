import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ForvaLogo } from '@/components/ForvaLogo';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <CosmicBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        {/* Logo */}
        <Link to="/" className="mb-8" aria-label="FORVA home">
          <ForvaLogo size={44} />
        </Link>

        {/* Card */}
        <div className="w-full max-w-md clay rounded-2xl p-8">
          {children}
        </div>

        {/* Back to home */}
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
