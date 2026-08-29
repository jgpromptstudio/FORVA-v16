import { useState } from 'react';
import { AdminStateGuard } from '@/components/admin/AdminStateGuard';
import { ErrorBanner, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminApi } from '@/lib/admin/useAdminApi';
import type { AdminPagedResponse, AdminProspect } from '@/lib/admin/adminTypes';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const verificationColors: Record<string, string> = {
  verified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  unverified: 'bg-red-500/20 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const stateColors: Record<string, string> = {
  found: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  verified: 'bg-primary/20 text-primary border-primary/30',
  qualified: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  contacted: 'bg-primary/20 text-primary border-primary/30',
};

const PAGE_SIZE = 25;

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLocation(city: string | null, countryCode: string | null): string {
  if (city && countryCode) return `${city}, ${countryCode}`;
  if (city) return city;
  if (countryCode) return countryCode;
  return 'N/A';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function shortId(id: string | null): string {
  if (!id) return 'N/A';
  return id.slice(0, 8);
}

export function AdminProspectsPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [page, setPage] = useState(0);
  const { data, loading, error, status, refresh } = useAdminApi<AdminPagedResponse<AdminProspect>>('prospects', {
    search,
    state_filter: stateFilter,
    verification_filter: verificationFilter,
    page,
    page_size: PAGE_SIZE,
  });

  const prospects = data?.data ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <AdminStateGuard loading={loading} status={status} error={error} onRefresh={refresh} refreshing={loading}>
      {error && <ErrorBanner error={error} />}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, domain, or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
        <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(0); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All states</option>
          <option value="found">Found</option>
          <option value="verified">Verified</option>
          <option value="qualified">Qualified</option>
          <option value="contacted">Contacted</option>
        </select>
        <select value={verificationFilter} onChange={(e) => { setVerificationFilter(e.target.value); setPage(0); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All verifications</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Prospects ({count.toLocaleString()} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {prospects.length === 0 ? (
            <EmptyState message="No businesses found matching your filters." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Business</th>
                      <th className="pb-3 pr-4 font-medium">Workspace</th>
                      <th className="pb-3 pr-4 font-medium">Domain</th>
                      <th className="pb-3 pr-4 font-medium">Location</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Phone</th>
                      <th className="pb-3 pr-4 font-medium">Verification</th>
                      <th className="pb-3 pr-4 font-medium">State</th>
                      <th className="pb-3 pr-4 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prospects.map((biz) => (
                      <tr key={biz.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium text-foreground">{biz.name}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{shortId(biz.workspace_id)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{biz.domain || biz.website_url || 'N/A'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{formatLocation(biz.city, biz.country_code)}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{biz.public_email ?? 'N/A'}</td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{biz.phone ?? 'N/A'}</td>
                        <td className="py-3 pr-4">
                          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', verificationColors[biz.verification_status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                            {capitalize(biz.verification_status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', stateColors[biz.state ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>
                            {capitalize(biz.state)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(biz.created_at)}</td>
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
