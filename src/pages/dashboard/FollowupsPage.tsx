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
import { ClipboardCheck, Eye, MailCheck } from 'lucide-react';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  queued: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  stopped: 'bg-red-500/20 text-red-400 border-red-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function capitalize(str: string | null | undefined): string {
  if (!str) return 'N/A';
  return str.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function preview(body: string | null | undefined): string {
  if (!body) return 'No draft saved yet.';
  const text = body.replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

export function FollowupsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data, loading, error, refresh } = useFollowups(workspaceId, statusFilter);

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={refresh} refreshing={loading}>
      <div className="mb-5">
        <GuidanceCard title="How follow-ups work">
          <div className="space-y-2">
            <p>FORVA schedules follow-ups only while a prospect still needs one.</p>
            <p><span className="font-medium text-foreground">Manual:</span> the draft waits in Review Queue. <span className="font-medium text-foreground">Auto-Pilot:</span> it can send automatically only when follow-up auto-send is enabled in Settings and safety checks still pass.</p>
            <p>A reply, unsubscribe, or eligibility change stops unnecessary follow-ups. Use View Draft below to see the exact saved message when one exists.</p>
            <Button variant="outline" size="sm" asChild className="mt-1"><Link to="/dashboard/reviews"><ClipboardCheck className="h-4 w-4" />Open Review Queue</Link></Button>
          </div>
        </GuidanceCard>
      </div>

      {error && <ErrorBanner error={error} />}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none sm:w-auto">
          <option value="all">All statuses</option><option value="scheduled">Scheduled</option><option value="queued">Queued</option><option value="sent">Sent</option><option value="cancelled">Cancelled</option><option value="stopped">Stopped</option><option value="failed">Failed</option><option value="completed">Completed</option>
        </select>
        <p className="text-xs text-muted-foreground">Showing up to 50 most recent follow-ups.</p>
      </div>

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <Card><CardContent><EmptyState message="No follow-ups found for this filter." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {data.map((f) => {
            const expanded = expandedId === f.id;
            return (
              <Card key={f.id}>
                <CardContent>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{f.business_name}</p>
                        <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', statusColors[f.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(f.status)}</span>
                        {f.mode && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{capitalize(f.mode)}</span>}
                      </div>

                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                        <p><span className="text-foreground">Scheduled:</span> {formatDateTime(f.scheduled_for)}</p>
                        <p><span className="text-foreground">Sequence:</span> {f.sequence_no ?? 'N/A'}</p>
                        <p><span className="text-foreground">Attempts:</span> {f.attempt_count ?? 0}</p>
                      </div>

                      {f.stop_reason && <p className="mt-3 text-xs text-muted-foreground"><span className="text-foreground">Stopped because:</span> {formatStopReason(f.stop_reason)}</p>}
                      {f.sent_at && <p className="mt-2 text-xs text-muted-foreground"><span className="text-foreground">Sent:</span> {formatDateTime(f.sent_at)}</p>}
                      {f.last_error && <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">This follow-up needs attention. Open Review Queue or refresh after fixing the issue.</div>}

                      {expanded && (
                        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
                          <p className="text-xs font-semibold text-foreground">Saved follow-up draft</p>
                          {f.draft_subject && <p className="mt-2 text-sm font-medium text-foreground">{f.draft_subject}</p>}
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{f.draft_body || 'No draft body has been saved yet.'}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {(f.draft_body || f.draft_subject) && <Button variant="outline" size="sm" onClick={() => setExpandedId(expanded ? null : f.id)}><Eye className="h-4 w-4" />{expanded ? 'Hide Draft' : 'View Draft'}</Button>}
                      {(f.status === 'scheduled' || f.status === 'queued') && <Button variant="outline" size="sm" asChild><Link to="/dashboard/reviews"><MailCheck className="h-4 w-4" />Review</Link></Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </WorkspaceGuard>
  );
}
