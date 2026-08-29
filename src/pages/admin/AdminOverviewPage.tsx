import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminOverviewData } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { formatAcquisitionError, formatTimeAgo } from '@/lib/dashboard/workspace';
import {
  Building2, Briefcase, Mail, Send, MessageSquare, CalendarClock, UserCog,
  Rocket, TrendingUp, DollarSign, Activity, Percent, CreditCard,
} from 'lucide-react';

const statConfig = [
  { key: 'workspaces' as const, label: 'Total Workspaces', icon: Building2 },
  { key: 'prospects' as const, label: 'Total Prospects', icon: Briefcase },
  { key: 'verified' as const, label: 'Verified', icon: Mail },
  { key: 'qualified' as const, label: 'Qualified', icon: Mail },
  { key: 'contacted' as const, label: 'Contacted', icon: Send },
  { key: 'outreach_sent' as const, label: 'Outreach Sent', icon: Send },
  { key: 'inbound_replies' as const, label: 'Inbound Replies', icon: MessageSquare },
  { key: 'pending_followups' as const, label: 'Pending Follow-ups', icon: CalendarClock },
  { key: 'review_items' as const, label: 'Review Items', icon: UserCog },
];

const runStatusColors: Record<string, string> = {
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-white/10 text-muted-foreground border-white/20',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function currency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function AdminOverviewPage() {
  const { data, loading, error, status, refresh } = useAdminApi<AdminOverviewData>('overview');

  const starter = data?.plan_counts.starter ?? 0;
  const growth = data?.plan_counts.growth ?? 0;
  const pro = data?.plan_counts.pro ?? 0;
  const activePlanAccounts = starter + growth + pro;
  const estimatedMrr = starter * 29 + growth * 69 + pro * 99;
  const estimatedArr = estimatedMrr * 12;
  const replyRate = pct(data?.stats.inbound_replies ?? 0, data?.stats.outreach_sent ?? 0);
  const qualificationRate = pct(data?.stats.qualified ?? 0, data?.stats.prospects ?? 0);
  const runCompleted = data?.stats.acquisition_runs.completed ?? 0;
  const runFailed = data?.stats.acquisition_runs.failed ?? 0;
  const runSuccessRate = pct(runCompleted, runCompleted + runFailed);

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            <div className="clay rounded-xl p-4">
              <DollarSign className="h-5 w-5 text-gold" />
              <p className="mt-3 text-2xl font-bold text-white">{currency(estimatedMrr)}</p>
              <p className="text-xs text-muted-foreground">Plan MRR estimate</p>
            </div>
            <div className="clay rounded-xl p-4">
              <TrendingUp className="h-5 w-5 text-gold" />
              <p className="mt-3 text-2xl font-bold text-white">{currency(estimatedArr)}</p>
              <p className="text-xs text-muted-foreground">Plan ARR estimate</p>
            </div>
            <div className="clay rounded-xl p-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold text-white">{activePlanAccounts.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Plan accounts</p>
            </div>
            <div className="clay rounded-xl p-4">
              <Percent className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold text-white">{replyRate}%</p>
              <p className="text-xs text-muted-foreground">Reply rate</p>
            </div>
            <div className="clay rounded-xl p-4">
              <Activity className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold text-white">{qualificationRate}%</p>
              <p className="text-xs text-muted-foreground">Qualification rate</p>
            </div>
            <div className="clay rounded-xl p-4">
              <Rocket className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold text-white">{runSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Run success rate</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/80">
            Revenue cards are plan-value estimates derived from current plan distribution. Actual collected revenue, refunds, failed payments, churn and net revenue require the real payment provider integration and are intentionally not fabricated here.
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {statConfig.map(({ key, label, icon: Icon }) => (
              <div key={key} className="clay rounded-xl p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold text-white">{(data.stats[key] ?? 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" />Acquisition Runs</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(['queued', 'running', 'completed', 'failed'] as const).map((s) => (
                    <div key={s} className="rounded-lg bg-white/5 p-3">
                      <p className="text-xl font-bold text-foreground">{data.stats.acquisition_runs[s] ?? 0}</p>
                      <span className={cn('mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', runStatusColors[s])}>{capitalize(s)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Plan Distribution</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(['starter', 'growth', 'pro'] as const).map((p) => {
                    const count = data.plan_counts[p] ?? 0;
                    const total = activePlanAccounts || 1;
                    return (
                      <div key={p}>
                        <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-medium capitalize text-foreground">{p}</span><span className="text-muted-foreground">{count}</span></div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-primary" style={{ width: `${(count / total) * 100}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" />Recent Acquisition Runs</CardTitle></CardHeader>
              <CardContent>
                {data.recent_runs.length === 0 ? <p className="text-sm text-muted-foreground">No acquisition runs yet.</p> : (
                  <div className="space-y-3">
                    {data.recent_runs.slice(0, 5).map((run) => (
                      <div key={run.id} className="rounded-lg bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', runStatusColors[run.status] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(run.status)}</span>
                          {run.created_at && <span className="text-xs text-muted-foreground">{formatTimeAgo(run.created_at)}</span>}
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">WS: {shortId(run.workspace_id)}</p>
                        {run.requested_prospect_count !== null && <p className="text-xs text-muted-foreground">Requested: {run.requested_prospect_count}</p>}
                        {run.error_message && <p className="mt-1 text-xs text-red-400">{formatAcquisitionError(run.error_message)}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminStateGuard>
  );
}
