import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { AlienAssistant } from '@/components/AlienAssistant';
import { ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function FinalCta() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="relative z-10 section-padding overflow-hidden">
      {/* Distant glowing horizon */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full opacity-30 blur-[100px]"
        style={{ background: 'radial-gradient(ellipse, hsla(var(--primary), 0.4), transparent 70%)' }}
      />

      {/* Signal beacon */}
      <div className="pointer-events-none absolute bottom-20 left-1/2 h-[2px] w-[400px] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Alien assistants around beacon */}
        <Reveal>
          <div className="mb-10 flex items-end justify-center gap-6">
            <AlienAssistant variant="teal" size={44} />
            <AlienAssistant variant="gold" size={52} />
            <AlienAssistant variant="emerald" size={44} />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <span className="eyebrow">Your Next Opportunity May Already Be Out There</span>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Let FORVA help you find it.
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Build a more consistent client-acquisition process without spending every day searching,
            checking contacts, writing follow-ups, and maintaining disconnected tools.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" onClick={() => navigate('/signup')} className="group">
              Start Finding Clients
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="outline" onClick={() => scrollToSection('#how-it-works')}>
              <Compass className="h-4 w-4 text-primary" />
              See How It Works
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
