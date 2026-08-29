import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkspace, useCreditAccount } from '@/lib/dashboard/useWorkspace';
import { plansConfig } from '@/config/planConfig';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Check, Gauge, Loader2, Calendar } from 'lucide-react';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function BillingPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data: credit, loading: creditLoading, error: creditError, reason } = useCreditAccount(workspaceId);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalAvailable = credit
    ? (credit.monthly_remaining ?? 0) + (credit.topup_remaining ?? 0)
    : null;

  const hasActivePlan = Boolean(credit?.plan);

  async function startSubscription(planName: string) {
    const plan = planName.trim().toLowerCase();

    if (!['starter', 'growth', 'pro'].includes(plan)) {
      setCheckoutError('This plan is not available for checkout.');
      return;
    }

    setCheckoutError(null);
    setCheckoutPlan(plan);

    try {
      const { data, error } = await supabase.functions.invoke('paypal-create-subscription', {
        body: { plan },
      });

      if (error) {
        throw error;
      }

      if (!data?.ok || typeof data?.approval_url !== 'string' || !data.approval_url) {
        throw new Error(data?.error || 'PayPal approval URL was not returned.');
      }

      window.location.assign(data.approval_url);
    } catch (error) {
      console.error('PayPal subscription checkout failed', error);
      setCheckoutError('Unable to start PayPal checkout. Please try again.');
      setCheckoutPlan(null);
    }
  }

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creditLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : credit ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <Badge variant="secondary" className="capitalize">{credit.plan ?? 'Unknown'}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-xs text-muted-foreground">Monthly Allowance</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{(credit.monthly_allowance ?? 0).toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-xs text-muted-foreground">Monthly Remaining</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{(credit.monthly_remaining ?? 0).toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-4">
                  <p className="text-xs text-muted-foreground">Top-up Remaining</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{(credit.topup_remaining ?? 0).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                  <p className="text-xs text-muted-foreground">Total Available</p>
                  <p className="mt-1 text-xl font-bold text-primary">{(totalAvailable ?? 0).toLocaleString()}</p>
                </div>
              </div>
              {(credit.cycle_start || credit.cycle_end) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Cycle: {formatDate(credit.cycle_start)} - {formatDate(credit.cycle_end)}</span>
                </div>
              )}
            </div>
          ) : reason === 'credit_account_not_provisioned' ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-foreground">No active plan yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Your workspace is ready, but no paid credit account has been activated.</p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">Credit status unavailable</p>
              <p className="mt-1 text-xs text-muted-foreground/60">{creditError ? 'Refresh the page or try again shortly.' : 'Refresh the page or try again shortly.'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {checkoutError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plansConfig.map((plan) => {
          const planKey = plan.name.toLowerCase();
          const isCurrentPlan = credit?.plan?.toLowerCase() === planKey;
          const isCheckingOut = checkoutPlan === planKey;
          const checkoutBusy = checkoutPlan !== null;
          const disablePlanChange = hasActivePlan && !isCurrentPlan;

          return (
            <Card key={plan.name} className={cn('relative flex flex-col', isCurrentPlan && 'border-primary/40 ring-1 ring-primary/20')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrentPlan && <Badge variant="gold">Current plan</Badge>}
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <Badge variant="secondary" className="w-fit">{plan.credits}</Badge>
                <p className="mt-2 text-xs text-muted-foreground">{plan.prospects}</p>
                <div className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-2">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    disabled={disablePlanChange || checkoutBusy || creditLoading}
                    onClick={() => startSubscription(plan.name)}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Opening PayPal
                      </>
                    ) : isCurrentPlan ? (
                      'Subscribe with PayPal'
                    ) : disablePlanChange ? (
                      'Plan change unavailable'
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60">
        PayPal checkout creates the subscription approval flow only. Credits activate only after verified payment processing.
      </p>
    </WorkspaceGuard>
  );
}
