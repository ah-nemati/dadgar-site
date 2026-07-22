import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in Client Components (browser).
 * NEXT_PUBLIC_* vars are safe to expose — this is the public "anon"/"publishable"
 * key, not a secret. Access control is enforced by Postgres Row Level Security
 * (see supabase/schema.sql), not by hiding this key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
