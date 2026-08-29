import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AcquisitionRun } from '@/lib/dashboard/workspace';

interface AcquisitionRunsState {
  data: AcquisitionRun[];
  loading: boolean;
  error: string | null;
}

const TERMINAL_STATUSES = new Set(['completed', 'failed', 'cancelled']);

export function useAcquisitionRuns(workspaceId: string | null) {
  const [state, setState] = useState<AcquisitionRunsState>({
    data: [],
    loading: true,
    error: null,
  });
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRuns = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: [], loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    const { data, error } = await supabase
      .from('acquisition_runs')
      .select('id, status, error_message, created_at, updated_at, started_at, completed_at, requested_prospect_count, target_profile_id')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      setState({ data: [], loading: false, error: `acquisition_runs: ${error.message}` });
      return;
    }

    const runs = (data as AcquisitionRun[]) ?? [];
    setState({ data: runs, loading: false, error: null });
  }, [workspaceId]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  useEffect(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }

    if (!workspaceId || state.data.length === 0) return;

    const latestRun = state.data[0];
    if (!TERMINAL_STATUSES.has(latestRun.status)) {
      pollRef.current = setTimeout(() => {
        fetchRuns();
      }, 4000);
    }

    return () => {
      if (pollRef.current) {
        clearTimeout(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [workspaceId, state.data, fetchRuns]);

  return { ...state, refresh: fetchRuns };
}
