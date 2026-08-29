import { useState, useEffect, useRef } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConversations, useConversationMessages } from '@/lib/dashboard/useConversations';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/dashboard/workspace';
import { MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';

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
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function ConversationsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { conversations, loading, error, refresh } = useConversations(workspaceId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { messages, loading: msgLoading, error: msgError } = useConversationMessages(workspaceId, selectedId);

  const selected = conversations.find((c) => c.id === selectedId);
  const hasSelectedRef = useRef(false);

  useEffect(() => {
    if (conversations.length > 0 && !selectedId && !hasSelectedRef.current) {
      hasSelectedRef.current = true;
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
      onRefresh={refresh}
      refreshing={loading}
    >
      {error && <ErrorBanner error={error} />}
      {loading ? (
        <LoadingState />
      ) : conversations.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState message="No conversations yet." />
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
                      <p className="text-sm font-medium text-foreground">{conv.business_name}</p>
                      <span className={cn('text-xs font-semibold', statusColors[conv.status ?? ''] ?? 'text-muted-foreground')}>
                        {capitalize(conv.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {conv.channel ?? 'Email'}
                      {conv.last_message_at && ` \u2022 ${formatTimeAgo(conv.last_message_at)}`}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={cn('lg:col-span-2', !selectedId && 'hidden lg:block')}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {selected ? selected.business_name : 'Select a conversation'}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedId ? (
                <EmptyState message="Select a conversation to view messages." />
              ) : msgLoading ? (
                <LoadingState />
              ) : msgError ? (
                <ErrorBanner error={msgError} />
              ) : messages.length === 0 ? (
                <EmptyState message="No messages in this conversation yet." />
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'rounded-lg p-4',
                        msg.direction === 'inbound' ? 'bg-white/5' : 'bg-primary/10 border border-primary/20'
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {msg.direction === 'inbound' ? (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          ) : (
                            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
                          )}
                          <span className="text-xs font-medium text-muted-foreground">
                            {msg.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                          </span>
                          {msg.status && (
                            <Badge variant="secondary" className="text-xs">{capitalize(msg.status)}</Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDateTime(msg.occurred_at)}</span>
                      </div>
                      {msg.subject && (
                        <p className="mb-1 text-sm font-medium text-foreground">{msg.subject}</p>
                      )}
                      {msg.body && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{msg.body}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {msg.intent && (
                          <Badge variant="outline" className="text-xs">Intent: {capitalize(msg.intent)}</Badge>
                        )}
                        {msg.provider && (
                          <span className="text-xs text-muted-foreground/60">via {msg.provider}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </WorkspaceGuard>
  );
}
