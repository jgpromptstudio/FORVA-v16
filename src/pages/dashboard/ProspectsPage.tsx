import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBusinesses } from '@/lib/dashboard/useBusinesses';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Mail, Phone } from 'lucide-react';

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

const PAGE_SIZE = 20;

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

function renderWebsite(domain: string | null, websiteUrl: string | null) {
  const url = websiteUrl || domain;
  if (!url) return <span className="text-muted-foreground/50">N/A</span>;
  const href = url.startsWith('http') ? url : `https://${url}`;
  const display = domain || websiteUrl;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline"
    >
      {display}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function renderEmail(email: string | null) {
  if (!email) return <span className="text-muted-foreground/50">N/A</span>;
  return (
    <a href={`mailto:${email}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline">
      <Mail className="h-3 w-3" />
      {email}
    </a>
  );
}

function renderPhone(phone: string | null) {
  if (!phone) return <span className="text-muted-foreground/50">N/A</span>;
  return (
    <a href={`tel:${phone}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline">
      <Phone className="h-3 w-3" />
      {phone}
    </a>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ProspectsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [page, setPage] = useState(0);
  const { data, loading, error, count, refresh } = useBusinesses(workspaceId, search, stateFilter, verificationFilter, page, PAGE_SIZE);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
      onRefresh={refresh}
      refreshing={loading}
    >
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
        <select
          value={stateFilter}
          onChange={(e) => { setStateFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
        >
          <option value="all">All states</option>
          <option value="found">Found</option>
          <option value="verified">Verified</option>
          <option value="qualified">Qualified</option>
          <option value="contacted">Contacted</option>
        </select>
        <select
          value={verificationFilter}
          onChange={(e) => { setVerificationFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
        >
          <option value="all">All verifications</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discovered Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState />
          ) : data.length === 0 ? (
            <EmptyState message="No businesses found matching your filters." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Business</th>
                      <th className="pb-3 pr-4 font-medium">Website / Domain</th>
                      <th className="pb-3 pr-4 font-medium">Location</th>
                      <th className="pb-3 pr-4 font-medium">Email</th>
                      <th className="pb-3 pr-4 font-medium">Phone</th>
                      <th className="pb-3 pr-4 font-medium">Verification</th>
                      <th className="pb-3 pr-4 font-medium">State</th>
                      <th className="pb-3 pr-4 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((biz) => (
                      <tr key={biz.id} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-medium text-foreground">{biz.name}</td>
                        <td className="py-3 pr-4 text-sm">{renderWebsite(biz.domain, biz.website_url)}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{formatLocation(biz.city, biz.country_code)}</td>
                        <td className="py-3 pr-4 text-sm">{renderEmail(biz.public_email)}</td>
                        <td className="py-3 pr-4 text-sm">{renderPhone(biz.phone)}</td>
                        <td className="py-3 pr-4">
                          <span className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                            verificationColors[biz.verification_status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20'
                          )}>
                            {capitalize(biz.verification_status)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={cn(
                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                            stateColors[biz.state ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20'
                          )}>
                            {capitalize(biz.state)}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDate(biz.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Page {page + 1} of {totalPages} ({count} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </WorkspaceGuard>
  );
}
