import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminSystemData } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { Rocket, ScrollText } from 'lucide-react';

const runStatusColors: Record<string, string> = {
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AdminSystemPage() {
  const { data, loading, error, status, refresh } = useAdminApi<AdminSystemData>('system');

  const recentRuns = data?.acquisition_runs ?? [];
  const auditLogs = data?.audit_logs ?? [];

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Recent Acquisition Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRuns.length === 0 ? (
              <EmptyState message="No acquisition runs found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Run ID</th>
                      <th className="pb-3 pr-4 font-medium">Workspace</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">Requested</th>
                      <th className="pb-3 pr-4 font-medium">n8n Execution</th>
                      <th className="pb-3 pr-4 font-medium">Started</th>
                      <th className="pb-3 pr-4 font-medium">Completed</th>
                      <th className="pb-3 pr-4 font-medium">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRuns.slice(0, 10).map((run) => (
                      <tr key={run.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(run.id)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(run.workspace_id)}</td>
                        <td className="py-3 pr-4">
                          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', runStatusColors[run.status] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                            {capitalize(run.status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{run.requested_prospect_count ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{run.n8n_execution_id ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(run.started_at)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(run.completed_at)}</td>
                        <td className="py-3 pr-4 text-xs text-red-400">{run.error_message ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditLogs.length === 0 ? (
              <EmptyState message="No audit logs found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Action</th>
                      <th className="pb-3 pr-4 font-medium">Workspace</th>
                      <th className="pb-3 pr-4 font-medium">Actor</th>
                      <th className="pb-3 pr-4 font-medium">Entity Type</th>
                      <th className="pb-3 pr-4 font-medium">Entity ID</th>
                      <th className="pb-3 pr-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.slice(0, 25).map((log) => (
                      <tr key={log.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium text-foreground">{log.action ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(log.workspace_id)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(log.actor_user_id)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{log.entity_type ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(log.entity_id)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminStateGuard>
  );
}
