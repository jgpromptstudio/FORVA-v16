import { Link } from 'react-router-dom';
import { WorkspaceGuard } from '@/components/dashboard/WorkspaceGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useWorkspace } from '@/lib/dashboard/useWorkspace';
import { LifeBuoy, Mail, Shield, AlertCircle } from 'lucide-react';

export function SupportPage() {
  const { user } = useAuth();
  const { workspaceId, loading: wsLoading, error: wsError } = useWorkspace();

  return (
    <WorkspaceGuard
      workspaceLoading={wsLoading}
      workspaceError={wsError}
      workspaceId={workspaceId}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              How can we help?
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Use the options below to get help with your FORVA account.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Account and billing support</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    For account access issues, use the forgot-password flow on the login page. Billing management will be available through your account once payment integration is connected.
                  </p>
                  <Link to="/forgot-password">
                    <Button variant="outline" size="sm" className="mt-3">
                      Reset Password
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Security concerns</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If you have identified a security vulnerability, please report it responsibly. Do not attempt to exploit or publicly disclose potential vulnerabilities before contacting FORVA.
                  </p>
                  <Link to="/security">
                    <Button variant="outline" size="sm" className="mt-3">
                      Read Security Page
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Responsible-use reports</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If you believe a FORVA account is being used in violation of our policies, please report it with relevant details.
                  </p>
                  <Link to="/acceptable-use">
                    <Button variant="outline" size="sm" className="mt-3">
                      Read Acceptable Use Policy
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Authenticated email</label>
              <p className="mt-1 text-sm text-foreground">{user?.email ?? 'Not available'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceGuard>
  );
}
