import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOutreach } from '@/lib/dashboard/useOutreach';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  sent: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  pending: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const approvalColors: Record<string, string> = {
  approved: 'bg-emerald-500/15 text-emerald-400',
  pending: 'bg-amber-500/15 text-amber-400',
  rejected: 'bg-red-500/15 text-red-400',
};

function capitalize(str: string | null): string {
  if (!str) return 'N/A';
  return str.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function getRecipient(msg: {
  contact_name: string | null;
  contact_email: string | null;
  business_public_email: string | null;
}): string {
  if (msg.contact_email) return msg.contact_email;
  if (msg.business_public_email) return msg.business_public_email;
  return 'No recipient address';
}

export function OutreachPage() {
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const { data, loading, error, refresh } = useOutreach(workspaceId);

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
            <EmptyState message="No outreach messages sent yet." />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Outreach Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Business</th>
                    <th className="pb-3 pr-4 font-medium">Recipient</th>
                    <th className="pb-3 pr-4 font-medium">Channel</th>
                    <th className="pb-3 pr-4 font-medium">Subject</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Approval</th>
                    <th className="pb-3 pr-4 font-medium">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((msg) => (
                    <tr key={msg.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-medium text-foreground">{msg.business_name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        <div>
                          <p className="text-sm text-foreground">{getRecipient(msg)}</p>
                          {msg.contact_name && (
                            <p className="text-xs text-muted-foreground/70">{msg.contact_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{capitalize(msg.channel)}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{msg.subject ?? 'N/A'}</td>
                      <td className="py-3 pr-4">
                        <span className={cn(
                          'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                          statusColors[msg.status ?? ''] ?? 'bg-white/10 text-muted-foreground border-white/20'
                        )}>
                          {capitalize(msg.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {msg.approval_state && (
                          <span className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            approvalColors[msg.approval_state] ?? 'bg-white/10 text-muted-foreground'
                          )}>
                            {capitalize(msg.approval_state)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{formatDateTime(msg.sent_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </WorkspaceGuard>
  );
}
