import { type ReactNode } from 'react';
import { Loader2, AlertCircle, ShieldAlert, LogIn } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ErrorBanner, LoadingState, EmptyState } from '@/components/dashboard/States';

interface AdminStateGuardProps {
  loading: boolean;
  status: 'success' | 'denied' | 'unauthenticated' | 'error' | 'idle';
  error: string | null;
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function AdminStateGuard({ loading, status, error, children, onRefresh, refreshing }: AdminStateGuardProps) {
  if (status === 'denied') {
    return (
      <AdminLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="max-w-md text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Admin access denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {error ?? 'The admin data service denied your request. Your account may not have platform admin privileges.'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <AdminLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="max-w-md text-center">
            <LogIn className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Authentication required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session may have expired. Please sign in again to access admin data.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout onRefresh={onRefresh} refreshing={refreshing}>
        <LoadingState />
      </AdminLayout>
    );
  }

  if (status === 'error' && error) {
    return (
      <AdminLayout onRefresh={onRefresh} refreshing={refreshing}>
        <ErrorBanner error={error} />
      </AdminLayout>
    );
  }

  return <AdminLayout onRefresh={onRefresh} refreshing={refreshing}>{children}</AdminLayout>;
}
