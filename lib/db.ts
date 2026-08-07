import 'server-only';
import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __dadgarSql: ReturnType<typeof postgres> | undefined;
}

function connectionString(): string {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error('DATABASE_URL is not configured.');
  return value;
}

export const db =
  globalThis.__dadgarSql ??
  postgres(connectionString(), {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: false,
    ssl: process.env.DATABASE_SSL === 'false' ? false : 'require',
    transform: postgres.camel,
  });

if (process.env.NODE_ENV !== 'production') globalThis.__dadgarSql = db;

