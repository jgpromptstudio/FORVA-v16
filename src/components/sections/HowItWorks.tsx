import { Reveal } from '@/components/Reveal';
import { workflowConfig, workflowSupportingCopy } from '@/config/workflowConfig';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16 lg:pb-32 lg:pt-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">One Connected Workflow</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              From target market to first conversation.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {workflowSupportingCopy}
            </p>
          </Reveal>
        </div>

        {/* Desktop: horizontal connected steps */}
        <Reveal delay={300}>
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-[10%] right-[10%] top-14 h-[2px] bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

              <div className="relative flex justify-between gap-4">
                {workflowConfig.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.step} className="flex w-1/5 flex-col items-center text-center">
                      {/* Step circle */}
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full glass-strong border border-primary/30">
                        <Icon className="h-6 w-6 text-primary" />
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {step.step}
                        </span>
                      </div>

                      <h3 className="mt-5 text-sm font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Mobile/Tablet: stacked timeline */}
        <Reveal delay={300}>
          <div className="lg:hidden">
            <div className="relative space-y-6 pl-8">
              {/* Vertical line */}
              <div className="absolute left-3 top-0 h-full w-[2px] bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10" />

              {workflowConfig.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.step} delay={i * 80}>
                    <div className="relative">
                      {/* Step circle */}
                      <div className="absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 border border-primary/40">
                        <span className="text-[10px] font-bold text-primary">{step.step}</span>
                      </div>

                      <div className="clay rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="text-base font-semibold text-white">{step.title}</h3>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
