
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/content';

interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'client';
  created_at: string;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return toProfile(data as ProfileRow);
}

export async function updateOwnProfile(input: { fullName: string; phone: string }): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: input.fullName, phone: input.phone })
    .eq('id', user.id);

  if (error) throw error;
}
