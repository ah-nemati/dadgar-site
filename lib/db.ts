import "server-only";

import { cache } from "react";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Sql = ReturnType<typeof postgres>;

interface HyperdriveBinding {
  connectionString: string;
}

interface DadgarCloudflareEnv {
  HYPERDRIVE?: HyperdriveBinding;
}

interface ConnectionConfig {
  connectionString: string;
  usingHyperdrive: boolean;
}

function positiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function validatePostgresUrl(value: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "DATABASE_URL is not a valid PostgreSQL connection URL. Expected postgres:// or postgresql://.",
    );
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(
      `DATABASE_URL uses unsupported protocol ${url.protocol}. Expected postgres:// or postgresql://.`,
    );
  }

  if (!url.hostname) {
    throw new Error("DATABASE_URL is missing a database host.");
  }

  if (!url.pathname || url.pathname === "/") {
    throw new Error("DATABASE_URL is missing a database name.");
  }

  return value;
}

function localConnectionString(): string {
  const value = process.env.DATABASE_URL?.trim();

  if (!value) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return validatePostgresUrl(value);
}

function resolveConnection(): ConnectionConfig {
  // `next dev` runs in Node.js and should connect directly through DATABASE_URL.
  // Trying to resolve Cloudflare bindings in this mode can pick up incomplete local
  // bindings and obscures connection errors.
  if (process.env.NODE_ENV === "development") {
    return {
      connectionString: localConnectionString(),
      usingHyperdrive: false,
    };
  }

  try {
    const context = getCloudflareContext() as unknown as {
      env: DadgarCloudflareEnv;
    };

    const hyperdriveUrl = context.env.HYPERDRIVE?.connectionString?.trim();

    if (hyperdriveUrl) {
      return {
        connectionString: validatePostgresUrl(hyperdriveUrl),
        usingHyperdrive: true,
      };
    }
  } catch {
    // Local Node.js (`next start`, migrations, scripts) has no Cloudflare context.
  }

  return {
    connectionString: localConnectionString(),
    usingHyperdrive: false,
  };
}

function localSslOption(): false | "require" | undefined {
  const value = process.env.DATABASE_SSL?.trim().toLowerCase();

  if (!value) return undefined;
  if (["0", "false", "disable", "disabled", "off"].includes(value)) return false;
  if (["1", "true", "require", "required", "on"].includes(value)) return "require";

  return undefined;
}

function createSql(): Sql {
  const { connectionString, usingHyperdrive } = resolveConnection();

  // Two seconds was too aggressive for a remote PostgreSQL database, especially
  // during local development or a cold network path. Postgres.js itself defaults
  // to 30 seconds; we use a balanced default and still allow an env override.
  const connectTimeout = usingHyperdrive
    ? positiveInteger(process.env.HYPERDRIVE_CONNECT_TIMEOUT, 5)
    : positiveInteger(
        process.env.DATABASE_CONNECT_TIMEOUT ?? process.env.PGCONNECT_TIMEOUT,
        10,
      );

  const ssl = usingHyperdrive ? undefined : localSslOption();

  return postgres(connectionString, {
    // Cloudflare recommends a small per-request pool when using Hyperdrive.
    // Direct/local connections stay at one connection.
    max: usingHyperdrive ? 5 : 1,
    idle_timeout: 20,
    connect_timeout: connectTimeout,
    fetch_types: false,
    // Current Hyperdrive/Postgres.js supports prepared statements and benefits
    // from them. Keep the conservative setting for direct/local connections.
    prepare: usingHyperdrive,
    transform: postgres.camel,
    ...(ssl === undefined ? {} : { ssl }),
  });
}

/**
 * OpenNext recommends creating database clients in request context for Workers.
 * React cache keeps one Postgres.js client for the current server render/request.
 */
const getRequestSql = cache(createSql);

/**
 * Compatibility proxy so existing calls keep working:
 *
 *   db`select ...`
 *   db.unsafe(...)
 *   db.begin(...)
 */
const dbTarget = (() => undefined) as unknown as Sql;

export const db = new Proxy(dbTarget, {
  apply(_target, _thisArg, args) {
    const sql = getRequestSql();

    return Reflect.apply(
      sql as unknown as (...values: unknown[]) => unknown,
      sql,
      args,
    );
  },

  get(_target, property) {
    const sql = getRequestSql();
    const value = Reflect.get(sql as unknown as object, property);

    if (typeof value === "function") {
      return value.bind(sql);
    }

    return value;
  },
});
