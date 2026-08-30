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

    const { data: outreach, error } = await supabase
      .from('outreach_messages')
      .select('id,business_id,contact_id,channel,subject,body,status,approval_state,sent_at,provider_message_id,last_error,send_attempt_count')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      setState({ data: [], loading: false, error: 'Outreach history could not be loaded. Please refresh and try again.' });
      return;
    }

    const outreachList = (outreach as Array<Omit<OutreachRow, 'business_name' | 'contact_name' | 'contact_email' | 'business_public_email'>> | null) ?? [];
    const bizIds = outreachList.map((o) => o.business_id).filter((id): id is string => id !== null);
    const bizMap = new Map<string, { name: string; public_email: string | null }>();

    if (bizIds.length > 0) {
      const { data: bizData } = await supabase.from('businesses').select('id,name,public_email').in('id', bizIds);
      if (bizData) for (const b of bizData) bizMap.set(b.id, { name: b.name, public_email: b.public_email });
    }

    const contactIds = outreachList.map((o) => o.contact_id).filter((id): id is string => id !== null);
    const contactMap = new Map<string, { full_name: string | null; email: string | null }>();

    if (contactIds.length > 0) {
      const { data: contactData } = await supabase.from('contacts').select('id,full_name,email').in('id', contactIds);
      if (contactData) for (const c of contactData) contactMap.set(c.id, { full_name: c.full_name, email: c.email });
    }

    const rows: OutreachRow[] = outreachList.map((o) => {
      const biz = o.business_id ? bizMap.get(o.business_id) : null;
      const contact = o.contact_id ? contactMap.get(o.contact_id) : null;
      return {
        ...o,
        business_name: biz?.name ?? 'Unknown business',
        contact_name: contact?.full_name ?? null,
        contact_email: contact?.email ?? null,
        business_public_email: biz?.public_email ?? null,
      };
    });

    setState({ data: rows, loading: false, error: null });
  }, [workspaceId]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  return { ...state, refresh: fetchOutreach };
}
