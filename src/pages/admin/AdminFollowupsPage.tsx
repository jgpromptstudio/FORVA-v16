import { useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminFollowup } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  queued: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  stopped: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

export function AdminFollowupsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminFollowup>>('followups', { status_filter: statusFilter });

  const followups = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}

      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="queued">Queued</option>
          <option value="sent">Sent</option>
          <option value="cancelled">Cancelled</option>
          <option value="stopped">Stopped</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {followups.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState message="No follow-ups found." />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Follow-ups ({count.toLocaleString()} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Business</th>
                    <th className="pb-3 pr-4 font-medium">Workspace</th>
                    <th className="pb-3 pr-4 font-medium">Scheduled For</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Stop Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {followups.map((f) => (
                    <tr key={f.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-medium text-foreground">{f.business?.name ?? 'Unknown'}</td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(f.workspace_id)}</td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(f.scheduled_for)}</td>
                      <td className="py-3 pr-4">
                        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', statusColors[f.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                          {capitalize(f.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{f.stop_reason ?? 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminStateGuard>
  );
}
