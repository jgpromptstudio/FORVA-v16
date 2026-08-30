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

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
const isTransient = (message?: string | null) => /failed to fetch|network|load failed/i.test(String(message ?? ''));

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

    let ensuredWorkspaceId: unknown = null;
    let ensureError: string | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const result = await supabase.rpc('ensure_my_forva_workspace');
      if (!result.error) {
        ensuredWorkspaceId = result.data;
        ensureError = null;
        break;
      }

      ensureError = result.error.message;
      if (!isTransient(ensureError) || attempt === 2) break;
      await wait(350 * (attempt + 1));
    }

    const wsId = typeof ensuredWorkspaceId === 'string' ? ensuredWorkspaceId : null;
    if (!wsId) {
      setState({
        workspaceId: null,
        workspaceName: null,
        loading: false,
        error: ensureError && isTransient(ensureError)
          ? 'Workspace connection is temporarily unavailable. Please try again.'
          : ensureError
            ? `Workspace setup failed: ${ensureError}`
            : 'Workspace setup did not return a workspace.',
      });
      return;
    }

    let workspace: { id: string; name: string | null } | null = null;
    let workspaceError: string | null = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await supabase
        .from('workspaces')
        .select('id, name')
        .eq('id', wsId)
        .maybeSingle();

      if (!result.error) {
        workspace = result.data;
        workspaceError = null;
        break;
      }

      workspaceError = result.error.message;
      if (!isTransient(workspaceError) || attempt === 1) break;
      await wait(350 * (attempt + 1));
    }

    if (workspaceError) {
      setState({
        workspaceId: null,
        workspaceName: null,
        loading: false,
        error: isTransient(workspaceError)
          ? 'Workspace connection is temporarily unavailable. Please try again.'
          : `Workspace load failed: ${workspaceError}`,
      });
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

    let responseData: unknown = null;
    let responseError: string | null = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await supabase.rpc('get_forva_credit_account', {
        p_workspace_id: workspaceId,
      });

      if (!result.error) {
        responseData = result.data;
        responseError = null;
        break;
      }

      responseError = result.error.message;
      if (!isTransient(responseError) || attempt === 1) break;
      await wait(350 * (attempt + 1));
    }

    if (responseError) {
      setState({
        data: null,
        loading: false,
        error: isTransient(responseError)
          ? 'Credit status is temporarily unavailable. Please try again.'
          : `Credit status failed: ${responseError}`,
        reason: null,
      });
      return;
    }

    const payload = responseData && typeof responseData === 'object'
      ? (responseData as Record<string, unknown>)
      : null;

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
