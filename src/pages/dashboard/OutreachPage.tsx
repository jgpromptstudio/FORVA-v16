import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOutreach } from '@/lib/dashboard/useOutreach';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import { Eye, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  suppressed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-white/10 text-muted-foreground border-white/20',
  pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const approvalColors: Record<string, string> = {
  approved: 'bg-emerald-500/15 text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-400',
  rejected: 'bg-red-500/15 text-red-400',
  not_required: 'bg-primary/10 text-primary',
};

function capitalize(str: string | null | undefined): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Not sent yet';
  return new Date(dateStr).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getRecipient(msg: { contact_email: string | null; business_public_email: string | null }): string {
  return msg.contact_email || msg.business_public_email || 'No recipient address';
}

function preview(body: string | null | undefined): string {
  if (!body) return 'No message body saved.';
  const text = body.replace(/\s+/g, ' ').trim();
  return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

export function OutreachPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data, loading, error, refresh } = useOutreach(workspaceId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={refresh} refreshing={loading}>
      <div className="mb-5">
        <GuidanceCard title="What you see in Outreach">
          <p>This is your real message history. Open any item to see the exact subject and message FORVA stored, who it was addressed to, whether approval was required, and the latest send status. Drafts that still need your decision belong in Review Queue.</p>
        </GuidanceCard>
      </div>

      {error && <ErrorBanner error={error} />}
      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <Card><CardContent><EmptyState message="No outreach messages yet. Launch a client search to begin." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {data.map((msg) => {
            const expanded = expandedId === msg.id;
            const recipient = getRecipient(msg);
            const failed = msg.status === 'failed' || Boolean(msg.last_error);
            return (
              <Card key={msg.id}>
                <CardContent>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{msg.business_name}</p>
                        <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', statusColors[msg.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(msg.status)}</span>
                        {msg.approval_state && <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', approvalColors[msg.approval_state] ?? 'bg-white/10 text-muted-foreground')}>{capitalize(msg.approval_state)}</span>}
                      </div>

                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-4">
                        <p className="min-w-0"><span className="text-foreground">To:</span> <span className="break-all">{recipient}</span></p>
                        <p><span className="text-foreground">Channel:</span> {capitalize(msg.channel)}</p>
                        <p><span className="text-foreground">Sent:</span> {formatDateTime(msg.sent_at)}</p>
                        <p><span className="text-foreground">Attempts:</span> {msg.send_attempt_count ?? 0}</p>
                      </div>

                      <div className="mt-3 rounded-lg bg-white/5 p-3">
                        <p className="text-sm font-medium text-foreground">{msg.subject || 'No subject'}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{expanded ? (msg.body || 'No message body saved.') : preview(msg.body)}</p>
                      </div>

                      {failed && (
                        <div className="mt-3 flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>This message needs attention. FORVA recorded a send failure. Refresh after the issue is resolved before taking another action.</span>
                        </div>
                      )}

                      {msg.provider_message_id && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />Provider tracking ID recorded
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {msg.body && <Button variant="outline" size="sm" onClick={() => setExpandedId(expanded ? null : msg.id)}><Eye className="h-4 w-4" />{expanded ? 'Hide Message' : 'View Message'}</Button>}
                      {recipient !== 'No recipient address' && <Button variant="ghost" size="sm" asChild><a href={`mailto:${recipient}`}><Mail className="h-4 w-4" />Email</a></Button>}
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
