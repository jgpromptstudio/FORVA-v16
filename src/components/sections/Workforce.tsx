import { Reveal } from '@/components/Reveal';
import { AlienAssistant } from '@/components/AlienAssistant';
import { workforceConfig } from '@/config/navConfig';
import { cn } from '@/lib/utils';

const alienVariants = ['teal', 'gold', 'emerald', 'silver', 'teal', 'gold', 'emerald'] as const;

export function Workforce() {
  return (
    <section id="workforce" className="relative z-10 section-padding -mt-20 md:-mt-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Your Always-On Client Engine</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              A small digital workforce working behind every opportunity.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              FORVA connects discovery, intelligence, communication, and follow-up into one
              coordinated system. Each part does its job, shares context, and helps move the right
              prospects toward a real conversation.
            </p>
          </Reveal>
        </div>

        {/* Orbital display */}
        <Reveal delay={300}>
          <div className="relative mx-auto flex min-h-[500px] max-w-4xl items-center justify-center md:min-h-[600px]">
            {/* Orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[280px] w-[280px] rounded-full border border-primary/15 md:h-[360px] md:w-[360px]" />
              <div className="absolute h-[380px] w-[380px] rounded-full border border-primary/10 md:h-[480px] md:w-[480px]" />
              <div className="absolute h-[480px] w-[480px] rounded-full border border-white/5 md:h-[600px] md:w-[600px]" />
            </div>

            {/* Rotating signal ring */}
            <div className="absolute h-[280px] w-[280px] animate-orbit-rotate md:h-[360px] md:w-[360px]">
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_4px_hsl(var(--primary)/0.5)]" />
            </div>

            {/* Central core */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl glass-strong md:h-24 md:w-24">
                <span className="font-display text-2xl font-bold text-primary md:text-3xl">F</span>
              </div>
              <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                FORVA Core
              </span>
            </div>

            {/* Orbital items */}
            {workforceConfig.map((item, i) => {
              const radius = 180;
              const rad = (item.angle - 90) * (Math.PI / 180);
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="absolute"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="group relative flex flex-col items-center">
                    {/* Signal pulse */}
                    <div
                      className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary/40 animate-signal-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />

                    {/* Avatar with alien */}
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl glass-strong transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] md:h-20 md:w-20">
                      <Icon className="h-6 w-6 text-primary md:h-7 md:w-7" />
                      {/* Tiny alien assistant */}
                      <div className="absolute -bottom-2 -right-2">
                        <AlienAssistant
                          variant={alienVariants[i % alienVariants.length]}
                          size={22}
                          floating={false}
                        />
                      </div>
                    </div>

                    {/* Label */}
                    <span className="mt-2 max-w-[100px] text-center text-xs font-semibold text-foreground md:text-sm">
                      {item.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Signal connections */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: 'visible' }}>
              {workforceConfig.map((item, i) => {
                const next = workforceConfig[(i + 1) % workforceConfig.length];
                const r = 180;
                const rad1 = (item.angle - 90) * (Math.PI / 180);
                const rad2 = (next.angle - 90) * (Math.PI / 180);
                const x1 = Math.cos(rad1) * r;
                const y1 = Math.sin(rad1) * r;
                const x2 = Math.cos(rad2) * r;
                const y2 = Math.sin(rad2) * r;
                return (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${x1}px)`}
                    y2={`calc(50% + ${y1}px)`}
                    stroke="hsl(var(--primary) / 0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
