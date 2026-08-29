import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type OutreachRow } from '@/lib/dashboard/workspace';

interface OutreachState {
  data: OutreachRow[];
  loading: boolean;
  error: string | null;
}

export function useOutreach(workspaceId: string | null) {
  const [state, setState] = useState<OutreachState>({ data: [], loading: true, error: null });

  const fetchOutreach = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const errors: string[] = [];

    const { data: outreach, error } = await supabase
      .from('outreach_messages')
      .select('id, business_id, contact_id, channel, subject, status, approval_state, sent_at, provider_message_id')
      .eq('workspace_id', workspaceId)
      .order('sent_at', { ascending: false, nullsFirst: false })
      .limit(50);

    if (error) errors.push(`outreach_messages: ${error.message}`);

    const outreachList = (outreach as Array<{ id: string; business_id: string | null; contact_id: string | null; channel: string | null; subject: string | null; status: string | null; approval_state: string | null; sent_at: string | null; provider_message_id: string | null }> | null) ?? [];

    const bizIds = outreachList.map((o) => o.business_id).filter((id): id is string => id !== null);
    const bizMap = new Map<string, { name: string; public_email: string | null }>();

    if (bizIds.length > 0) {
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('id, name, public_email')
        .in('id', bizIds);
      if (bizError) errors.push(`businesses: ${bizError.message}`);
      if (bizData) for (const b of bizData) bizMap.set(b.id, { name: b.name, public_email: b.public_email });
    }

    const contactIds = outreachList.map((o) => o.contact_id).filter((id): id is string => id !== null);
    const contactMap = new Map<string, { full_name: string | null; email: string | null }>();

    if (contactIds.length > 0) {
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .select('id, full_name, email')
        .in('id', contactIds);
      if (contactError) errors.push(`contacts: ${contactError.message}`);
      if (contactData) for (const c of contactData) contactMap.set(c.id, { full_name: c.full_name, email: c.email });
    }

    const rows: OutreachRow[] = outreachList.map((o) => {
      const biz = o.business_id ? bizMap.get(o.business_id) : null;
      const contact = o.contact_id ? contactMap.get(o.contact_id) : null;
      return {
        id: o.id,
        business_id: o.business_id,
        contact_id: o.contact_id,
        channel: o.channel,
        subject: o.subject,
        status: o.status,
        approval_state: o.approval_state,
        sent_at: o.sent_at,
        provider_message_id: o.provider_message_id,
        business_name: biz?.name ?? 'Unknown',
        contact_name: contact?.full_name ?? null,
        contact_email: contact?.email ?? null,
        business_public_email: biz?.public_email ?? null,
      };
    });

    setState({ data: rows, loading: false, error: errors.length > 0 ? errors.join('; ') : null });
  }, [workspaceId]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  return { ...state, refresh: fetchOutreach };
}
