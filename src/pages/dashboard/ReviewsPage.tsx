import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReviews } from '@/lib/dashboard/useReviews';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/dashboard/workspace';

const priorityColors: Record<string, string> = {
  High: 'bg-gold/20 text-gold border border-gold/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Low: 'bg-white/10 text-muted-foreground',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function ReviewsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data, loading, error, refresh } = useReviews(workspaceId);

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
      ) : data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState message="No items require review. Review outreach that needs your approval or manual action before it can continue." />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <Card key={item.id}>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
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
                    <Badge className={cn(priorityColors[item.priority] ?? priorityColors['Medium'])}>
                      {item.priority}
                    </Badge>
                  </div>
                  {(item.subject || item.body) && (
                    <div className="rounded-lg bg-white/5 p-3">
                      {item.subject && <p className="mb-2 text-sm font-medium text-foreground">{item.subject}</p>}
                      {item.body && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.body}</p>}
                    </div>
                  )}
                  {item.source === 'manual_outreach' && (
                    <p className="text-xs text-muted-foreground/60">
                      This outreach draft is persisted for review. Approve/edit/send actions require the manual-approval backend action before they can be enabled safely.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </WorkspaceGuard>
  );
}
