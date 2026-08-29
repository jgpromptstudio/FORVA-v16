import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ForvaLogo } from '@/components/ForvaLogo';

interface LegalLayoutProps {
  title: string;
  intro: string;
  lastUpdated?: string;
  children: ReactNode;
}

export function LegalLayout({ title, intro, lastUpdated = 'August 28, 2026', children }: LegalLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Subtle cosmic accent without heavy ring pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, hsla(var(--primary), 0.04), transparent 60%)',
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-secondary/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 md:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center"
            aria-label="FORVA home"
          >
            <ForvaLogo size={28} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to FORVA
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{intro}</p>
          <p className="mt-3 text-sm text-muted-foreground/60">Last updated: {lastUpdated}</p>

          <div className="mt-12 space-y-10">{children}</div>

          <div className="mt-16 border-t border-white/10 pt-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to FORVA
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

interface LegalSectionProps {
  heading: string;
  children: ReactNode;
}

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white md:text-2xl">{heading}</h2>
      <div className="mt-4 space-y-4 text-sm leading-[1.8] text-muted-foreground md:text-base">
        {children}
      </div>
    </section>
  );
}
