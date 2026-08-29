import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type ConversationRow, type MessageRow } from '@/lib/dashboard/workspace';

interface ConversationsState {
  conversations: ConversationRow[];
  loading: boolean;
  error: string | null;
}

export function useConversations(workspaceId: string | null) {
  const [state, setState] = useState<ConversationsState>({ conversations: [], loading: true, error: null });

  const fetchConversations = useCallback(async () => {
    if (!workspaceId) {
      setState({ conversations: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const errors: string[] = [];

    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id, business_id, channel, status, last_message_at')
      .eq('workspace_id', workspaceId)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .limit(50);

    if (convError) errors.push(`conversations: ${convError.message}`);

    const convList = (conversations as ConversationRow[] | null) ?? [];
    const bizIds = convList.map((c) => c.business_id).filter((id): id is string => id !== null);
    const bizMap = new Map<string, string>();

    if (bizIds.length > 0) {
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .select('id, name')
        .in('id', bizIds);
      if (bizError) errors.push(`businesses: ${bizError.message}`);
      if (bizData) for (const b of bizData) bizMap.set(b.id, b.name);
    }

    const convsWithNames: ConversationRow[] = convList.map((c) => ({
      ...c,
      business_name: c.business_id ? (bizMap.get(c.business_id) ?? 'Unknown') : 'Unknown',
    }));

    setState({ conversations: convsWithNames, loading: false, error: errors.length > 0 ? errors.join('; ') : null });
  }, [workspaceId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { ...state, refresh: fetchConversations };
}

interface MessagesState {
  messages: MessageRow[];
  loading: boolean;
  error: string | null;
}

export function useConversationMessages(workspaceId: string | null, conversationId: string | null) {
  const [state, setState] = useState<MessagesState>({ messages: [], loading: false, error: null });

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !workspaceId) {
      setState({ messages: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, direction, status, subject, body, intent, provider, occurred_at')
      .eq('workspace_id', workspaceId)
      .eq('conversation_id', conversationId)
      .order('occurred_at', { ascending: true });

    if (error) {
      setState({ messages: [], loading: false, error: `messages: ${error.message}` });
      return;
    }

    setState({ messages: (data as MessageRow[]) ?? [], loading: false, error: null });
  }, [workspaceId, conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { ...state, refresh: fetchMessages };
}
