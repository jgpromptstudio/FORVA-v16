import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type ReviewRow, mapReviewType, mapPriority } from '@/lib/dashboard/workspace';

interface ReviewsState {
  data: ReviewRow[];
  loading: boolean;
  error: string | null;
}

export function useReviews(workspaceId: string | null) {
  const [state, setState] = useState<ReviewsState>({ data: [], loading: true, error: null });

  const fetchReviews = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const errors: string[] = [];

    const { data: drafts, error: draftError } = await supabase
      .from('messages')
      .select('id, direction, status, subject, body, intent, provider, conversation_id, occurred_at')
      .eq('workspace_id', workspaceId)
      .eq('direction', 'outbound')
      .eq('status', 'draft')
      .in('provider', ['forva_human_handoff', 'openai_draft'])
      .order('occurred_at', { ascending: false })
      .limit(50);

    if (draftError) errors.push(`messages (draft): ${draftError.message}`);

    const { data: manualOutreach, error: manualOutreachError } = await supabase
      .from('outreach_messages')
      .select('id, business_id, subject, body, approval_state, status, created_at')
      .eq('workspace_id', workspaceId)
      .eq('status', 'draft')
      .eq('approval_state', 'pending')
      .order('created_at', { ascending: false })
      .limit(50);

    if (manualOutreachError) errors.push(`outreach_messages (manual review): ${manualOutreachError.message}`);

    const draftList = (drafts as Array<{ id: string; intent: string | null; provider: string | null; conversation_id: string | null; occurred_at: string | null; body: string | null; subject: string | null }> | null) ?? [];
    const manualList = (manualOutreach as Array<{ id: string; business_id: string | null; subject: string | null; body: string | null; created_at: string | null }> | null) ?? [];

    const businessMap = new Map<string, string>();
    const manualBizIds = manualList.map((d) => d.business_id).filter((id): id is string => id !== null);
    if (manualBizIds.length > 0) {
      const { data: manualBusinesses, error: bizError } = await supabase
        .from('businesses')
        .select('id, name')
        .in('id', manualBizIds);
      if (bizError) errors.push(`businesses (manual review): ${bizError.message}`);
      if (manualBusinesses) for (const b of manualBusinesses) businessMap.set(b.id, b.name);
    }

    const convIds = draftList.map((d) => d.conversation_id).filter((id): id is string => id !== null);
    const convBizMap = new Map<string, string>();

    if (convIds.length > 0) {
      const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('id, business_id')
        .in('id', convIds);
      if (convError) errors.push(`conversations: ${convError.message}`);
      if (convs) {
        const bizIds = convs.map((c: { business_id: string | null }) => c.business_id).filter((id): id is string => id !== null);
        const missing = bizIds.filter((id) => !businessMap.has(id));
        if (missing.length > 0) {
          const { data: bizData, error: bizError } = await supabase
            .from('businesses')
            .select('id, name')
            .in('id', missing);
          if (bizError) errors.push(`businesses: ${bizError.message}`);
          if (bizData) for (const b of bizData) businessMap.set(b.id, b.name);
        }
        for (const c of convs) {
          if (c.business_id) convBizMap.set(c.id, businessMap.get(c.business_id) ?? 'Unknown');
        }
      }
    }

    const conversationRows: ReviewRow[] = draftList.map((d) => ({
      id: d.id,
      business_name: d.conversation_id ? (convBizMap.get(d.conversation_id) ?? 'Unknown') : 'Unknown',
      type: mapReviewType(d.provider, d.intent),
      intent: d.intent,
      priority: mapPriority(d.intent),
      subject: d.subject,
      body: d.body,
      occurred_at: d.occurred_at,
      source: 'conversation_draft',
    }));

    const manualRows: ReviewRow[] = manualList.map((d) => ({
      id: d.id,
      business_name: d.business_id ? (businessMap.get(d.business_id) ?? 'Unknown') : 'Unknown',
      type: 'Manual Outreach Review',
      intent: null,
      priority: 'Medium',
      subject: d.subject,
      body: d.body,
      occurred_at: d.created_at,
      source: 'manual_outreach',
    }));

    const rows = [...conversationRows, ...manualRows].sort((a, b) => {
      const aTime = a.occurred_at ? new Date(a.occurred_at).getTime() : 0;
      const bTime = b.occurred_at ? new Date(b.occurred_at).getTime() : 0;
      return bTime - aTime;
    });

    setState({ data: rows, loading: false, error: errors.length > 0 ? errors.join('; ') : null });
  }, [workspaceId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { ...state, refresh: fetchReviews };
}
