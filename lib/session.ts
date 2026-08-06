
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { UserRole } from '@/types/content';

export interface CurrentAccount {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
}

interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
}

export function dashboardPath(role: UserRole): '/admin' | '/portal' {
  return role === 'admin' ? '/admin' : '/portal';
}

export function initialsFor(name: string, email = ''): string {
  const source = name.trim() || email.trim();
  if (!source) return 'ک';
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1
    ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`
    : source.slice(0, 2)
  ).toUpperCase();
}

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !profile) return null;
    const row = profile as ProfileRow;

    return {
      id: row.id,
      email: user.email ?? '',
      fullName: row.full_name,
      phone: row.phone,
      role: row.role,
    };
  } catch {
    return null;
  }
}

export async function requireAccount(): Promise<CurrentAccount> {
  const account = await getCurrentAccount();
  if (!account) redirect('/login');
  return account;
}

export async function requireAdmin(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role !== 'admin') redirect('/portal');
  return account;
}

export async function requireClient(): Promise<CurrentAccount> {
  const account = await requireAccount();
  if (account.role === 'admin') redirect('/admin');
  return account;
}
