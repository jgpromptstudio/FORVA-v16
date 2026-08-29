import { Reveal } from '@/components/Reveal';
import { AlienAssistant } from '@/components/AlienAssistant';
import { safetyTiers } from '@/config/safetyConfig';
import { ShieldCheck, FileSearch, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const tierIcons = [ShieldCheck, FileSearch, AlertTriangle];
const tierColors = [
  { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400', glow: 'shadow-[0_0_24px_-8px_hsl(160_58%_48%)]' },
  { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', glow: 'shadow-[0_0_24px_-8px_hsl(39_88%_62%)]' },
  { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400', glow: 'shadow-[0_0_24px_-8px_hsl(0_72%_55%)]' },
];

export function Safety() {
  return (
    <section id="safety" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Automation with a Safety Net</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Fast when it can be. Human when it should be.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              FORVA is designed to handle normal work automatically while giving people control over
              sensitive decisions, failures, and high-value conversations.
            </p>
          </Reveal>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {safetyTiers.map((tier, i) => {
            const Icon = tierIcons[i];
            const colors = tierColors[i];
            return (
              <Reveal key={tier.tier} delay={i * 150}>
                <div className={cn('clay rounded-2xl p-6 h-full', colors.border)}>
                  {/* Tier header */}
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border',
                        colors.border,
                        colors.bg
                      )}
                    >
                      <Icon className={cn('h-6 w-6', colors.text)} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tier {tier.tier}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{tier.title}</h3>
                    </div>
                  </div>

                  {/* Items */}
                  <ul className="space-y-3">
                    {tier.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', colors.text === 'text-emerald-400' ? 'bg-emerald-400' : colors.text === 'text-amber-400' ? 'bg-amber-400' : 'bg-red-400')} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Connection arrow between tiers */}
                  {i < safetyTiers.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-primary/30" />
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Alien operations crew motif */}
        <Reveal delay={500}>
          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <AlienAssistant variant="teal" size={40} />
              <AlienAssistant variant="gold" size={36} />
              <AlienAssistant variant="emerald" size={40} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-muted-foreground">
                A friendly operations crew monitors the system around the clock.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
