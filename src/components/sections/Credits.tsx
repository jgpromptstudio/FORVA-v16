import { Reveal } from '@/components/Reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { creditUsageExamples, creditAverageNote } from '@/config/planConfig';
import { useNavigate } from 'react-router-dom';

export function Credits() {
  const navigate = useNavigate();

  return (
    <section id="credits" className="relative z-10 section-padding">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">FORVA Credits and Top-Ups</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Credits power the work FORVA does for you.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              You spend FORVA Credits depending on the work performed. When your monthly credits run low
              or run out, you can purchase additional top-ups without changing your plan.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Average usage card */}
          <Reveal delay={300} className="lg:col-span-1">
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  Typical Prospect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="text-5xl font-bold text-gradient-teal">10</span>
                  <span className="mt-2 text-sm font-medium text-muted-foreground">
                    FORVA Credits per fully processed prospect
                  </span>
                </div>
                <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
                  {creditAverageNote}
                </p>
              </CardContent>
            </Card>
          </Reveal>

          {/* Usage breakdown card */}
          <Reveal delay={400} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  How Credits Are Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creditUsageExamples.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white/5 p-4"
                    >
                      <span className="text-sm font-medium text-foreground">{item.action}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">+{item.credits}</span>
                        <span className="text-xs text-muted-foreground">credits</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Other applicable acquisition actions may use additional credits. Credit costs reflect
                  the real infrastructure behind each step.
                </p>
              </CardContent>
            </Card>
          </Reveal>

          {/* Top-up CTA card */}
          <Reveal delay={500} className="lg:col-span-3">
            <div className="clay rounded-2xl p-8">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
                <div>
                  <h3 className="text-xl font-semibold text-white">Running low on credits?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Purchase FORVA Credit top-ups without changing your plan. You can also upgrade your
                    plan or connect supported provider accounts you already own.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Button variant="outline" onClick={() => navigate('/signup')} className="group">
                    <Plus className="h-4 w-4 text-primary" />
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
