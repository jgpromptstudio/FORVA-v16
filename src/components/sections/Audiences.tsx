import { Reveal } from '@/components/Reveal';
import { audiencesConfig, audiencesSupportingCopy } from '@/config/audiencesConfig';

export function Audiences() {
  return (
    <section id="audiences" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Designed for How Businesses Grow</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              One platform, different paths to your next opportunity.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {audiencesSupportingCopy}
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiencesConfig.map((audience, i) => {
            const Icon = audience.icon;
            return (
              <Reveal key={audience.title} delay={(i % 3) * 100}>
                <div className="clay clay-hover group h-full rounded-xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.4)]">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{audience.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {audience.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Disclaimer */}
        <Reveal delay={400}>
          <p className="mt-10 text-center text-sm text-muted-foreground/60">
            FORVA does not guarantee income, clients, or specific results. Outcomes depend on your
            offer, market, outreach quality, and follow-through.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
