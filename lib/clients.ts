
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

export async function getClients(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as ProfileRow[]).map(toProfile);
}

export async function getClientById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, created_at')
    .eq('id', id)
    .eq('role', 'client')
    .maybeSingle();

  if (error) throw error;
  return data ? toProfile(data as ProfileRow) : null;
}
