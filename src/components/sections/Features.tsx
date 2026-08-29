import { Reveal } from '@/components/Reveal';
import { featuresConfig } from '@/config/featuresConfig';
import { cn } from '@/lib/utils';

export function Features() {
  return (
    <section id="features" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Everything FORVA Does</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              From finding the opportunity to starting the conversation.
            </h2>
          </Reveal>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuresConfig.map((feature, i) => {
            const Icon = feature.icon;
            const isLarge = feature.size === 'large';
            const isMedium = feature.size === 'medium';

            return (
              <Reveal
                key={feature.title}
                delay={(i % 4) * 80}
                className={cn(
                  isLarge && 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
                  isMedium && 'sm:col-span-1 lg:col-span-2'
                )}
              >
                <div className="clay clay-hover group relative flex h-full flex-col rounded-2xl p-6">
                  {/* Icon */}
                  <div
                    className={cn(
                      'mb-4 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_16px_-4px_hsl(var(--primary)/0.4)]',
                      isLarge ? 'h-14 w-14' : 'h-11 w-11'
                    )}
                  >
                    <Icon className={cn('text-primary', isLarge ? 'h-7 w-7' : 'h-5 w-5')} />
                  </div>

                  {/* Title */}
                  <h3
                    className={cn(
                      'font-semibold text-white',
                      isLarge ? 'text-xl' : 'text-base'
                    )}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      'mt-2 leading-relaxed text-muted-foreground',
                      isLarge ? 'text-sm md:text-base' : 'text-sm'
                    )}
                  >
                    {feature.description}
                  </p>

                  {/* Status indicator for large card */}
                  {isLarge && (
                    <div className="mt-auto pt-6">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-status-blink" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/70">
                          Always running
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
