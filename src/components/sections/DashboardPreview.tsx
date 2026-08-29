import { Reveal } from '@/components/Reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  CheckCircle2,
  Info,
  Activity,
  Bell,
} from 'lucide-react';
import {
  dashboardStats,
  pipelineData,
  recentProspects,
  conversations,
  reviewQueue,
  notifications,
  systemActivity,
} from '@/config/dashboardConfig';
import { cn } from '@/lib/utils';

const statIcons = [Users, Mail, Brain, Send, MessageSquare, CalendarClock, UserCog, Activity];

const verificationColors: Record<string, string> = {
  Verified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Unverified: 'bg-red-500/20 text-red-400 border-red-500/30',
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const outreachStateColors: Record<string, string> = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Contacted: 'bg-primary/20 text-primary border-primary/30',
  Replied: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Follow-Up': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Review: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const conversationStatusColors: Record<string, string> = {
  Active: 'text-emerald-400',
  'Awaiting Reply': 'text-amber-400',
  'Needs Review': 'text-red-400',
};

const notificationIcons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
};

const notificationColors = {
  info: 'text-blue-400',
  warning: 'text-amber-400',
  success: 'text-emerald-400',
};

const reviewStateColors: Record<string, string> = {
  'Pending Review': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Needs Action': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Resolved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export function DashboardPreview() {
  return (
    <section id="platform" className="relative z-10 section-padding">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Reveal>
            <span className="eyebrow">Your Control Center</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              See what FORVA is doing, and what needs you.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-status-blink" />
              <span className="text-xs font-medium text-muted-foreground">Product demonstration</span>
            </div>
          </Reveal>
        </div>

        {/* Stats grid */}
        <Reveal delay={300}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {dashboardStats.map((stat, i) => {
              const Icon = statIcons[i];
              return (
                <div key={stat.label} className="clay rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    {stat.change && (
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          stat.trend === 'up' && 'text-emerald-400',
                          stat.trend === 'neutral' && 'text-muted-foreground'
                        )}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Main dashboard grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Pipeline chart */}
          <Reveal delay={400} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Client Acquisition Pipeline
                  </CardTitle>
                  <Badge variant="secondary">Last 30 days</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pipelineData.map((stage) => (
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
              </CardContent>
            </Card>
          </Reveal>

          {/* Notification panel */}
          <Reveal delay={500}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notif, i) => {
                    const NotifIcon = notificationIcons[notif.type];
                    return (
                      <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 p-3">
                        <NotifIcon className={cn('h-4 w-4 shrink-0 mt-0.5', notificationColors[notif.type])} />
                        <div>
                          <p className="text-sm text-foreground">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Recent prospects table */}
          <Reveal delay={400} className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Discovered Businesses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Business</th>
                        <th className="pb-3 pr-4 font-medium">Domain / Website</th>
                        <th className="pb-3 pr-4 font-medium">Location</th>
                        <th className="pb-3 pr-4 font-medium">Verification</th>
                        <th className="pb-3 pr-4 font-medium text-right">Qualification Score</th>
                        <th className="pb-3 pr-4 font-medium">Contact</th>
                        <th className="pb-3 pr-4 font-medium">Outreach State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProspects.map((prospect) => (
                        <tr key={prospect.business} className="border-b border-white/5">
                          <td className="py-3 pr-4 font-medium text-foreground">{prospect.business}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{prospect.domain}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{prospect.location}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                                verificationColors[prospect.verification]
                              )}
                            >
                              {prospect.verification}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-white/10">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${prospect.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-foreground">{prospect.score}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-xs text-muted-foreground">{prospect.contact}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                                outreachStateColors[prospect.outreachState]
                              )}
                            >
                              {prospect.outreachState}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Conversation status */}
          <Reveal delay={500}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Conversation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.map((conv, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{conv.business}</p>
                        <p className="text-xs text-muted-foreground">{conv.channel} &bull; {conv.lastUpdate}</p>
                      </div>
                      <span className={cn('text-xs font-semibold', conversationStatusColors[conv.status])}>
                        {conv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Human review queue */}
          <Reveal delay={500}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  Human Review Queue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviewQueue.map((item, i) => (
                    <div key={i} className="rounded-lg bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{item.business}</p>
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
                      <span
                        className={cn(
                          'mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                          reviewStateColors[item.state]
                        )}
                      >
                        {item.state}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* System Activity card */}
          <Reveal delay={500}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Processed this run</span>
                    <span className="text-lg font-bold text-foreground">{systemActivity.processedThisRun}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Businesses persisted</span>
                    <span className="text-lg font-bold text-foreground">{systemActivity.businessesPersisted}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Follow-ups scheduled</span>
                    <span className="text-lg font-bold text-foreground">{systemActivity.followUpsScheduled}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Needs review</span>
                    <span className="text-lg font-bold text-amber-400">{systemActivity.needsReview}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
