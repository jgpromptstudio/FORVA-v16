import { Link } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { GuidanceCard } from '@/components/dashboard/GuidanceCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { LifeBuoy, Shield, AlertCircle, KeyRound, Camera, Clock3 } from 'lucide-react';

export function SupportPage() {
  const { user } = useAuth();
  const { workspaceId, loading: wsLoading, error: wsError, refresh: refreshWorkspace } = useWorkspace();

  return (
    <WorkspaceGuard workspaceLoading={wsLoading} workspaceError={wsError} workspaceId={workspaceId} onRefresh={refreshWorkspace} refreshing={wsLoading}>
      <div className="space-y-6">
        <GuidanceCard title="Get help faster">
          <p>When something does not work, tell us which page you were on, what you clicked, roughly when it happened, and what you expected. A screenshot is helpful. Never send your password, API key, recovery code, or full payment details.</p>
        </GuidanceCard>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5 text-primary" />Support options</CardTitle>
            <p className="text-xs text-muted-foreground">Choose the option that matches what you need.</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3"><KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-medium text-foreground">Account access</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Use the password reset flow if you cannot sign in. If you are already signed in, Settings shows the authenticated account.</p><Button variant="outline" size="sm" asChild className="mt-3"><Link to="/forgot-password">Reset Password</Link></Button></div></div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-medium text-foreground">Credits and billing</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Check your active plan, remaining credits, top-ups, and PayPal subscription status from Credits & Billing.</p><Button variant="outline" size="sm" asChild className="mt-3"><Link to="/dashboard/billing">Credits & Billing</Link></Button></div></div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3"><Camera className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-medium text-foreground">Something is not working</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Include the page name, action, approximate time, and a screenshot. Do not repeatedly click Send or Launch while an action is still processing.</p><Button variant="outline" size="sm" asChild className="mt-3"><Link to="/contact">Contact FORVA</Link></Button></div></div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3"><Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-medium text-foreground">Security concern</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Report suspected account abuse or a security issue responsibly. Do not attempt to exploit or publicly disclose a vulnerability before reporting it.</p><Button variant="outline" size="sm" asChild className="mt-3"><Link to="/security">Security Information</Link></Button></div></div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div><p className="text-sm font-medium text-foreground">Responsible-use report</p><p className="mt-1 text-xs text-muted-foreground">If you believe a FORVA account is violating our outreach or acceptable-use rules, include enough detail for the report to be investigated.</p><Button variant="ghost" size="sm" asChild className="mt-2"><Link to="/acceptable-use">Read Acceptable Use Policy</Link></Button></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your account reference</CardTitle></CardHeader>
          <CardContent><p className="text-xs text-muted-foreground">Signed-in email</p><p className="mt-1 break-all text-sm text-foreground">{user?.email ?? 'Not available'}</p></CardContent>
        </Card>
      </div>
    </WorkspaceGuard>
  );
}
