import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { UserRole } from '@/types/content';

export interface AuthProfile {
  id: string;
  role: UserRole;
}

async function readProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<AuthProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) return null;
  if (data.role !== 'admin' && data.role !== 'client') return null;

  return { id: data.id as string, role: data.role };
}

export async function getOrCreateAuthProfile(
  supabase: SupabaseClient,
  user: User
): Promise<AuthProfile | null> {
  const existing = await readProfile(supabase, user.id);
  if (existing) return existing;

  const { error } = await supabase.rpc('ensure_my_profile');
  if (error) {
    console.error('[auth] ensure_my_profile failed', {
      code: error.code,
      message: error.message,
      userId: user.id,
    });
    return null;
  }

  return readProfile(supabase, user.id);
}
