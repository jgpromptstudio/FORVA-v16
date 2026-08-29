import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AntiReview() {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Looking for reviews?
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            We didn&apos;t build FORVA to impress you with fake testimonials.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-foreground md:text-xl">
            Create an account. Put it to work. See for yourself.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex justify-center">
            <Button size="xl" onClick={() => navigate('/signup')} className="group">
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-6 text-base text-muted-foreground/70">
            Thank us later. 😉
          </p>
        </Reveal>
      </div>
    </section>
  );
}
