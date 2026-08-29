import { Reveal } from '@/components/Reveal';
import { integrationGroups, byoApiConfig } from '@/config/integrationsConfig';
import { KeyRound, Lock } from 'lucide-react';

export function Integrations() {
  return (
    <section id="integrations" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Infrastructure</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              The tools behind the work, without the technical mess.
            </h2>
          </Reveal>
        </div>

        {/* Integration groups */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {integrationGroups.map((group, i) => (
            <Reveal key={group.title} delay={(i % 3) * 100}>
              <div className="clay rounded-xl p-6 h-full">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item.name}
                      className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* BYO API panel */}
        <Reveal delay={300}>
          <div className="mt-8 clay rounded-2xl p-8 border border-gold/20 bg-gold/5">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/30">
                <KeyRound className="h-7 w-7 text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{byoApiConfig.heading}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {byoApiConfig.copy}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {byoApiConfig.examples}
                </p>
                <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-white/5 p-3">
                  <Lock className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {byoApiConfig.clarification}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
