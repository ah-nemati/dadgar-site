import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. Server Components can't write cookies (the setAll try/catch below),
 * so token refresh actually gets persisted by proxy.ts on every request instead.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — proxy.ts refreshes the session
          // and persists the cookie instead, so this can be safely ignored.
        }
      },
    },
  });
}
