import { useCallback, useEffect, useState } from 'react';
import { invokeAdminApi, type AdminAction, type AdminApiParams, type AdminApiResponse } from '@/lib/admin/adminApi';

interface AdminDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: 'success' | 'denied' | 'unauthenticated' | 'error' | 'idle';
}

export function useAdminApi<T = unknown>(action: AdminAction | null, params?: AdminApiParams) {
  const [state, setState] = useState<AdminDataState<T>>({
    data: null,
    loading: false,
    error: null,
    status: 'idle',
  });

  const fetch = useCallback(async () => {
    if (!action) {
      setState({ data: null, loading: false, error: null, status: 'idle' });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    const res: AdminApiResponse<T> = await invokeAdminApi<T>(action, params);

    setState({
      data: res.data,
      loading: false,
      error: res.error,
      status: res.status,
    });
  }, [action, JSON.stringify(params)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refresh: fetch };
}
