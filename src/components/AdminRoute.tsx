import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { checkIsAdmin } from '@/lib/admin';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminRoute({ children }: { children: ReactNode }) {
  const { loading, session, user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session || !user) {
      setChecking(false);
      return;
    }
    checkIsAdmin(user).then((result) => {
      setAllowed(result);
      setChecking(false);
    });
  }, [loading, session, user]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <ShieldAlert className="h-12 w-12 text-destructive" />
        <h1 className="mt-4 font-display text-xl font-semibold text-foreground">Access Denied</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You do not have admin access to this area. If you believe this is an error,
          contact a FORVA platform administrator.
        </p>
        <a href="/dashboard" className="mt-4 text-sm font-medium text-primary hover:text-primary/80">
          Return to dashboard
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
