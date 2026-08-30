import { type ReactNode } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';

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
            <h2 className="mt-4 text-lg font-semibold text-foreground">Workspace unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {workspaceError ?? 'Your workspace could not be loaded. Please try again.'}
            </p>
            {onRefresh && (
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRefresh} disabled={refreshing}>
                {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout onRefresh={onRefresh} refreshing={refreshing}>{children}</DashboardLayout>;
}
