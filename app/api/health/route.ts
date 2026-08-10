import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ReadinessRow {
  usersTable: string | null;
  sessionsTable: string | null;
  rateLimitsTable: string | null;
}

export async function GET(): Promise<Response> {
  const timestamp = new Date().toISOString();

  try {
    const [readiness] = await db<ReadinessRow[]>`
      select
        to_regclass('public.users')::text as users_table,
        to_regclass('public.user_sessions')::text as sessions_table,
        to_regclass('public.auth_rate_limits')::text as rate_limits_table
    `;
    const databaseReady = Boolean(
      readiness?.usersTable &&
        readiness.sessionsTable &&
        readiness.rateLimitsTable,
    );

    return Response.json(
      {
        ok: databaseReady,
        service: 'dadgar-site',
        database: databaseReady ? 'ready' : 'migration-required',
        timestamp,
      },
      {
        status: databaseReady ? 200 : 503,
        headers: { 'cache-control': 'no-store' },
      },
    );
  } catch {
    return Response.json(
      {
        ok: false,
        service: 'dadgar-site',
        database: 'unavailable',
        timestamp,
      },
      {
        status: 503,
        headers: { 'cache-control': 'no-store' },
      },
    );
  }
}
