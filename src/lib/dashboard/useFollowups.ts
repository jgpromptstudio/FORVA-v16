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

    let query = supabase
      .from('followups')
      .select('id,business_id,scheduled_for,status,stop_reason,sequence_no,mode,attempt_count,sent_at,draft_subject,draft_body,last_error')
      .eq('workspace_id', workspaceId)
      .order('scheduled_for', { ascending: false, nullsFirst: false })
      .limit(50);

    if (statusFilter !== 'all') query = query.eq('status', statusFilter);

    const { data: followups, error } = await query;
    if (error) {
      setState({ data: [], loading: false, error: 'Follow-ups could not be loaded. Please refresh and try again.' });
      return;
    }

    const followupList = (followups as Array<Omit<FollowupRow, 'business_name'>> | null) ?? [];
    const bizIds = followupList.map((f) => f.business_id).filter((id): id is string => id !== null);
    const bizMap = new Map<string, string>();

    if (bizIds.length > 0) {
      const { data: bizData } = await supabase.from('businesses').select('id,name').in('id', bizIds);
      if (bizData) for (const b of bizData) bizMap.set(b.id, b.name);
    }

    const rows: FollowupRow[] = followupList.map((f) => ({
      ...f,
      business_name: f.business_id ? (bizMap.get(f.business_id) ?? 'Unknown business') : 'Unknown business',
    }));

    setState({ data: rows, loading: false, error: null });
  }, [workspaceId, statusFilter]);

  useEffect(() => {
    fetchFollowups();
  }, [fetchFollowups]);

  return { ...state, refresh: fetchFollowups };
}
