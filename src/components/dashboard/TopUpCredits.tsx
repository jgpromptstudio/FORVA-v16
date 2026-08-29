import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus } from 'lucide-react';

const topupPackages = [
  { credits: 500, price: '$22', minPlan: 'starter' },
  { credits: 1000, price: '$44', minPlan: 'starter' },
  { credits: 5000, price: '$220', minPlan: 'growth' },
  { credits: 10000, price: '$440', minPlan: 'pro' },
] as const;

const planRank: Record<string, number> = {
  starter: 1,
  growth: 2,
  pro: 3,
};

type Props = {
  workspaceId: string | null;
  enabled: boolean;
  topupRemaining: number;
  plan?: string | null;
};

export function TopUpCredits({ workspaceId, enabled, topupRemaining, plan }: Props) {
  const [busyCredits, setBusyCredits] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handledReturn = useRef(false);
  const currentRank = planRank[(plan ?? '').toLowerCase()] ?? 0;

  async function buyTopup(credits: number, minPlan: string) {
    if (!enabled || !workspaceId || currentRank < (planRank[minPlan] ?? 99)) return;
    setError(null);
    setMessage(null);
    setBusyCredits(credits);
    try {
      sessionStorage.setItem('forva_topup_starting_balance', String(topupRemaining));
      const { data, error: fnError } = await supabase.functions.invoke('paypal-create-topup-order', {
        body: { credits },
      });
      if (fnError) throw fnError;
      if (!data?.ok || typeof data?.approval_url !== 'string' || !data.approval_url) {
        throw new Error(data?.error || 'PayPal approval URL was not returned.');
      }
      window.location.assign(data.approval_url);
    } catch (e) {
      console.error('PayPal top-up checkout failed', e);
      setError('Unable to start the PayPal top-up checkout. Please try again.');
      setBusyCredits(null);
    }
  }

  useEffect(() => {
    if (!workspaceId || handledReturn.current) return;
    const params = new URLSearchParams(window.location.search);
    const state = params.get('paypal');
    if (state === 'topup-cancelled') {
      handledReturn.current = true;
      setMessage('Top-up checkout cancelled. No credits were added.');
      window.history.replaceState({}, '', '/dashboard/billing');
      return;
    }
    if (state !== 'topup-approved') return;

    const orderId = params.get('token');
    if (!orderId) {
      handledReturn.current = true;
      setError('PayPal returned without an order ID. No credits were added.');
      window.history.replaceState({}, '', '/dashboard/billing');
      return;
    }

    handledReturn.current = true;
    void (async () => {
      setBusyCredits(-1);
      setError(null);
      setMessage('PayPal approved. Verifying payment before adding credits...');
      try {
        const { data, error: fnError } = await supabase.functions.invoke('paypal-capture-topup-order', {
          body: { order_id: orderId },
        });
        if (fnError) throw fnError;
        if (!data?.ok) throw new Error(data?.error || 'PayPal capture failed.');

        const credits = Number(data?.credits ?? 0);
        const starting = Number(sessionStorage.getItem('forva_topup_starting_balance') ?? topupRemaining);
        const target = starting + credits;

        for (let attempt = 0; attempt < 8; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 1000));
          const { data: account } = await supabase.rpc('get_forva_credit_account', {
            p_workspace_id: workspaceId,
          });
          const current = account && typeof account === 'object' && typeof (account as Record<string, unknown>).topup_remaining === 'number'
            ? Number((account as Record<string, unknown>).topup_remaining)
            : null;
          if (current !== null && current >= target) {
            sessionStorage.removeItem('forva_topup_starting_balance');
            window.history.replaceState({}, '', '/dashboard/billing');
            window.location.reload();
            return;
          }
        }

        window.history.replaceState({}, '', '/dashboard/billing');
        setMessage('Payment captured. PayPal verification is still processing; the credits will appear automatically after the verified webhook arrives.');
      } catch (e) {
        console.error('PayPal top-up capture failed', e);
        window.history.replaceState({}, '', '/dashboard/billing');
        setError('Unable to complete the PayPal top-up. No credits are added unless payment verification succeeds.');
      } finally {
        setBusyCredits(null);
      }
    })();
  }, [workspaceId, topupRemaining]);

  if (!enabled) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Buy Additional Credits
        </CardTitle>
        <p className="text-sm text-muted-foreground">One-time PayPal top-ups. Larger packages unlock on higher plans.</p>
      </CardHeader>
      <CardContent>
        {error && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
        {message && <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">{message}</div>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {topupPackages.map((item) => {
            const available = currentRank >= (planRank[item.minPlan] ?? 99);
            const requiredLabel = item.minPlan === 'growth' ? 'Growth plan required' : item.minPlan === 'pro' ? 'Pro plan required' : 'Buy with PayPal';

            return (
              <div key={item.credits} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary">{item.credits.toLocaleString()} credits</Badge>
                  {!available && <Badge variant="outline" className="capitalize">{item.minPlan}+</Badge>}
                </div>
                <p className="mt-3 text-2xl font-bold text-foreground">{item.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">one-time</p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  disabled={busyCredits !== null || !available}
                  onClick={() => buyTopup(item.credits, item.minPlan)}
                >
                  {busyCredits === item.credits && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {busyCredits === item.credits ? 'Opening PayPal' : available ? 'Buy with PayPal' : requiredLabel}
                </Button>
              </div>
            );
          })}
        </div>
        {busyCredits === -1 && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Waiting for verified PayPal payment...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
