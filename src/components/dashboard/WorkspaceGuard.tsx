import { type ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

interface WorkspaceGuardProps {
  workspaceLoading: boolean;
  workspaceError: string | null;
  workspaceId: string | null;
  children: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function WorkspaceGuard({
  workspaceLoading,
  workspaceError,
  workspaceId,
  children,
  onRefresh,
  refreshing,
}: WorkspaceGuardProps) {
  if (workspaceLoading) {
    return (
      <DashboardLayout onRefresh={onRefresh} refreshing={refreshing}>
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (workspaceError || !workspaceId) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-amber-400" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">No workspace found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {workspaceError ?? 'Your account is not associated with a workspace. Please contact support to resolve this issue.'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout onRefresh={onRefresh} refreshing={refreshing}>{children}</DashboardLayout>;
}
