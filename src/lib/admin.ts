import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user?.id) return false;

  const { data, error } = await supabase
    .from('platform_admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return false;

  return !!data;
}
