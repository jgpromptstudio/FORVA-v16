import { AlertCircle, Loader2 } from 'lucide-react';

export function ErrorBanner({ error }: { error: string }) {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="text-sm font-medium text-destructive">Data failed to load</p>
        <p className="mt-1 text-xs text-destructive/80">{error}</p>
        <p className="mt-1 text-xs text-destructive/60">
          If this is an RLS or permission error, check that the authenticated role has SELECT policies
          on the affected table in your Supabase project.
        </p>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
