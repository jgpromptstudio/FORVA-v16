import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/lib/dashboard/useReviews';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { formatTimeAgo, type ReviewRow } from '@/lib/dashboard/workspace';
import { CheckCircle2, Eye, Loader2, Pencil, Save, Send, XCircle } from 'lucide-react';

const priorityColors: Record<string, string> = {
  High: 'bg-gold/20 text-gold border border-gold/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Low: 'bg-white/10 text-muted-foreground',
};

type ReviewAction = 'edit' | 'approve' | 'send' | 'reject' | 'retry';

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function previewBody(body: string | null): string {
  if (!body) return '';
  const normalized = body.replace(/\s+/g, ' ').trim();
  return normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized;
}

export function ReviewsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data, loading, error, refresh } = useReviews(workspaceId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  function beginEdit(item: ReviewRow) {
    setExpandedId(item.id);
    setEditingId(item.id);
    setEditSubject(item.subject ?? '');
    setEditBody(item.body ?? '');
    setActionError(null);
    setActionNotice(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditSubject('');
    setEditBody('');
  }

  async function invokeReviewAction(
    item: ReviewRow,
    action: ReviewAction,
    extra?: { subject?: string; body?: string },
  ) {
    if (item.source !== 'manual_outreach') return;

    if (action === 'reject') {
      const confirmed = window.confirm('Reject this outreach draft? It will be cancelled and will not be sent.');
      if (!confirmed) return;
    }

    if (action === 'edit' && !editBody.trim()) {
      setActionError('Message body is required.');
      return;
    }

    const key = `${item.id}:${action}`;
    setBusyKey(key);
    setActionError(null);
    setActionNotice(null);

    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke('forva-review-outreach', {
        body: {
          message_id: item.id,
          action,
          ...extra,
        },
      });

      if (invokeError) throw invokeError;
      if (!result?.ok) throw new Error(result?.error || 'Review action failed.');

      if (action === 'edit') {
        setActionNotice('Draft updated successfully.');
        cancelEdit();
      } else if (action === 'reject') {
        setActionNotice('Outreach rejected and cancelled.');
        setExpandedId(null);
      } else if (action === 'retry') {
        setActionNotice('Outreach queued for another send attempt.');
      } else {
        setActionNotice('Outreach approved and queued for sending.');
        setExpandedId(null);
      }

      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to complete the review action.');
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
      onRefresh={refresh}
      refreshing={loading}
    >
      {error && <ErrorBanner error={error} />}
      {actionError && <ErrorBanner error={actionError} />}
      {actionNotice && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-xs text-emerald-400">{actionNotice}</p>
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState message="No items require review. Review outreach that needs your approval or manual action before it can continue." />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const expanded = expandedId === item.id;
            const editing = editingId === item.id;
            const isManualOutreach = item.source === 'manual_outreach';
            const isBusy = busyKey?.startsWith(`${item.id}:`) ?? false;

            return (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <p className="text-sm font-semibold text-foreground">{item.business_name}</p>
                          <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                          {item.intent && (
                            <Badge variant="outline" className="text-xs">{capitalize(item.intent)}</Badge>
                          )}
                        </div>
                        {item.occurred_at && (
                          <p className="mt-1 text-xs text-muted-foreground">{formatTimeAgo(item.occurred_at)}</p>
                        )}
                      </div>
                      <Badge className={cn('w-fit', priorityColors[item.priority] ?? priorityColors['Medium'])}>
                        {item.priority}
                      </Badge>
                    </div>

                    {!editing && (item.subject || item.body) && (
                      <div className="rounded-lg bg-white/5 p-3">
                        {item.subject && <p className="mb-2 text-sm font-medium text-foreground">{item.subject}</p>}
                        {item.body && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {expanded ? item.body : previewBody(item.body)}
                          </p>
                        )}
                      </div>
                    )}

                    {editing && isManualOutreach && (
                      <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Subject</label>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Message</label>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={8}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            disabled={isBusy}
                            onClick={() => invokeReviewAction(item, 'edit', { subject: editSubject, body: editBody })}
                          >
                            {busyKey === `${item.id}:edit` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Edit
                          </Button>
                          <Button variant="outline" size="sm" disabled={isBusy} onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isBusy || editing}
                        onClick={() => setExpandedId(expanded ? null : item.id)}
                      >
                        <Eye className="h-4 w-4" />
                        {expanded ? 'Hide' : 'View'}
                      </Button>

                      {isManualOutreach ? (
                        <>
                          <Button variant="outline" size="sm" disabled={isBusy || editing} onClick={() => beginEdit(item)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            disabled={isBusy || editing}
                            onClick={() => invokeReviewAction(item, 'approve')}
                          >
                            {busyKey === `${item.id}:approve` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Approve & Send
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isBusy || editing}
                            onClick={() => invokeReviewAction(item, 'reject')}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            {busyKey === `${item.id}:reject` ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                            Reject
                          </Button>
                        </>
                      ) : (
                        <p className="self-center text-xs text-muted-foreground/60">
                          This is a reply draft or human-handoff item. Reply actions are handled separately from manual outreach approval.
                        </p>
                      )}
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
