import { useCallback, useEffect, useState } from 'react';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/dashboard/workspace';
import { Bell, CheckCheck, Circle } from 'lucide-react';

type NotificationRow = {
  id: string;
  notification_type: string;
  title: string;
  body: string | null;
  severity: string;
  entity_type: string | null;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
};

const severityClass: Record<string, string> = {
  info: 'border-blue-500/20 bg-blue-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
  high: 'border-red-500/20 bg-red-500/5',
  critical: 'border-red-500/30 bg-red-500/10',
  success: 'border-emerald-500/20 bg-emerald-500/5',
};

export function NotificationsPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!workspaceId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: loadError } = await supabase
      .from('notifications')
      .select('id,notification_type,title,body,severity,entity_type,entity_id,read_at,created_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (loadError) {
      console.error('FORVA notifications load failed', loadError);
      setError('Notifications could not be loaded. Please refresh and try again.');
      setItems([]);
    } else {
      setItems((data as NotificationRow[] | null) ?? []);
    }
    setLoading(false);
  }, [workspaceId]);

  useEffect(() => { void load(); }, [load]);

  async function markRead(id: string) {
    setBusy(true);
    const { error: markError } = await supabase.rpc('forva_mark_notification_read', { p_notification_id: id });
    if (markError) {
      console.error('FORVA notification update failed', markError);
      setError('That notification could not be updated. Please try again.');
    } else {
      setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
    }
    setBusy(false);
  }

  async function markAllRead() {
    if (!workspaceId) return;
    setBusy(true);
    const { error: markError } = await supabase.rpc('forva_mark_all_notifications_read', { p_workspace_id: workspaceId });
    if (markError) {
      console.error('FORVA notifications update failed', markError);
      setError('Notifications could not be updated. Please try again.');
    } else {
      const now = new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? now })));
    }
    setBusy(false);
  }

  const unread = items.filter((item) => !item.read_at).length;

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={load} refreshing={loading}>
      <div className="mb-5">
        <GuidanceCard title="What notifications mean">
          <p>FORVA surfaces real events that may need your attention, such as completed or failed runs, prospect replies, review items, and outreach problems. Notifications do not create actions by themselves.</p>
        </GuidanceCard>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-sm font-medium text-foreground">{unread} unread</p><p className="text-xs text-muted-foreground">Latest 100 notifications</p></div>
        {unread > 0 && <Button variant="outline" size="sm" disabled={busy} onClick={() => void markAllRead()}><CheckCheck className="h-4 w-4" />Mark all read</Button>}
      </div>

      {error && <ErrorBanner error={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? (
        <Card><CardContent><EmptyState message="No notifications yet. Important FORVA activity will appear here." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={cn('border', severityClass[item.severity] ?? 'border-white/10', !item.read_at && 'ring-1 ring-primary/20')}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-white/5 p-2">{item.read_at ? <Bell className="h-4 w-4 text-muted-foreground" /> : <Circle className="h-4 w-4 fill-primary text-primary" />}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"><p className="text-sm font-semibold text-foreground">{item.title}</p><span className="shrink-0 text-xs text-muted-foreground">{formatTimeAgo(item.created_at)}</span></div>
                    {item.body && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>}
                    {!item.read_at && <Button variant="ghost" size="sm" className="mt-2" disabled={busy} onClick={() => void markRead(item.id)}><CheckCheck className="h-4 w-4" />Mark read</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </WorkspaceGuard>
  );
}
