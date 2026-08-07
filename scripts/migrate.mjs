import fs from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';
import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (error) { if (error?.code !== 'ENOENT') throw error; }

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required.');

const sql = postgres(connectionString, {
  ssl: process.env.DATABASE_SSL === 'false' ? false : 'require',
  max: 1,
  prepare: false,
});

const dir = path.join(process.cwd(), 'database', 'migrations');
const files = (await fs.readdir(dir)).filter((name) => name.endsWith('.sql')).sort();
await sql.unsafe(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);

for (const name of files) {
  const [row] = await sql`select name from schema_migrations where name = ${name}`;
  if (row) continue;
  const body = await fs.readFile(path.join(dir, name), 'utf8');
  await sql.begin(async (tx) => {
    await tx.unsafe(body);
    await tx`insert into schema_migrations (name) values (${name})`;
  });
  console.log(`Applied ${name}`);
}

await sql.end();
