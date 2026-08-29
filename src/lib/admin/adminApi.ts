import { supabase } from '@/lib/supabase';

export type AdminAction =
  | 'overview'
  | 'users'
  | 'workspaces'
  | 'prospects'
  | 'outreach'
  | 'conversations'
  | 'conversation_messages'
  | 'followups'
  | 'reviews'
  | 'billing'
  | 'runs'
  | 'system';

export interface AdminApiParams {
  conversation_id?: string;
  search?: string;
  state_filter?: string;
  verification_filter?: string;
  status_filter?: string;
  page?: number;
  page_size?: number;
}

export interface AdminApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: 'success' | 'denied' | 'unauthenticated' | 'error';
}

function normalizeParams(params?: AdminApiParams): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (!params) return body;

  if (params.conversation_id) body.conversation_id = params.conversation_id;

  if (params.search && params.search.trim()) {
    body.search = params.search.trim();
  }

  if (params.state_filter && params.state_filter !== 'all') {
    body.state = params.state_filter;
  }

  if (params.verification_filter && params.verification_filter !== 'all') {
    body.verification_status = params.verification_filter;
  }

  if (params.status_filter && params.status_filter !== 'all') {
    body.status = params.status_filter;
  }

  if (params.page !== undefined) {
    body.page = params.page + 1;
  }

  if (params.page_size !== undefined) {
    body.page_size = params.page_size;
  }

  return body;
}

export async function invokeAdminApi<T = unknown>(
  action: AdminAction,
  params?: AdminApiParams,
): Promise<AdminApiResponse<T>> {
  try {
    const body = { action, ...normalizeParams(params) };

    const { data, error } = await supabase.functions.invoke('forva-admin-data', { body });

    if (error) {
      const message = error.message || 'Unknown error';
      if (message.includes('ADMIN_ACCESS_DENIED') || message.includes('403') || message.includes('admin') || message.includes('denied')) {
        return { data: null, error: message, status: 'denied' };
      }
      if (message.includes('UNAUTHENTICATED') || message.includes('401') || message.includes('unauthenticated') || message.includes('auth')) {
        return { data: null, error: message, status: 'unauthenticated' };
      }
      return { data: null, error: message, status: 'error' };
    }

    return { data: data as T, error: null, status: 'success' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to reach admin data service';
    return { data: null, error: message, status: 'error' };
  }
}
