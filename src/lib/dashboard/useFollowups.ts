import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type FollowupRow } from '@/lib/dashboard/workspace';

interface FollowupsState {
  data: FollowupRow[];
  loading: boolean;
  error: string | null;
}

export function useFollowups(workspaceId: string | null, statusFilter: string) {
  const [state, setState] = useState<FollowupsState>({ data: [], loading: true, error: null });

  const fetchFollowups = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const errors: string[] = [];

    let query = supabase
      .from('followups')
      .select('id, business_id, scheduled_for, status, stop_reason')
      .eq('workspace_id', workspaceId)
      .order('scheduled_for', { ascending: false, nullsFirst: false })
      .limit(50);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    const { data: followups, error } = await query;
    if (error) errors.push(`followups: ${error.message}`);

    const followupList = (followups as Array<{ id: string; business_id: string | null; scheduled_for: string | null; status: string | null; stop_reason: string | null }> | null) ?? [];
    const bizIds = followupList.map((f) => f.business_id).filter((id): id is string => id !== null);
    const bizMap = new Map<string, string>();

    if (bizIds.length > 0) {
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('id, name')
        .in('id', bizIds);
      if (bizError) errors.push(`businesses: ${bizError.message}`);
      if (bizData) for (const b of bizData) bizMap.set(b.id, b.name);
    }

    const rows: FollowupRow[] = followupList.map((f) => ({
      id: f.id,
      business_id: f.business_id,
      scheduled_for: f.scheduled_for,
      status: f.status,
      stop_reason: f.stop_reason,
      business_name: f.business_id ? (bizMap.get(f.business_id) ?? 'Unknown') : 'Unknown',
    }));

    setState({ data: rows, loading: false, error: errors.length > 0 ? errors.join('; ') : null });
  }, [workspaceId, statusFilter]);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  return { ...state, refresh: fetchFollowups };
}
