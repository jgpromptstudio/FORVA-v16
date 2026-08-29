import { useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminWorkspace } from '@/lib/admin/adminTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 25;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

function totalAvailable(w: AdminWorkspace): number {
  if (!w.credit_account) return 0;
  return (w.credit_account.monthly_remaining ?? 0) + (w.credit_account.topup_remaining ?? 0);
}

export function AdminWorkspacesPage() {
  const [page, setPage] = useState(0);
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminWorkspace>>('workspaces', { page, page_size: PAGE_SIZE });

  const workspaces = data?.data ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      <Card>
        <CardHeader>
          <CardTitle>Workspaces ({count.toLocaleString()} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {workspaces.length === 0 ? (
            <EmptyState message="No workspaces found." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Workspace ID</th>
                      <th className="pb-3 pr-4 font-medium">Owner</th>
                      <th className="pb-3 pr-4 font-medium">Created</th>
                      <th className="pb-3 pr-4 font-medium">Members</th>
                      <th className="pb-3 pr-4 font-medium">Plan</th>
                      <th className="pb-3 pr-4 font-medium">Monthly Allowance</th>
                      <th className="pb-3 pr-4 font-medium">Monthly Remaining</th>
                      <th className="pb-3 pr-4 font-medium">Top-up Remaining</th>
                      <th className="pb-3 pr-4 font-medium">Total Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspaces.map((w) => (
                      <tr key={w.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium text-foreground">{w.name ?? 'Unnamed'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(w.id)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(w.owner_user_id)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(w.created_at)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{w.member_count ?? 0}</td>
                        <td className="py-3 pr-4">
                          <Badge variant="secondary" className="capitalize">{w.credit_account?.plan ?? 'None'}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{w.credit_account?.monthly_allowance?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{w.credit_account?.monthly_remaining?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{w.credit_account?.topup_remaining?.toLocaleString() ?? 'N/A'}</td>
                        <td className="py-3 pr-4 font-medium text-foreground">{totalAvailable(w).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminStateGuard>
  );
}
