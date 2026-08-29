import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminReview } from '@/lib/admin/adminTypes';
import { formatTimeAgo } from '@/lib/dashboard/workspace';

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

export function AdminReviewsPage() {
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminReview>>('reviews');

  const reviews = data?.data ?? [];
  const count = data?.count ?? 0;

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      <Card>
        <CardHeader>
          <CardTitle>Review Queue ({count.toLocaleString()} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <EmptyState message="No review items found. Drafts and handoffs will appear here when persisted by the backend." />
          ) : (
            <div className="space-y-4">
              {reviews.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-muted-foreground">WS: {shortId(item.workspace_id)}</span>
                            {item.direction && <Badge variant="secondary" className="text-xs">{capitalize(item.direction)}</Badge>}
                          </div>
                          <div className="mt-1 flex items-center gap-2 flex-wrap">
                            {item.intent && <Badge variant="outline" className="text-xs">{capitalize(item.intent)}</Badge>}
                            {item.provider && <Badge variant="secondary" className="text-xs">{item.provider}</Badge>}
                            {item.occurred_at && <span className="text-xs text-muted-foreground">{formatTimeAgo(item.occurred_at)}</span>}
                          </div>
                        </div>
                      </div>
                      {item.subject && (
                        <p className="text-sm font-medium text-foreground">{item.subject}</p>
                      )}
                      {item.body && (
                        <div className="rounded-lg bg-white/5 p-3">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">{item.body}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminStateGuard>
  );
}
