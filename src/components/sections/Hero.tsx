import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Hero() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://bvfkgxkubflgejuzorie.supabase.co/storage/v1/object/public/public-assets/forva-hero-poster.png.png"
        className="absolute inset-0 z-0 h-full w-full object-cover pointer-events-none"
      >
        <source
          src="https://bvfkgxkubflgejuzorie.supabase.co/storage/v1/object/public/public-assets/forva-hero.mp4.mp4"
          type="video/mp4"
        />
      </video>

      {/* Light overlay: keeps Jay and aliens visible */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, hsla(var(--background), 0.35) 0%, hsla(var(--background), 0.08) 28%, transparent 48%, transparent 55%, hsla(var(--background), 0.15) 72%)',
        }}
      />

      {/* Layer B: gradually darkening cosmic overlay starting mid-video */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]"
        style={{
          height: 'clamp(340px, 48vh, 520px)',
          background:
            'linear-gradient(180deg, transparent 0%, hsla(var(--background), 0.12) 12%, hsla(var(--background), 0.35) 30%, hsla(var(--background), 0.58) 48%, hsla(var(--background), 0.78) 64%, hsla(var(--background), 0.9) 78%)',
        }}
      />

      {/* Layer C: exact page background color to eliminate any seam */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3]"
        style={{
          height: 'clamp(200px, 26vh, 320px)',
          background:
            'linear-gradient(180deg, transparent 0%, hsla(var(--background), 0.4) 25%, hsla(var(--background), 0.85) 60%, hsl(var(--background)) 85%, hsl(var(--background)) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-6 pt-28 pb-40 text-center md:pt-32">
        {/* Eyebrow */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            AI Client Acquisition System
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mb-8 max-w-4xl text-balance text-4xl font-bold leading-tight text-white opacity-0 animate-fade-in-up sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.4s' }}
        >
          Find <span className="text-gradient-teal">clients</span> faster. More{' '}
          <span className="text-gradient-teal">revenue</span>. Less{' '}
          <span className="text-gradient-teal">manual work</span>.
        </h1>

        {/* CTAs */}
        <div
          className="flex flex-col items-center gap-4 opacity-0 animate-fade-in-up sm:flex-row"
          style={{ animationDelay: '0.6s' }}
        >
          <Button size="xl" onClick={() => navigate('/signup')} className="group">
            Start Finding Clients
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="xl"
            variant="outline"
            onClick={() => scrollToSection('#how-it-works')}
            className="group"
          >
            <Compass className="h-4 w-4 text-primary" />
            See How It Works
          </Button>
        </div>

        {/* Trust line */}
        <p
          className="mt-10 text-sm font-medium text-muted-foreground/70 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          Discover &nbsp;&bull;&nbsp; Verify &nbsp;&bull;&nbsp; Qualify &nbsp;&bull;&nbsp; Contact &nbsp;&bull;&nbsp; Follow Up &nbsp;&bull;&nbsp; Grow
        </p>
      </div>
    </section>
  );
}
