import { Fragment, useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminUsersResponse, AdminUser } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Search, ChevronDown, ChevronUp } from 'lucide-react';

const PAGE_SIZE = 25;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

function renderMemberships(user: AdminUser): string {
  if (!user.memberships || user.memberships.length === 0) return 'None';
  return user.memberships.map((m) => m.workspace?.name ?? shortId(m.workspace_id)).join(', ');
}

function renderRoles(user: AdminUser): string {
  if (!user.memberships || user.memberships.length === 0) return 'N/A';
  return user.memberships.map((m) => m.role ?? 'member').join(', ');
}

export function AdminUsersPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data, loading, error, status, refresh } = useAdminApi<AdminUsersResponse>('users', { page, page_size: PAGE_SIZE, search });

  const users = data?.data ?? [];
  const hasMore = data?.has_more ?? false;

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}
      <div className="mb-4 flex max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search users..."
          className="w-full bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <EmptyState message="No users found." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">User ID</th>
                      <th className="pb-3 pr-4 font-medium">Created</th>
                      <th className="pb-3 pr-4 font-medium">Last Sign In</th>
                      <th className="pb-3 pr-4 font-medium">Email Confirmed</th>
                      <th className="pb-3 pr-4 font-medium">Workspace(s)</th>
                      <th className="pb-3 pr-4 font-medium">Role(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const confirmed = !!u.email_confirmed_at;
                      return (
                        <Fragment key={u.id}>
                          <tr className="cursor-pointer border-b border-white/5 hover:bg-white/[0.03]" onClick={() => setSelectedUserId((id) => id === u.id ? null : u.id)}>
                            <td className="py-3 pr-4 font-medium text-foreground"><span className="inline-flex items-center gap-2">{selectedUserId === u.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}{u.email ?? 'N/A'}</span></td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(u.id)}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(u.created_at)}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(u.last_sign_in_at)}</td>
                            <td className="py-3 pr-4"><Badge variant={confirmed ? 'default' : 'secondary'} className={cn(!confirmed && 'bg-amber-500/20 text-amber-400 border-amber-500/30')}>{confirmed ? 'Yes' : 'No'}</Badge></td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{renderMemberships(u)}</td>
                            <td className="py-3 pr-4 text-xs text-muted-foreground">{renderRoles(u)}</td>
                          </tr>
                          {selectedUserId === u.id && (
                            <tr key={`${u.id}-detail`} className="border-b border-white/5 bg-white/[0.02]">
                              <td colSpan={7} className="p-4">
                                <div className="grid gap-4 text-xs md:grid-cols-3">
                                  <div><p className="text-muted-foreground">Full User ID</p><p className="mt-1 break-all font-mono text-foreground">{u.id}</p></div>
                                  <div><p className="text-muted-foreground">Memberships</p><p className="mt-1 text-foreground">{renderMemberships(u)}</p></div>
                                  <div><p className="text-muted-foreground">Roles</p><p className="mt-1 text-foreground">{renderRoles(u)}</p></div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Page {page + 1}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminStateGuard>
  );
}
