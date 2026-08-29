import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  type BusinessRow,
  type ConversationRow,
  type MessageRow,
  type ActivityItem,
  type DashboardStats,
  type PipelineStage,
  type ReviewRow,
  safePct,
  formatTimeAgo,
  mapReviewType,
  mapPriority,
} from '@/lib/dashboard/workspace';

interface OverviewData {
  stats: DashboardStats;
  pipeline: PipelineStage[];
  recentBusinesses: BusinessRow[];
  recentReplies: Array<{ id: string; business_name: string; subject: string | null; intent: string | null; occurred_at: string | null }>;
  reviews: ReviewRow[];
  activity: ActivityItem[];
  conversations: ConversationRow[];
}

interface OverviewState {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
}

export function useOverviewData(workspaceId: string | null) {
  const [state, setState] = useState<OverviewState>({ data: null, loading: true, error: null });

  const fetchOverview = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const errors: string[] = [];

    const { count: bizCount, error: bizCountError } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId);
    if (bizCountError) errors.push(`businesses (count): ${bizCountError.message}`);

    const { count: verifiedCount, error: verifiedCountError } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('verification_status', 'verified');
    if (verifiedCountError) errors.push(`businesses (verified count): ${verifiedCountError.message}`);

    const { count: qualifiedCount, error: qualifiedCountError } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('state', ['qualified', 'contacted']);
    if (qualifiedCountError) errors.push(`businesses (qualified count): ${qualifiedCountError.message}`);

    const { count: outreachCount, error: outreachCountError } = await supabase
      .from('outreach_messages')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'sent');
    if (outreachCountError) errors.push(`outreach_messages (count): ${outreachCountError.message}`);

    const { count: repliesCount, error: repliesCountError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('direction', 'inbound');
    if (repliesCountError) errors.push(`messages (inbound count): ${repliesCountError.message}`);

    const { count: followupCount, error: followupCountError } = await supabase
      .from('followups')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .in('status', ['scheduled', 'queued']);
    if (followupCountError) errors.push(`followups (count): ${followupCountError.message}`);

    const { count: conversationReviewCount, error: reviewCountError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('direction', 'outbound')
      .eq('status', 'draft')
      .in('provider', ['forva_human_handoff', 'openai_draft']);
    if (reviewCountError) errors.push(`messages (draft count): ${reviewCountError.message}`);

    const { count: manualReviewCount, error: manualReviewCountError } = await supabase
      .from('outreach_messages')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('status', 'draft')
      .eq('approval_state', 'pending');
    if (manualReviewCountError) errors.push(`outreach_messages (pending review count): ${manualReviewCountError.message}`);

    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .select('id, name, domain, website_url, city, country_code, verification_status, public_email, phone, state, updated_at')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false })
      .limit(20);
    if (bizError) errors.push(`businesses: ${bizError.message}`);

    const { data: inboundMessages, error: inboundError } = await supabase
      .from('messages')
      .select('id, direction, status, subject, intent, provider, conversation_id, occurred_at')
      .eq('workspace_id', workspaceId)
      .eq('direction', 'inbound')
      .order('occurred_at', { ascending: false })
      .limit(10);
    if (inboundError) errors.push(`messages: ${inboundError.message}`);

    const { data: draftMessages, error: draftError } = await supabase
      .from('messages')
      .select('id, direction, status, subject, body, intent, provider, conversation_id, occurred_at')
      .eq('workspace_id', workspaceId)
      .eq('direction', 'outbound')
      .eq('status', 'draft')
      .in('provider', ['forva_human_handoff', 'openai_draft'])
      .order('occurred_at', { ascending: false })
      .limit(20);
    if (draftError) errors.push(`messages (draft): ${draftError.message}`);

    const { data: followups, error: followupError } = await supabase
      .from('followups')
      .select('id, business_id, status, scheduled_for, created_at')
      .eq('workspace_id', workspaceId)
      .in('status', ['scheduled', 'queued'])
      .order('scheduled_for', { ascending: false })
      .limit(10);
    if (followupError) errors.push(`followups: ${followupError.message}`);

    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, business_id, channel, status, last_message_at')
      .eq('workspace_id', workspaceId)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .limit(20);
    if (convError) errors.push(`conversations: ${convError.message}`);

    const { data: recentOutreach, error: recentOutreachError } = await supabase
      .from('outreach_messages')
      .select('id, business_id, sent_at')
      .eq('workspace_id', workspaceId)
      .eq('status', 'sent')
      .order('sent_at', { ascending: false, nullsFirst: false })
      .limit(3);
    if (recentOutreachError) errors.push(`outreach_messages (recent): ${recentOutreachError.message}`);

    const bizList = (businesses as BusinessRow[] | null) ?? [];
    const businessMap = new Map<string, string>();
    for (const b of bizList) businessMap.set(b.id, b.name);

    const convList = (conversations as ConversationRow[] | null) ?? [];
    const missingBizIds = convList
      .map((c) => c.business_id)
      .filter((id): id is string => id !== null && !businessMap.has(id));

    if (missingBizIds.length > 0) {
      const { data: extraBiz } = await supabase
        .from('businesses')
        .select('id, name')
        .in('id', missingBizIds);
      if (extraBiz) for (const b of extraBiz) businessMap.set(b.id, b.name);
    }

    const draftList = (draftMessages as Array<{ id: string; intent: string | null; provider: string | null; conversation_id: string | null; occurred_at: string | null; body: string | null; subject: string | null }> | null) ?? [];
    const draftConvIds = draftList.map((d) => d.conversation_id).filter((id): id is string => id !== null);
    const draftConvBizMap = new Map<string, string>();

    if (draftConvIds.length > 0) {
      const { data: draftConvs } = await supabase
        .from('conversations')
        .select('id, business_id')
        .in('id', draftConvIds);
      if (draftConvs) {
        const draftBizIds = draftConvs.map((c: { business_id: string | null }) => c.business_id).filter((id): id is string => id !== null);
        const stillMissing = draftBizIds.filter((id) => !businessMap.has(id));
        if (stillMissing.length > 0) {
          const { data: extraDraftBiz } = await supabase
            .from('businesses')
            .select('id, name')
            .in('id', stillMissing);
          if (extraDraftBiz) for (const b of extraDraftBiz) businessMap.set(b.id, b.name);
        }
        for (const c of draftConvs) {
          if (c.business_id) draftConvBizMap.set(c.id, businessMap.get(c.business_id) ?? 'Unknown');
        }
      }
    }

    const inboundList = (inboundMessages as Array<{ id: string; occurred_at: string | null; intent: string | null; subject: string | null; conversation_id: string | null }> | null) ?? [];

    const inboundConvIds = inboundList.map((m) => m.conversation_id).filter((id): id is string => id !== null);
    const inboundConvBizMap = new Map<string, string>();
    if (inboundConvIds.length > 0) {
      const { data: inboundConvs } = await supabase
        .from('conversations')
        .select('id, business_id')
        .in('id', inboundConvIds);
      if (inboundConvs) {
        const inboundBizIds = inboundConvs.map((c: { business_id: string | null }) => c.business_id).filter((id): id is string => id !== null);
        const stillMissingInbound = inboundBizIds.filter((id) => !businessMap.has(id));
        if (stillMissingInbound.length > 0) {
          const { data: extraInboundBiz } = await supabase
            .from('businesses')
            .select('id, name')
            .in('id', stillMissingInbound);
          if (extraInboundBiz) for (const b of extraInboundBiz) businessMap.set(b.id, b.name);
        }
        for (const c of inboundConvs) {
          if (c.business_id) inboundConvBizMap.set(c.id, businessMap.get(c.business_id) ?? 'Unknown');
        }
      }
    }

    const allBusinessCount = bizCount ?? 0;
    const verifiedCountResult = verifiedCount ?? 0;
    const qualifiedCountResult = qualifiedCount ?? 0;
    const outreachCountResult = outreachCount ?? 0;
    const repliesCountResult = repliesCount ?? 0;
    const followupCountResult = followupCount ?? 0;
    const reviewCountResult = (conversationReviewCount ?? 0) + (manualReviewCount ?? 0);

    const stats: DashboardStats = {
      businessesDiscovered: allBusinessCount,
      verifiedBusinesses: verifiedCountResult,
      qualifiedBusinesses: qualifiedCountResult,
      outreachSent: outreachCountResult,
      repliesReceived: repliesCountResult,
      followUpsScheduled: followupCountResult,
      humanReviews: reviewCountResult,
    };

    const { count: contactedCount } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', workspaceId)
      .eq('state', 'contacted');

    const contactedCountResult = contactedCount ?? 0;

    const totalForPct = allBusinessCount || 1;
    const pipeline: PipelineStage[] = [
      { stage: 'Discovered', count: allBusinessCount, percentage: safePct(allBusinessCount, totalForPct) },
      { stage: 'Verified', count: verifiedCountResult, percentage: safePct(verifiedCountResult, totalForPct) },
      { stage: 'Qualified', count: qualifiedCountResult, percentage: safePct(qualifiedCountResult, totalForPct) },
      { stage: 'Contacted', count: contactedCountResult, percentage: safePct(contactedCountResult, totalForPct) },
      { stage: 'Replies', count: repliesCountResult, percentage: safePct(repliesCountResult, totalForPct) },
    ];

    const recentReplies = inboundList.slice(0, 5).map((m) => ({
      id: m.id,
      business_name: m.conversation_id ? (inboundConvBizMap.get(m.conversation_id) ?? 'Unknown') : 'Unknown',
      subject: m.subject,
      intent: m.intent,
      occurred_at: m.occurred_at,
    }));

    const reviews: ReviewRow[] = draftList.map((d) => ({
      id: d.id,
      business_name: d.conversation_id ? (draftConvBizMap.get(d.conversation_id) ?? 'Unknown') : 'Unknown',
      type: mapReviewType(d.provider, d.intent),
      intent: d.intent,
      priority: mapPriority(d.intent),
      body: d.body,
      occurred_at: d.occurred_at,
    }));

    const activity: ActivityItem[] = [];
    for (const m of inboundList.slice(0, 5)) {
      const bizName = m.conversation_id ? (inboundConvBizMap.get(m.conversation_id) ?? 'Unknown') : 'Unknown';
      activity.push({ id: `inbound-${m.id}`, title: `${bizName} replied`, time: m.occurred_at ? formatTimeAgo(m.occurred_at) : '', occurred_at: m.occurred_at, type: 'info' });
    }
    const outreachList = (recentOutreach as Array<{ id: string; business_id: string | null; sent_at: string | null }> | null) ?? [];
    for (const o of outreachList.slice(0, 3)) {
      const bizName = o.business_id ? (businessMap.get(o.business_id) ?? 'Unknown') : 'Unknown';
      activity.push({ id: `outreach-${o.id}`, title: `Outreach sent to ${bizName}`, time: o.sent_at ? formatTimeAgo(o.sent_at) : '', occurred_at: o.sent_at, type: 'success' });
    }
    const followupList = (followups as Array<{ id: string; business_id: string | null; scheduled_for: string | null; created_at: string | null }> | null) ?? [];
    for (const f of followupList.slice(0, 3)) {
      const bizName = f.business_id ? (businessMap.get(f.business_id) ?? 'Unknown') : 'Unknown';
      const activityTime = f.created_at ?? null;
      activity.push({ id: `followup-${f.id}`, title: `Follow-up scheduled for ${bizName}`, time: activityTime ? formatTimeAgo(activityTime) : '', occurred_at: activityTime, type: 'info' });
    }
    for (const d of draftList.slice(0, 3)) {
      const bizName = d.conversation_id ? (draftConvBizMap.get(d.conversation_id) ?? 'Unknown') : 'Unknown';
      activity.push({ id: `review-${d.id}`, title: `${bizName} needs review`, time: d.occurred_at ? formatTimeAgo(d.occurred_at) : '', occurred_at: d.occurred_at, type: 'warning' });
    }
    activity.sort((a, b) => {
      const aTime = a.occurred_at ? new Date(a.occurred_at).getTime() : 0;
      const bTime = b.occurred_at ? new Date(b.occurred_at).getTime() : 0;
      return bTime - aTime;
    });

    const conversationsWithNames: ConversationRow[] = convList.map((c) => ({
      ...c,
      business_name: c.business_id ? (businessMap.get(c.business_id) ?? 'Unknown') : 'Unknown',
    }));

    setState({
      data: {
        stats,
        pipeline,
        recentBusinesses: bizList.slice(0, 5),
        recentReplies,
        reviews,
        activity: activity.slice(0, 8),
        conversations: conversationsWithNames,
      },
      loading: false,
      error: errors.length > 0 ? errors.join('; ') : null,
    });
  }, [workspaceId]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { ...state, refresh: fetchOverview };
}
