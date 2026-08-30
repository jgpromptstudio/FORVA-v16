import { useCallback, useEffect, useMemo, useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { BriefcaseBusiness, Loader2, Plus, Save } from 'lucide-react';

type DealRow = {
  id: string;
  business_id: string;
  stage: 'opportunity' | 'won' | 'lost';
  title: string;
  value_amount: number | null;
  currency: string | null;
  won_at: string | null;
  lost_at: string | null;
  created_at: string;
  updated_at: string;
  business_name: string;
};

type CandidateBusiness = { id: string; name: string; state: string | null; public_email: string | null };

const stageClass: Record<string, string> = {
  opportunity: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  won: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  lost: 'border-red-500/30 bg-red-500/10 text-red-300',
};

function money(value: number | null, currency: string | null): string {
  if (value == null) return 'Value not set';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency || 'USD'} ${value.toLocaleString()}`;
  }
}

export function DealsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [title, setTitle] = useState('');
  const [valueAmount, setValueAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const load = useCallback(async () => {
    if (!workspaceId) {
      setDeals([]);
      setCandidates([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const [dealResult, businessResult] = await Promise.all([
      supabase.from('deals').select('id,business_id,stage,title,value_amount,currency,won_at,lost_at,created_at,updated_at').eq('workspace_id', workspaceId).order('updated_at', { ascending: false }),
      supabase.from('businesses').select('id,name,state,public_email').eq('workspace_id', workspaceId).in('state', ['qualified', 'contacted', 'opportunity']).order('updated_at', { ascending: false }).limit(200),
    ]);

    if (dealResult.error || businessResult.error) {
      console.error('FORVA deals load failed', dealResult.error || businessResult.error);
      setError('Deals could not be loaded. Please refresh and try again.');
      setDeals([]);
      setCandidates([]);
      setLoading(false);
      return;
    }

    const businessRows = (businessResult.data as CandidateBusiness[] | null) ?? [];
    const businessMap = new Map(businessRows.map((business) => [business.id, business.name]));
    const rawDeals = (dealResult.data as Array<Omit<DealRow, 'business_name'>> | null) ?? [];
    const missingIds = rawDeals.map((deal) => deal.business_id).filter((id) => !businessMap.has(id));

    if (missingIds.length > 0) {
      const { data: missing } = await supabase.from('businesses').select('id,name').in('id', missingIds);
      if (missing) for (const business of missing) businessMap.set(business.id, business.name);
    }

    setDeals(rawDeals.map((deal) => ({ ...deal, business_name: businessMap.get(deal.business_id) ?? 'Unknown business' })));
    setCandidates(businessRows);
    setLoading(false);
  }, [workspaceId]);

  useEffect(() => { void load(); }, [load]);

  const availableCandidates = useMemo(() => {
    const used = new Set(deals.map((deal) => deal.business_id));
    return candidates.filter((business) => !used.has(business.id));
  }, [candidates, deals]);

  async function createDeal() {
    if (!workspaceId || !selectedBusinessId) return;
    const parsedValue = valueAmount.trim() ? Number(valueAmount) : null;
    if (parsedValue != null && (!Number.isFinite(parsedValue) || parsedValue < 0)) {
      setError('Enter a valid non-negative deal value, or leave it blank.');
      return;
    }

    setBusyId('new');
    setError(null);
    const { data, error: saveError } = await supabase.rpc('forva_manage_deal', {
      p_workspace_id: workspaceId,
      p_deal_id: null,
      p_business_id: selectedBusinessId,
      p_stage: 'opportunity',
      p_title: title.trim() || null,
      p_value_amount: parsedValue,
      p_currency: currency.trim().toUpperCase() || 'USD',
    });

    if (saveError || !data?.ok) {
      console.error('FORVA deal create failed', saveError || data);
      setError('The opportunity could not be created. Please check the details and try again.');
    } else {
      setSelectedBusinessId('');
      setTitle('');
      setValueAmount('');
      setCurrency('USD');
      await load();
    }
    setBusyId(null);
  }

  async function updateDeal(deal: DealRow, stage: DealRow['stage']) {
    if (!workspaceId) return;
    setBusyId(deal.id);
    setError(null);
    const { data, error: saveError } = await supabase.rpc('forva_manage_deal', {
      p_workspace_id: workspaceId,
      p_deal_id: deal.id,
      p_business_id: deal.business_id,
      p_stage: stage,
      p_title: deal.title,
      p_value_amount: deal.value_amount,
      p_currency: deal.currency || 'USD',
    });

    if (saveError || !data?.ok) {
      console.error('FORVA deal update failed', saveError || data);
      setError('The deal stage could not be updated. Please try again.');
    } else {
      await load();
    }
    setBusyId(null);
  }

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={load} refreshing={loading}>
      <div className="mb-5">
        <GuidanceCard title="How Deals works">
          <p>Deals is your simple sales pipeline after a prospect becomes a real opportunity. Add a qualified prospect, optionally record an estimated value, then move it to Won or Lost when the outcome is known. FORVA does not invent deal values or revenue.</p>
        </GuidanceCard>
      </div>

      {error && <ErrorBanner error={error} />}

      <Card className="mb-5">
        <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />Add Opportunity</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-4">
            <select value={selectedBusinessId} onChange={(e) => setSelectedBusinessId(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none lg:col-span-2">
              <option value="">Select a qualified prospect</option>
              {availableCandidates.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
            </select>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Deal title (optional)" maxLength={140} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
            <div className="flex gap-2"><input type="number" min="0" step="0.01" value={valueAmount} onChange={(e) => setValueAmount(e.target.value)} placeholder="Value" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" /><input type="text" value={currency} onChange={(e) => setCurrency(e.target.value.slice(0, 3).toUpperCase())} maxLength={3} aria-label="Currency code" className="w-20 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm uppercase text-foreground focus:border-primary/50 focus:outline-none" /></div>
          </div>
          <div className="mt-3 flex justify-end"><Button disabled={!selectedBusinessId || busyId === 'new'} onClick={() => void createDeal()}>{busyId === 'new' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Create Opportunity</Button></div>
          {availableCandidates.length === 0 && !loading && <p className="mt-3 text-xs text-muted-foreground">No unused qualified prospects are available right now. Qualify prospects first, or existing opportunities will appear below.</p>}
        </CardContent>
      </Card>

      {loading ? <LoadingState /> : deals.length === 0 ? (
        <Card><CardContent><EmptyState message="No deals yet. Add a qualified prospect when it becomes a real sales opportunity." /></CardContent></Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {(['opportunity', 'won', 'lost'] as const).map((stage) => {
            const rows = deals.filter((deal) => deal.stage === stage);
            return (
              <Card key={stage}>
                <CardHeader><CardTitle className="flex items-center justify-between"><span>{stage === 'opportunity' ? 'Opportunities' : stage === 'won' ? 'Won' : 'Lost'}</span><span className={cn('rounded-full border px-2 py-0.5 text-xs', stageClass[stage])}>{rows.length}</span></CardTitle></CardHeader>
                <CardContent>
                  {rows.length === 0 ? <p className="py-5 text-center text-xs text-muted-foreground">Nothing here yet.</p> : <div className="space-y-3">{rows.map((deal) => <div key={deal.id} className="rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex items-start gap-2"><BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div className="min-w-0"><p className="text-sm font-semibold text-foreground">{deal.title}</p><p className="mt-1 text-xs text-muted-foreground">{deal.business_name}</p><p className="mt-2 text-sm font-medium text-foreground">{money(deal.value_amount, deal.currency)}</p></div></div><div className="mt-4 flex flex-wrap gap-2">{stage !== 'opportunity' && <Button variant="outline" size="sm" disabled={busyId === deal.id} onClick={() => void updateDeal(deal, 'opportunity')}>Opportunity</Button>}{stage !== 'won' && <Button variant="outline" size="sm" disabled={busyId === deal.id} onClick={() => void updateDeal(deal, 'won')}>Won</Button>}{stage !== 'lost' && <Button variant="outline" size="sm" disabled={busyId === deal.id} onClick={() => void updateDeal(deal, 'lost')}>Lost</Button>}</div></div>)}</div>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </WorkspaceGuard>
  );
}
