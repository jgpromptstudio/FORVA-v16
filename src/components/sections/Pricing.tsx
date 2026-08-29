import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { plansConfig, planNotes } from '@/config/planConfig';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Plans and Pricing</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              One premium client can pay for months of FORVA.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Every plan includes a monthly FORVA Credit allowance. Credits are spent based on the work
              FORVA performs for you.
            </p>
          </Reveal>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plansConfig.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 150}>
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl p-8 transition-all duration-300',
                  plan.highlighted
                    ? 'clay border-2 border-primary/40 shadow-[0_0_40px_-8px_hsl(var(--primary)/0.3)]'
                    : 'clay clay-hover'
                )}
              >
                {plan.label && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" className="px-4 py-1 text-xs uppercase tracking-wider">
                      <Sparkles className="mr-1 h-3 w-3" />
                      {plan.label}
                    </Badge>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                {/* Credits */}
                <div className="mt-4 space-y-1">
                  <p className="text-sm font-semibold text-primary">{plan.credits}</p>
                  <p className="text-xs text-muted-foreground">{plan.prospects}</p>
                </div>

                {/* Audience */}
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plan.audience}</p>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Plan notes */}
        <Reveal delay={400}>
          <div className="mt-12 space-y-3">
            {planNotes.map((note, i) => (
              <p key={i} className="text-center text-sm leading-relaxed text-muted-foreground">
                {note}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
