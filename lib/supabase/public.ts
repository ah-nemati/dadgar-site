import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * For PUBLIC, unauthenticated reads only (e.g. published blog posts via the
 * "Public can view published posts" RLS policy). Unlike lib/supabase/server.ts,
 * this doesn't touch cookies(), so it's safe to call from generateStaticParams
 * (which runs at build time, outside any HTTP request) as well as from regular
 * Server Components.
 */
export function createPublicClient() {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
