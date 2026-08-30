import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type BusinessRow } from '@/lib/dashboard/workspace';

interface BusinessesState {
  data: BusinessRow[];
  loading: boolean;
  error: string | null;
  count: number;
}

export function useBusinesses(workspaceId: string | null, search: string, stateFilter: string, verificationFilter: string, page: number, pageSize: number) {
  const [state, setState] = useState<BusinessesState>({ data: [], loading: true, error: null, count: 0 });

  const fetchBusinesses = useCallback(async () => {
    if (!workspaceId) {
      setState({ data: [], loading: false, error: null, count: 0 });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    let query = supabase
      .from('businesses')
      .select('id, name, domain, website_url, city, region, country_code, address_text, operational_status, verification_status, verified_at, public_email, phone, state, updated_at', { count: 'exact' })
      .eq('workspace_id', workspaceId);

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[(),]/g, ' ');
      query = query.or(`name.ilike.%${safeSearch}%,domain.ilike.%${safeSearch}%,public_email.ilike.%${safeSearch}%`);
    }
    if (stateFilter !== 'all') {
      query = query.eq('state', stateFilter);
    }
    if (verificationFilter !== 'all') {
      query = query.eq('verification_status', verificationFilter);
    }

    const from = page * pageSize;
    const to = from + pageSize - 1;
    query = query.order('updated_at', { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      setState({ data: [], loading: false, error: 'Prospects could not be loaded. Please refresh and try again.', count: 0 });
      return;
    }

    setState({
      data: (data as BusinessRow[]) ?? [],
      loading: false,
      error: null,
      count: count ?? 0,
    });
  }, [workspaceId, search, stateFilter, verificationFilter, page, pageSize]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return { ...state, refresh: fetchBusinesses };
}
