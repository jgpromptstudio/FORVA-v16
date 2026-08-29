import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWorkspace, useCreditAccount } from '@/lib/dashboard/useWorkspace';
import { useOverviewData } from '@/lib/dashboard/useOverviewData';
import { useAcquisitionRuns } from '@/lib/dashboard/useAcquisitionRuns';
import { cn } from '@/lib/utils';
import { formatAcquisitionError, formatTimeAgo } from '@/lib/dashboard/workspace';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  Brain,
  Send,
  MessageSquare,
  CalendarClock,
  UserCog,
  TrendingUp,
  AlertCircle,
  Bell,
  Info,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Loader2,
} from 'lucide-react';

const statConfig = [
  { key: 'businessesDiscovered' as const, label: 'Prospects', icon: Users },
  { key: 'verifiedBusinesses' as const, label: 'Verified', icon: Mail },
  { key: 'qualifiedBusinesses' as const, label: 'Qualified', icon: Brain },
  { key: 'outreachSent' as const, label: 'Outreach Sent', icon: Send },
  { key: 'repliesReceived' as const, label: 'Replies', icon: MessageSquare },
  { key: 'followUpsScheduled' as const, label: 'Follow-ups', icon: CalendarClock },
  { key: 'humanReviews' as const, label: 'Review Items', icon: UserCog },
];

const notificationIcons = { info: Info, warning: AlertCircle, success: CheckCircle2 };
const notificationColors = { info: 'text-blue-400', warning: 'text-amber-400', success: 'text-emerald-400' };

