import { useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useBusinesses } from '@/lib/dashboard/useBusinesses';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { BusinessRow } from '@/lib/dashboard/workspace';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Mail, Phone, Eye, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

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

type ScoreDetail = {
  business_verification: number | null;
  service_match: number | null;
  contact_quality: number | null;
  evidence_strength: number | null;
  commercial_fit: number | null;
  outreach_eligibility: number | null;
  total_score: number | null;
  hard_blocker: boolean | null;
  blocker_reasons: string[] | null;
  fit_reasons: unknown;
  recommended_offer: string | null;
  created_at: string | null;
};

type EvidenceDetail = {
  id: string;
  evidence_type: string | null;
  evidence_value: unknown;
  supports_existence: boolean | null;
  supports_relevance: boolean | null;
  mismatch_detected: boolean | null;
  observed_at: string | null;
  verified_at: string | null;
};

type ContactDetail = {
  id: string;
  full_name: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  is_decision_maker: boolean | null;
  contact_quality_score: number | null;
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

function renderWebsite(domain: string | null, websiteUrl: string | null) {
  const url = websiteUrl || domain;
  if (!url) return <span className="text-muted-foreground/50">N/A</span>;
  const href = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[220px] items-center gap-1 truncate text-primary hover:underline">
      <span className="truncate">{domain || websiteUrl}</span><ExternalLink className="h-3 w-3 shrink-0" />
    </a>
  );
}

