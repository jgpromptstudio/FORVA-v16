import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { CreditAccount } from '@/lib/dashboard/workspace';

interface WorkspaceState {
  workspaceId: string | null;
  workspaceName: string | null;
  loading: boolean;
  error: string | null;
}

export function useWorkspace() {
  const { user } = useAuth();
  const [state, setState] = useState<WorkspaceState>({
    workspaceId: null,
    workspaceName: null,
    loading: true,
    error: null,
  });

  const fetchWorkspace = useCallback(async () => {
    if (!user?.id) {
      setState({ workspaceId: null, workspaceName: null, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    // New-user self-heal/provisioning RPC installed by the backend closing patch.
    const { data: ensuredWorkspaceId, error: ensureError } = await supabase.rpc('ensure_my_forva_workspace');

    if (ensureError) {
      setState({ workspaceId: null, workspaceName: null, loading: false, error: `Workspace setup failed: ${ensureError.message}` });
      return;
    }

    const wsId = typeof ensuredWorkspaceId === 'string' ? ensuredWorkspaceId : null;
    if (!wsId) {
      setState({ workspaceId: null, workspaceName: null, loading: false, error: 'Workspace setup did not return a workspace.' });
      return;
    }

    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('id', wsId)
      .maybeSingle();

    if (workspaceError) {
      setState({ workspaceId: null, workspaceName: null, loading: false, error: `Workspace load failed: ${workspaceError.message}` });
      return;
    }

    setState({
      workspaceId: wsId,
      workspaceName: workspace?.name ?? null,
      loading: false,
      error: null,
    });
  }, [user?.id]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  return { ...state, refresh: fetchWorkspace };
}

interface CreditState {
  data: CreditAccount | null;
  loading: boolean;
  error: string | null;
  reason: string | null;
}

export function useCreditAccount(workspaceId: string | null) {
  const [state, setState] = useState<CreditState>({
    data: null,
    loading: true,
    error: null,
    reason: null,
  });

  const fetchCredits = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: null, loading: false, error: null, reason: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null, reason: null }));

    const { data, error } = await supabase.rpc('get_forva_credit_account', {
      p_workspace_id: workspaceId,
    });

    if (error) {
      setState({ data: null, loading: false, error: `Credit status failed: ${error.message}`, reason: null });
      return;
    }

    const payload = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    if (!payload || payload.ok !== true) {
      setState({
        data: null,
        loading: false,
        error: null,
        reason: typeof payload?.reason === 'string' ? payload.reason : 'credit_account_not_provisioned',
      });
      return;
    }

    setState({
      data: {
        plan: typeof payload.plan === 'string' ? payload.plan : null,
        monthly_allowance: typeof payload.monthly_allowance === 'number' ? payload.monthly_allowance : null,
        monthly_remaining: typeof payload.monthly_remaining === 'number' ? payload.monthly_remaining : null,
        topup_remaining: typeof payload.topup_remaining === 'number' ? payload.topup_remaining : null,
        cycle_start: typeof payload.cycle_start === 'string' ? payload.cycle_start : null,
        cycle_end: typeof payload.cycle_end === 'string' ? payload.cycle_end : null,
        status: typeof payload.status === 'string' ? payload.status : null,
        updated_at: typeof payload.updated_at === 'string' ? payload.updated_at : null,
      },
      loading: false,
      error: null,
      reason: null,
    });
  }, [workspaceId]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return { ...state, refresh: fetchCredits };
}
