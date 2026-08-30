import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFollowups } from '@/lib/dashboard/useFollowups';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import { formatStopReason } from '@/lib/dashboard/workspace';
import { ClipboardCheck } from 'lucide-react';

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
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function FollowupsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, loading, error, refresh } = useFollowups(workspaceId, statusFilter);

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
      onRefresh={refresh}
      refreshing={loading}
    >
      <div className="mb-5">
        <GuidanceCard title="How follow-ups work">
          <div className="space-y-2">
            <p>FORVA schedules a follow-up when outreach was sent and no reply has stopped the sequence.</p>
            <p><span className="font-medium text-foreground">Manual mode:</span> a follow-up draft waits in Review Queue for you. <span className="font-medium text-foreground">Auto-Pilot:</span> it can send automatically only when you enabled follow-up auto-send in Settings and all safety checks pass.</p>
            <p>When a prospect replies, unsubscribes or becomes ineligible, FORVA stops unnecessary follow-ups.</p>
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link to="/dashboard/reviews"><ClipboardCheck className="h-4 w-4" />Open Review Queue</Link>
            </Button>
          </div>
        </GuidanceCard>
      </div>

      {error && <ErrorBanner error={error} />}

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="queued">Queued</option>
          <option value="sent">Sent</option>
          <option value="cancelled">Cancelled</option>
          <option value="stopped">Stopped</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <Card><CardContent><EmptyState message="No follow-ups found." /></CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Follow-ups</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Business</th>
                    <th className="pb-3 pr-4 font-medium">Scheduled For</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Stop Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((f) => (
                    <tr key={f.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-medium text-foreground">{f.business_name}</td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(f.scheduled_for)}</td>
                      <td className="py-3 pr-4">
                        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', statusColors[f.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                          {capitalize(f.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{formatStopReason(f.stop_reason)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </WorkspaceGuard>
  );
}
