import { useNavigate } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { LogOut, ShieldCheck } from 'lucide-react';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Authenticated email</label>
                <p className="mt-1 text-sm text-foreground">{user?.email ?? 'Not available'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Session status</label>
                <div className="mt-1 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-foreground">Authenticated</span>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceGuard>
  );
}