function readableReasons(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => typeof item === 'string' ? item : JSON.stringify(item));
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${capitalize(key)}: ${typeof item === 'string' ? item : JSON.stringify(item)}`);
  }
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
}

function evidenceSummary(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 5);
    return entries.map(([key, item]) => `${capitalize(key)}: ${typeof item === 'string' ? item : JSON.stringify(item)}`).join(' • ');
  }
  return 'Evidence recorded';
}

function ScorePill({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value ?? 'N/A'}</p>
    </div>
  );
}

export function ProspectsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<BusinessRow | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreDetail | null>(null);
  const [evidence, setEvidence] = useState<EvidenceDetail[]>([]);
  const [contacts, setContacts] = useState<ContactDetail[]>([]);
  const { data, loading, error, count, refresh } = useBusinesses(workspaceId, search, stateFilter, verificationFilter, page, PAGE_SIZE);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  async function openDetails(business: BusinessRow) {
    if (!workspaceId) return;
    setSelected(business);
    setDetailLoading(true);
    setDetailError(null);
    setScore(null);
    setEvidence([]);
    setContacts([]);

    const [scoreResult, evidenceResult, contactsResult] = await Promise.all([
      supabase
        .from('qualification_scores')
        .select('business_verification,service_match,contact_quality,evidence_strength,commercial_fit,outreach_eligibility,total_score,hard_blocker,blocker_reasons,fit_reasons,recommended_offer,created_at')
        .eq('workspace_id', workspaceId)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('verification_evidence')
        .select('id,evidence_type,evidence_value,supports_existence,supports_relevance,mismatch_detected,observed_at,verified_at')
        .eq('workspace_id', workspaceId)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('contacts')
        .select('id,full_name,title,email,phone,source,is_decision_maker,contact_quality_score')
        .eq('workspace_id', workspaceId)
        .eq('business_id', business.id)
        .order('contact_quality_score', { ascending: false, nullsFirst: false })
        .limit(10),
    ]);

    const messages: string[] = [];
    if (scoreResult.error) messages.push('Qualification details could not be loaded.');
    if (evidenceResult.error) messages.push('Evidence details could not be loaded.');
    if (contactsResult.error) messages.push('Contact details could not be loaded.');

    setScore((scoreResult.data as ScoreDetail | null) ?? null);
    setEvidence((evidenceResult.data as EvidenceDetail[] | null) ?? []);
    setContacts((contactsResult.data as ContactDetail[] | null) ?? []);
    setDetailError(messages.length ? messages.join(' ') : null);
    setDetailLoading(false);
  }

  const fitReasons = readableReasons(score?.fit_reasons);

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={refresh} refreshing={loading}>
      <div className="mb-5">
        <GuidanceCard title="How to read your Prospects">
          <p>These are real businesses FORVA discovered for your target. Open a prospect to see why it was selected, the qualification score, supporting evidence, available contacts, and the recommended offer. A discovered business is not automatically approved for outreach.</p>
        </GuidanceCard>
      </div>

      {error && <ErrorBanner error={error} />}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" autoComplete="off" placeholder="Search name, domain, or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
        </div>
        <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(0); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All stages</option><option value="found">Found</option><option value="verified">Verified</option><option value="qualified">Qualified</option><option value="contacted">Contacted</option>
        </select>
        <select value={verificationFilter} onChange={(e) => { setVerificationFilter(e.target.value); setPage(0); }} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none">
          <option value="all">All verifications</option><option value="verified">Verified</option><option value="unverified">Unverified</option><option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <Card><CardContent><EmptyState message="No prospects match these filters yet." /></CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Discovered Businesses</CardTitle></CardHeader>
          <CardContent>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-3 pr-4 font-medium">Business</th><th className="pb-3 pr-4 font-medium">Location</th><th className="pb-3 pr-4 font-medium">Contact</th><th className="pb-3 pr-4 font-medium">Verification</th><th className="pb-3 pr-4 font-medium">Stage</th><th className="pb-3 font-medium">Details</th></tr></thead>
                <tbody>
                  {data.map((biz) => (
                    <tr key={biz.id} className="border-b border-white/5">
                      <td className="py-3 pr-4"><p className="font-medium text-foreground">{biz.name}</p><div className="mt-1 text-xs">{renderWebsite(biz.domain, biz.website_url)}</div></td>
                      <td className="py-3 pr-4 text-muted-foreground">{formatLocation(biz.city, biz.country_code)}</td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{biz.public_email || biz.phone || 'No verified contact yet'}</td>
                      <td className="py-3 pr-4"><span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', verificationColors[biz.verification_status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(biz.verification_status)}</span></td>
                      <td className="py-3 pr-4"><span className={cn('inline-flex rounded-full border px-2 py-0.5 text-xs font-medium', stateColors[biz.state ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(biz.state)}</span></td>
                      <td className="py-3"><Button variant="outline" size="sm" onClick={() => void openDetails(biz)}><Eye className="h-4 w-4" />View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {data.map((biz) => (
                <div key={biz.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-medium text-foreground">{biz.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatLocation(biz.city, biz.country_code)}</p></div><span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium', stateColors[biz.state ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(biz.state)}</span></div>
                  <p className="mt-3 truncate text-xs text-muted-foreground">{biz.public_email || biz.phone || 'No verified contact yet'}</p>
                  <div className="mt-3 flex items-center justify-between gap-2"><span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium', verificationColors[biz.verification_status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20')}>{capitalize(biz.verification_status)}</span><Button variant="outline" size="sm" onClick={() => void openDetails(biz)}><Eye className="h-4 w-4" />Details</Button></div>
                </div>
              ))}
            </div>

            {totalPages > 1 && <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">Page {page + 1} of {totalPages} ({count} total)</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft className="h-4 w-4" />Prev</Button><Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next<ChevronRight className="h-4 w-4" /></Button></div></div>}
          </CardContent>
        </Card>
      )}

      <Sheet open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent side="right" className="w-[96vw] max-w-2xl overflow-y-auto border-white/10 bg-secondary/95 p-5 sm:max-w-2xl sm:p-6">
          <SheetHeader className="pr-8"><SheetTitle>{selected?.name ?? 'Prospect Details'}</SheetTitle><SheetDescription>Why FORVA selected this business and what it found.</SheetDescription></SheetHeader>
          {detailLoading ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : selected && (
            <div className="mt-6 space-y-6">
              {detailError && <ErrorBanner error={detailError} />}

              <section className="rounded-xl border border-white/10 bg-white/5 p-4"><h3 className="text-sm font-semibold text-foreground">Business</h3><div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2"><p><span className="text-foreground">Location:</span> {selected.address_text || formatLocation(selected.city, selected.country_code)}</p><p><span className="text-foreground">Operating:</span> {capitalize(selected.operational_status)}</p><p><span className="text-foreground">Email:</span> {selected.public_email || 'Not found'}</p><p><span className="text-foreground">Phone:</span> {selected.phone || 'Not found'}</p><div className="sm:col-span-2">{renderWebsite(selected.domain, selected.website_url)}</div></div></section>

              <section><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">Qualification</h3>{score?.total_score != null && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Score {score.total_score}</span>}</div>
                {score ? <><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3"><ScorePill label="Business verification" value={score.business_verification} /><ScorePill label="Service match" value={score.service_match} /><ScorePill label="Contact quality" value={score.contact_quality} /><ScorePill label="Evidence strength" value={score.evidence_strength} /><ScorePill label="Commercial fit" value={score.commercial_fit} /><ScorePill label="Outreach eligibility" value={score.outreach_eligibility} /></div>
                  {score.hard_blocker && <div className="mt-3 flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300"><AlertTriangle className="h-4 w-4 shrink-0" /><span>Outreach is blocked: {(score.blocker_reasons ?? []).join(', ') || 'A safety or eligibility blocker was detected.'}</span></div>}
                  {fitReasons.length > 0 && <div className="mt-4"><p className="text-xs font-semibold text-foreground">Why selected</p><ul className="mt-2 space-y-1.5">{fitReasons.map((reason, index) => <li key={`${reason}-${index}`} className="flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /><span>{reason}</span></li>)}</ul></div>}
                  {score.recommended_offer && <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3"><p className="text-xs font-semibold text-foreground">Recommended offer</p><p className="mt-1 text-sm text-muted-foreground">{score.recommended_offer}</p></div>}
                </> : <p className="mt-2 text-xs text-muted-foreground">No qualification score has been persisted for this business yet.</p>}
              </section>

              <section><h3 className="text-sm font-semibold text-foreground">Contacts</h3>{contacts.length === 0 ? <p className="mt-2 text-xs text-muted-foreground">No contact records found.</p> : <div className="mt-3 space-y-2">{contacts.map((contact) => <div key={contact.id} className="rounded-lg border border-white/10 bg-white/5 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium text-foreground">{contact.full_name || 'Business contact'}</p>{contact.is_decision_maker && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">Decision maker</span>}</div>{contact.title && <p className="mt-1 text-xs text-muted-foreground">{contact.title}</p>}<div className="mt-2 flex flex-wrap gap-3 text-xs">{contact.email && <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1 text-primary"><Mail className="h-3.5 w-3.5" />{contact.email}</a>}{contact.phone && <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1 text-primary"><Phone className="h-3.5 w-3.5" />{contact.phone}</a>}</div></div>)}</div>}</section>

              <section><h3 className="text-sm font-semibold text-foreground">Evidence</h3>{evidence.length === 0 ? <p className="mt-2 text-xs text-muted-foreground">No evidence records found.</p> : <div className="mt-3 space-y-2">{evidence.map((item) => <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-3"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-medium text-foreground">{capitalize(item.evidence_type)}</span>{item.supports_existence && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">Supports existence</span>}{item.supports_relevance && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">Supports fit</span>}{item.mismatch_detected && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">Mismatch</span>}</div><p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{evidenceSummary(item.evidence_value)}</p></div>)}</div>}</section>

              <p className="text-[11px] text-muted-foreground/60">Prospect updated {formatDate(selected.updated_at)}. Data shown here is limited to your current workspace by Supabase access policies.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </WorkspaceGuard>
  );
}