const verificationColors: Record<string, string> = {
  verified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  unverified: 'bg-red-500/20 text-red-400 border-red-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const runStatusColors: Record<string, string> = {
  queued: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  running: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-white/10 text-muted-foreground border-white/20',
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

function formatContact(email: string | null, phone: string | null): string {
  if (email) return email;
  if (phone) return phone;
  return 'No verified contact';
}

export function OverviewPage() {
  const navigate = useNavigate();
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data, loading, error, refresh } = useOverviewData(workspaceId);
  const { data: credit, loading: creditLoading, error: creditError, reason: creditReason } = useCreditAccount(workspaceId);
  const { data: runs, loading: runsLoading } = useAcquisitionRuns(workspaceId);

  const totalAvailable = credit
    ? (credit.monthly_remaining ?? 0) + (credit.topup_remaining ?? 0)
    : null;

  const latestRun = runs.length > 0 ? runs[0] : null;

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
      onRefresh={refresh}
      refreshing={loading}
    >
      {error && <ErrorBanner error={error} />}
      {loading && !data && <LoadingState />}

      {data && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {statConfig.map(({ key, label, icon: Icon }) => (
              <div key={key} className="clay rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-2xl font-bold text-white">{data.stats[key].toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Credit summary + Latest run */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Credit Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {creditLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : credit ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Plan</span>
                      <Badge variant="secondary" className="capitalize">{credit.plan ?? 'Unknown'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Remaining</span>
                      <span className="text-sm font-semibold text-foreground">{(credit.monthly_remaining ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Top-up Remaining</span>
                      <span className="text-sm font-semibold text-foreground">{(credit.topup_remaining ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-sm font-medium text-foreground">Total Available</span>
                      <span className="text-lg font-bold text-primary">{(totalAvailable ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                ) : creditReason === 'credit_account_not_provisioned' ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm font-medium text-foreground">No active plan yet</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">Activate a plan before launching client acquisition.</p>
                    <button onClick={() => navigate('/dashboard/billing')} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
                      View plans <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground">Credit status unavailable</p>
                    <p className="mt-1 text-xs text-muted-foreground/60">{creditError ? 'Refresh the page or try again shortly.' : 'Refresh the page or try again shortly.'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Latest Acquisition Run
                </CardTitle>
              </CardHeader>
              <CardContent>
                {runsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : latestRun ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className={cn(
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                        runStatusColors[latestRun.status] ?? 'bg-white/10 text-muted-foreground border-white/20'
                      )}>
                        {capitalize(latestRun.status)}
                      </span>
                    </div>
                    {latestRun.requested_prospect_count !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Requested Prospects</span>
                        <span className="text-sm font-semibold text-foreground">{latestRun.requested_prospect_count}</span>
                      </div>
                    )}
                    {latestRun.error_message && (
                      <div className="rounded-lg bg-red-500/10 p-3">
                        <p className="text-xs text-red-400">{formatAcquisitionError(latestRun.error_message)}</p>
                      </div>
                    )}
                    {latestRun.created_at && (
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(latestRun.created_at)}</p>
                    )}
                  </div>
                ) : (
                  <EmptyState message="No acquisition runs yet." />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.activity.length === 0 ? (
                  <EmptyState message="No recent activity yet." />
                ) : (
                  <div className="space-y-3">
                    {data.activity.map((item) => {
                      const NotifIcon = notificationIcons[item.type];
                      return (
                        <div key={item.id} className="flex items-start gap-3 rounded-lg bg-white/5 p-3">
                          <NotifIcon className={cn('mt-0.5 h-4 w-4 shrink-0', notificationColors[item.type])} />
                          <div>
                            <p className="text-sm text-foreground">{item.title}</p>
                            {item.time && <p className="text-xs text-muted-foreground">{item.time}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Client Acquisition Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.pipeline.every((s) => s.count === 0) ? (
                <EmptyState message="No pipeline data yet. Businesses will appear here as FORVA discovers them." />
              ) : (
                <div className="space-y-4">
                  {data.pipeline.map((stage) => (
                    <div key={stage.stage}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{stage.stage}</span>
                        <span className="text-muted-foreground">
                          {stage.count.toLocaleString()} ({stage.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700"
                          style={{ width: `${stage.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Prospects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent Prospects
                </CardTitle>
                <button
                  onClick={() => navigate('/dashboard/prospects')}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                >
                  View all prospects <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {data.recentBusinesses.length === 0 ? (
                <EmptyState message="No businesses discovered yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Business</th>
                        <th className="pb-3 pr-4 font-medium">Location</th>
                        <th className="pb-3 pr-4 font-medium">Contact</th>
                        <th className="pb-3 pr-4 font-medium">State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentBusinesses.map((biz) => (
                        <tr key={biz.id} className="border-b border-white/5">
                          <td className="py-3 pr-4 font-medium text-foreground">{biz.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{formatLocation(biz.city, biz.country_code)}</td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{formatContact(biz.public_email, biz.phone)}</td>
                          <td className="py-3 pr-4">
                            <span className={cn(
                              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                              verificationColors[biz.verification_status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20'
                            )}>
                              {capitalize(biz.state)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Replies + Review Alerts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Recent Replies
                  </CardTitle>
                  <button
                    onClick={() => navigate('/dashboard/conversations')}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    View conversations <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {data.recentReplies.length === 0 ? (
                  <EmptyState message="No replies received yet." />
                ) : (
                  <div className="space-y-3">
                    {data.recentReplies.map((reply) => (
                      <div key={reply.id} className="rounded-lg bg-white/5 p-3">
                        <p className="text-sm font-medium text-foreground">{reply.business_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {reply.subject ?? 'No subject'}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {reply.intent && (
                            <Badge variant="secondary" className="text-xs">{capitalize(reply.intent)}</Badge>
                          )}
                          {reply.occurred_at && (
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.occurred_at)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                    Review Alerts
                  </CardTitle>
                  <button
                    onClick={() => navigate('/dashboard/reviews')}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    View queue <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                {data.reviews.length === 0 ? (
                  <EmptyState message="No items require review." />
                ) : (
                  <div className="space-y-3">
                    {data.reviews.slice(0, 5).map((item) => (
                      <div key={item.id} className="rounded-lg bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{item.business_name}</p>
                          <Badge
                            variant={item.priority === 'High' ? 'gold' : 'secondary'}
                            className={cn(
                              item.priority === 'Medium' && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                              item.priority === 'Low' && 'bg-white/10 text-muted-foreground'
                            )}
                          >
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.type}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </WorkspaceGuard>
  );
}
