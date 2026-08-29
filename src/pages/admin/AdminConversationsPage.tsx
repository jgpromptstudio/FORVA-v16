import { useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminConversation, AdminConversationMessagesResponse, AdminMessage } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/dashboard/workspace';
import { MessageSquare, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'text-emerald-400',
  awaiting_reply: 'text-amber-400',
  needs_review: 'text-red-400',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

export function AdminConversationsPage() {
  const { data: convData, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminConversation>>('conversations');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: msgResponse, loading: msgLoading, error: msgError, status: msgStatus } = useAdminApi<AdminConversationMessagesResponse>(
    selectedId ? 'conversation_messages' : null,
    { conversation_id: selectedId ?? undefined },
  );

  const conversations = convData?.data ?? [];
  const messages: AdminMessage[] = msgResponse?.data ?? [];
  const selected = conversations.find((c) => c.id === selectedId);

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      {conversations.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState message="No conversations found." />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className={cn('lg:col-span-1', selectedId && 'hidden lg:block')}>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      'w-full rounded-lg p-3 text-left transition-colors',
                      selectedId === conv.id ? 'bg-primary/15 border border-primary/30' : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{conv.business?.name ?? 'Unknown'}</p>
                      <span className={cn('text-xs font-semibold', statusColors[conv.status ?? ''] ?? 'text-muted-foreground')}>
                        {capitalize(conv.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {conv.channel ?? 'Email'} &middot; WS: {shortId(conv.workspace_id)}
                      {conv.last_message_at && ` &middot; ${formatTimeAgo(conv.last_message_at)}`}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={cn('lg:col-span-2', !selectedId && 'hidden lg:block')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedId(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {selected ? selected.business?.name ?? 'Unknown' : 'Select a conversation'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedId ? (
                <EmptyState message="Select a conversation to view messages." />
              ) : msgLoading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : msgError ? (
                <ErrorBanner error={msgError} />
              ) : messages.length === 0 ? (
                <EmptyState message="No messages in this conversation." />
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn('rounded-lg p-4', msg.direction === 'inbound' ? 'bg-white/5' : 'bg-primary/10 border border-primary/20')}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {msg.direction === 'inbound' ? <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /> : <ArrowLeft className="h-3.5 w-3.5 text-primary" />}
                          <span className="text-xs font-medium text-muted-foreground">{msg.direction === 'inbound' ? 'Inbound' : 'Outbound'}</span>
                          {msg.status && <Badge variant="secondary" className="text-xs">{capitalize(msg.status)}</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDateTime(msg.occurred_at)}</span>
                      </div>
                      {msg.subject && <p className="mb-1 text-sm font-medium text-foreground">{msg.subject}</p>}
                      {msg.body && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>}
                      <div className="mt-2 flex items-center gap-2">
                        {msg.intent && <Badge variant="outline" className="text-xs">Intent: {capitalize(msg.intent)}</Badge>}
                        {msg.provider && <span className="text-xs text-muted-foreground/60">via {msg.provider}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminStateGuard>
  );
}
