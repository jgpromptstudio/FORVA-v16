import { useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminOutreach } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const statusColors: Record<string, string> = {
  sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const PAGE_SIZE = 25;

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

function contactEmail(msg: AdminOutreach): string {
  return msg.contact?.email ?? msg.business?.public_email ?? 'N/A';
}

export function AdminOutreachPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminOutreach>>('outreach', {
    status_filter: statusFilter,
    page,
    page_size: PAGE_SIZE,
  });

  const messages = data?.data ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}

      <div className="mb-4">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All statuses</option>
          <option value="sent">Sent</option>
          <option value="draft">Draft</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outreach Messages ({count.toLocaleString()} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <EmptyState message="No outreach messages found." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Business</th>
                      <th className="pb-3 pr-4 font-medium">Contact</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Workspace</th>
                      <th className="pb-3 pr-4 font-medium">Channel</th>
                      <th className="pb-3 pr-4 font-medium">Subject</th>
                      <th className="pb-3 pr-4 font-medium">Approval</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium">Sent At</th>
                      <th className="pb-3 pr-4 font-medium">Provider Msg ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium text-foreground">{msg.business?.name ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{msg.contact?.full_name ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{contactEmail(msg)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(msg.workspace_id)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{capitalize(msg.channel)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{msg.subject ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{capitalize(msg.approval_state)}</td>
                        <td className="py-3 pr-4">
                          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', statusColors[msg.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                            {capitalize(msg.status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(msg.sent_at)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{msg.provider_message_id ?? 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </AdminStateGuard>
  );
}
