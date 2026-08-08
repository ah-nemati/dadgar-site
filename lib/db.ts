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

function localConnectionString(): string {
  const value = process.env.DATABASE_URL?.trim();

  if (!value) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return value;
}

function createSql(): Sql {
  let connectionString: string;
  let usingHyperdrive = false;

  try {
    const context = getCloudflareContext() as unknown as {
      env: DadgarCloudflareEnv;
    };

    const hyperdriveUrl = context.env.HYPERDRIVE?.connectionString?.trim();

    if (hyperdriveUrl) {
      connectionString = hyperdriveUrl;
      usingHyperdrive = true;
    } else {
      connectionString = localConnectionString();
    }
  } catch {
    // next dev / migrations / local Node.js
    connectionString = localConnectionString();
  }

  return postgres(connectionString, {
    max: 1,

    idle_timeout: 5,
    connect_timeout: 5,

    fetch_types: false,

    prepare: false,

    transform: postgres.camel,

    ...(usingHyperdrive
      ? {}
      : {
          ssl: process.env.DATABASE_SSL === "false" ? false : "require",
        }),
  });
}

/**
 * OpenNext recommends creating the database client in request context.
 * React cache keeps one instance for the current server request/render.
 */
const getRequestSql = cache(createSql);

/**
 * Compatibility proxy.
 *
 * Existing code can continue using:
 *
 *   db`select ...`
 *   db.unsafe(...)
 *   db.begin(...)
 *
 * without changing every database call in the project.
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
