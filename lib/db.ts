import 'server-only';
import postgres from 'postgres';

type Database = ReturnType<typeof postgres>;

function connectionString(): string {
  const value = process.env.DATABASE_URL?.trim();
  if (!value) throw new Error('DATABASE_URL is not configured.');
  return value;
}

function createClient(): Database {
  return postgres(connectionString(), {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 15,
    prepare: false,
    ssl: process.env.DATABASE_SSL === 'false' ? false : 'require',
    transform: postgres.camel,
  });
}

async function closeClient(client: Database): Promise<void> {
  try {
    await client.end({ timeout: 1 });
  } catch {
    // Best-effort cleanup; preserve the original query result/error.
  }
}

/**
 * Cloudflare Workers must not reuse a Postgres.js socket across requests.
 * Keep the existing tagged-template API while creating a fresh client for
 * each database operation. Transactions receive one dedicated client.
 */
const taggedQuery = async (
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<unknown> => {
  const client = createClient();
  try {
    const run = client as unknown as (
      query: TemplateStringsArray,
      ...parameters: unknown[]
    ) => Promise<unknown>;
    return await run(strings, ...values);
  } finally {
    await closeClient(client);
  }
};

export const db = taggedQuery as unknown as Database;

Object.defineProperty(db, 'begin', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: async (callback: unknown) => {
    const client = createClient();
    try {
      return await client.begin(callback as never);
    } finally {
      await closeClient(client);
    }
  },
});
