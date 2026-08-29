import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminBillingAccount } from '@/lib/admin/adminTypes';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

export function AdminBillingPage() {
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminBillingAccount>>('billing');

  const accounts = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Credit Accounts ({count.toLocaleString()} total)</CardTitle>
          <p className="text-xs text-muted-foreground">Real plan and credit balances across all workspaces. Collected payment revenue is not available until the production payment integration is connected.</p>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <EmptyState message="No credit accounts found." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Workspace ID</th>
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Monthly Allowance</th>
                    <th className="pb-3 pr-4 font-medium">Monthly Remaining</th>
                    <th className="pb-3 pr-4 font-medium">Top-up Remaining</th>
                    <th className="pb-3 pr-4 font-medium">Total Available</th>
                    <th className="pb-3 pr-4 font-medium">Cycle Start</th>
                    <th className="pb-3 pr-4 font-medium">Cycle End</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acct) => {
                    const total = (acct.monthly_remaining ?? 0) + (acct.topup_remaining ?? 0);
                    return (
                      <tr key={acct.workspace_id} className="border-b border-white/5">
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(acct.workspace_id)}</td>
                        <td className="py-3 pr-4"><Badge variant="secondary" className="capitalize">{acct.plan ?? 'None'}</Badge></td>
                        <td className="py-3 pr-4 text-muted-foreground">{acct.monthly_allowance?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{acct.monthly_remaining?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{acct.topup_remaining?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 font-medium text-foreground">{total.toLocaleString()}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(acct.cycle_start)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(acct.cycle_end)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{acct.status ?? 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-xs text-muted-foreground/60">
        Credit adjustments, plan upgrades, and refunds are not available from this interface.
      </p>
    </AdminStateGuard>
  );
}
