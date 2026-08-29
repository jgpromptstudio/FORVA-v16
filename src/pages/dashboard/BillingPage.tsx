import { useCallback, useEffect, useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { TopUpCredits } from '@/components/dashboard/TopUpCredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkspace, useCreditAccount } from '@/lib/dashboard/useWorkspace';
import { plansConfig } from '@/config/planConfig';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Check, Gauge, Loader2, Calendar } from 'lucide-react';

type BillingSubscription = {
  ok: boolean;
  provider?: string;
  provider_subscription_id?: string;
  plan?: string;
  pending_plan?: string | null;
  status?: string;
  environment?: string;
  last_payment_at?: string | null;
  cancel_requested_at?: string | null;
  plan_change_approval_state?: string | null;
  plan_change_requested_plan?: string | null;
  plan_change_approved_plan?: string | null;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function BillingPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data: credit, loading: creditLoading, error: creditError, reason } = useCreditAccount(workspaceId);
  const [billing, setBilling] = useState<BillingSubscription | null>(null);
  const [billingLoading, setBillingLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [billingNotice, setBillingNotice] = useState<string | null>(null);

  const loadBilling = useCallback(async () => {
    if (!workspaceId) {
      setBilling(null);
      setBillingLoading(false);
      return;
    }

    setBillingLoading(true);
    const { data, error } = await supabase.rpc('get_my_forva_billing_subscription', {
      p_workspace_id: workspaceId,
    });

    if (error) {
      console.error('Billing subscription lookup failed', error);
      setBilling(null);
    } else {
      setBilling(data as BillingSubscription);
    }
    setBillingLoading(false);
  }, [workspaceId]);

  useEffect(() => {
    void loadBilling();
  }, [loadBilling]);

  const totalAvailable = credit
    ? (credit.monthly_remaining ?? 0) + (credit.topup_remaining ?? 0)
    : null;

  const trackedPayPal = billing?.ok && billing.provider === 'paypal';
  const billingStatus = trackedPayPal ? billing.status ?? '' : '';
  const activeSubscription = trackedPayPal && ['active', 'payment_failed', 'suspended'].includes(billingStatus);
  const pendingSubscription = trackedPayPal && billingStatus === 'approval_pending';
  const cancelledSubscription = trackedPayPal && billingStatus === 'cancelled';
  const currentPlan = credit?.plan?.toLowerCase() || (trackedPayPal ? billing.plan?.toLowerCase() : undefined);
  const pendingPlan = trackedPayPal ? billing.pending_plan?.toLowerCase() : null;
  const planChangeApprovalState = trackedPayPal ? billing.plan_change_approval_state?.toLowerCase() ?? null : null;
  const approvedPlan = trackedPayPal ? billing.plan_change_approved_plan?.toLowerCase() ?? null : null;
  const untrackedLegacyCredit = Boolean(credit && !trackedPayPal);

  async function startSubscription(planName: string) {
    const plan = planName.trim().toLowerCase();
    if (!['starter', 'growth', 'pro'].includes(plan)) return;

    setCheckoutError(null);
    setBillingNotice(null);
    setCheckoutPlan(plan);

    try {
      const { data, error } = await supabase.functions.invoke('paypal-create-subscription', {
        body: { plan },
      });
      if (error) throw error;
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

  async function changePlan(planName: string) {
    const plan = planName.trim().toLowerCase();
    setCheckoutError(null);
    setBillingNotice(null);
    setActionBusy(`revise:${plan}`);

    try {
      const { data, error } = await supabase.functions.invoke('paypal-manage-subscription', {
        body: { action: 'revise', plan },
      });
      if (error) throw error;
      if (!data?.ok || typeof data?.approval_url !== 'string' || !data.approval_url) {
        throw new Error(data?.error || 'PayPal approval URL was not returned.');
      }
      window.location.assign(data.approval_url);
    } catch (error) {
      console.error('PayPal plan change failed', error);
      setCheckoutError('Unable to start the PayPal plan change. Please try again.');
      setActionBusy(null);
    }
  }

  async function cancelSubscription() {
    const confirmed = window.confirm('Cancel your PayPal subscription? Your current paid credits remain usable until the end of this billing cycle, but the plan will not renew.');
    if (!confirmed) return;

    setCheckoutError(null);
    setBillingNotice(null);
    setActionBusy('cancel');

    try {
      const { data, error } = await supabase.functions.invoke('paypal-manage-subscription', {
        body: { action: 'cancel' },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error || 'Cancellation failed.');
      setBillingNotice(data?.access_until
        ? `Subscription cancelled. Current paid credits remain available until ${formatDate(data.access_until)}.`
        : 'Subscription cancelled. It will not renew.');
      await loadBilling();
    } catch (error) {
      console.error('PayPal cancellation failed', error);
      setCheckoutError('Unable to cancel the PayPal subscription. Please try again.');
    } finally {
      setActionBusy(null);
    }
  }

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Credit Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creditLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : credit ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Plan</span>
                <Badge variant="secondary" className="capitalize">{credit.plan ?? 'Unknown'}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-white/5 p-4"><p className="text-xs text-muted-foreground">Monthly Allowance</p><p className="mt-1 text-xl font-bold text-foreground">{(credit.monthly_allowance ?? 0).toLocaleString()}</p></div>
                <div className="rounded-lg bg-white/5 p-4"><p className="text-xs text-muted-foreground">Monthly Remaining</p><p className="mt-1 text-xl font-bold text-foreground">{(credit.monthly_remaining ?? 0).toLocaleString()}</p></div>
                <div className="rounded-lg bg-white/5 p-4"><p className="text-xs text-muted-foreground">Top-up Remaining</p><p className="mt-1 text-xl font-bold text-foreground">{(credit.topup_remaining ?? 0).toLocaleString()}</p></div>
                <div className="rounded-lg border border-primary/20 bg-primary/10 p-4"><p className="text-xs text-muted-foreground">Total Available</p><p className="mt-1 text-xl font-bold text-primary">{(totalAvailable ?? 0).toLocaleString()}</p></div>
              </div>
              {(credit.cycle_start || credit.cycle_end) && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" /><span>Cycle: {formatDate(credit.cycle_start)} - {formatDate(credit.cycle_end)}</span></div>
              )}
              {pendingPlan && (
                <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  {planChangeApprovalState === 'approved' && approvedPlan === pendingPlan ? (
                    <>Plan change approved: <span className="capitalize font-medium">{pendingPlan}</span>. The new PayPal price and FORVA credits will apply on the next verified billing payment.</>
                  ) : (
                    <>Plan change requested: <span className="capitalize font-medium">{pendingPlan}</span>. Complete PayPal approval to schedule the new price and FORVA credits for the next billing payment.</>
                  )}
                </div>
              )}
              {cancelledSubscription && (
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  This PayPal subscription is cancelled and will not renew. Current paid credits remain usable until the cycle ends.
                </div>
              )}
            </div>
          ) : reason === 'credit_account_not_provisioned' ? (
            <div className="py-8 text-center"><p className="text-sm font-medium text-foreground">No active plan yet</p><p className="mt-1 text-xs text-muted-foreground">Your workspace is ready, but no paid credit account has been activated.</p></div>
          ) : (
            <div className="py-8 text-center"><p className="text-sm font-medium text-muted-foreground">Credit status unavailable</p><p className="mt-1 text-xs text-muted-foreground/60">{creditError ? 'Refresh the page or try again shortly.' : 'Refresh the page or try again shortly.'}</p></div>
          )}
        </CardContent>
      </Card>

      {checkoutError && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{checkoutError}</div>}
      {billingNotice && <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">{billingNotice}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plansConfig.map((plan) => {
          const planKey = plan.name.toLowerCase();
          const isCurrentPlan = currentPlan === planKey;
          const isPendingPlan = pendingPlan === planKey;
          const isApprovedPendingPlan = isPendingPlan && planChangeApprovalState === 'approved' && approvedPlan === planKey;
          const isCheckingOut = checkoutPlan === planKey;
          const isChanging = actionBusy === `revise:${planKey}`;
          const busy = checkoutPlan !== null || actionBusy !== null || creditLoading || billingLoading;

          let buttonLabel = plan.cta;
          let disabled = busy;
          let onClick = () => startSubscription(plan.name);

          if (pendingSubscription) {
            if (billing?.plan === planKey) {
              buttonLabel = 'Continue PayPal approval';
              onClick = () => startSubscription(plan.name);
            } else {
              buttonLabel = 'Checkout in progress';
              disabled = true;
            }
          } else if (activeSubscription) {
            if (isCurrentPlan) {
              buttonLabel = 'Current plan';
              disabled = true;
            } else if (isPendingPlan) {
              if (isApprovedPendingPlan) {
                buttonLabel = `${plan.name} scheduled for next cycle`;
                disabled = true;
              } else {
                buttonLabel = `Continue change to ${plan.name}`;
                onClick = () => changePlan(plan.name);
              }
            } else if (billingStatus === 'active') {
              buttonLabel = `Change to ${plan.name}`;
              onClick = () => changePlan(plan.name);
            } else {
              buttonLabel = 'Resolve billing status first';
              disabled = true;
            }
          } else if (cancelledSubscription) {
            buttonLabel = isCurrentPlan ? 'Cancelled - active until cycle end' : 'Available after cycle ends';
            disabled = true;
          } else if (untrackedLegacyCredit) {
            buttonLabel = isCurrentPlan ? 'Current plan' : 'Billing reconciliation required';
            disabled = true;
          }

          return (
            <Card key={plan.name} className={cn('relative flex flex-col', isCurrentPlan && 'border-primary/40 ring-1 ring-primary/20')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrentPlan && <Badge variant="gold">Current plan</Badge>}
                  {isPendingPlan && !isCurrentPlan && <Badge variant="secondary">{isApprovedPendingPlan ? 'Scheduled' : 'Next cycle'}</Badge>}
                </div>
                <div className="mt-2"><span className="text-3xl font-bold text-white">{plan.price}</span><span className="text-sm text-muted-foreground">{plan.period}</span></div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <Badge variant="secondary" className="w-fit">{plan.credits}</Badge>
                <p className="mt-2 text-xs text-muted-foreground">{plan.prospects}</p>
                <div className="mt-4 space-y-2">
                  {plan.features.map((feature) => <div key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-xs text-muted-foreground">{feature}</span></div>)}
                </div>
                <div className="mt-6 pt-2">
                  <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'} disabled={disabled} onClick={onClick}>
                    {(isCheckingOut || isChanging) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isCheckingOut ? 'Opening PayPal' : isChanging ? 'Opening PayPal' : buttonLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TopUpCredits
        workspaceId={workspaceId}
        enabled={trackedPayPal && billingStatus === 'active'}
        topupRemaining={credit?.topup_remaining ?? 0}
      />

      {activeSubscription && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" disabled={actionBusy !== null} onClick={cancelSubscription}>
            {actionBusy === 'cancel' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cancel PayPal subscription
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground/60">
        Credits activate or renew only after verified PayPal payment processing. Plan changes take effect on the next billing cycle.
      </p>
    </WorkspaceGuard>
  );
}
