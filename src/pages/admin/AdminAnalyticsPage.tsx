import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminOverviewData } from '@/lib/admin/adminTypes';
import { BarChart3, DollarSign, MessageSquare, Rocket, Target, Users } from 'lucide-react';

function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function money(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function AdminAnalyticsPage() {
  const { data, loading, error, status, refresh } = useAdminApi<AdminOverviewData>('overview');
  const starter = data?.plan_counts.starter ?? 0;
  const growth = data?.plan_counts.growth ?? 0;
  const pro = data?.plan_counts.pro ?? 0;
  const mrr = starter * 29 + growth * 69 + pro * 99;
  const runCompleted = data?.stats.acquisition_runs.completed ?? 0;
  const runFailed = data?.stats.acquisition_runs.failed ?? 0;

  const metrics = [
    { label: 'Verification rate', value: `${pct(data?.stats.verified ?? 0, data?.stats.prospects ?? 0)}%`, icon: Users },
    { label: 'Qualification rate', value: `${pct(data?.stats.qualified ?? 0, data?.stats.prospects ?? 0)}%`, icon: Target },
    { label: 'Outreach / qualified', value: `${pct(data?.stats.outreach_sent ?? 0, data?.stats.qualified ?? 0)}%`, icon: BarChart3 },
    { label: 'Reply rate', value: `${pct(data?.stats.inbound_replies ?? 0, data?.stats.outreach_sent ?? 0)}%`, icon: MessageSquare },
    { label: 'Run success rate', value: `${pct(runCompleted, runCompleted + runFailed)}%`, icon: Rocket },
    { label: 'Plan MRR estimate', value: money(mrr), icon: DollarSign },
  ];

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {data && <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map(({ label, value, icon: Icon }) => (
            <div key={label} className="clay rounded-xl p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Acquisition Funnel</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                ['Prospects', data.stats.prospects],
                ['Verified', data.stats.verified],
                ['Qualified', data.stats.qualified],
                ['Contacted', data.stats.contacted],
                ['Inbound Replies', data.stats.inbound_replies],
              ].map(([label, value]) => {
                const n = Number(value);
                const base = data.stats.prospects || 1;
                return (
                  <div key={String(label)}>
                    <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="text-muted-foreground">{n.toLocaleString()}</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (n / base) * 100)}%` }} /></div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revenue Data Status</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between"><span>Plan MRR estimate</span><span className="font-semibold text-foreground">{money(mrr)}</span></div>
              <div className="flex items-center justify-between"><span>Plan ARR estimate</span><span className="font-semibold text-foreground">{money(mrr * 12)}</span></div>
              <div className="border-t border-white/10 pt-3 text-xs text-muted-foreground/70">
                Actual collected revenue, refunds, failed payments, churn, LTV and net revenue are not available until FORVA connects its production payment provider data. This dashboard does not invent those values.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>}
    </AdminStateGuard>
  );
}
