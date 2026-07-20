import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Local file-based SQLite — free, zero setup, works immediately with `npm install`.
// Good for local dev and for any host with a persistent filesystem. NOT suitable
// for Vercel's default serverless deployment (ephemeral filesystem) — see the
// "Database" section in README.md for the free-tier upgrade path (Turso) when
// you're ready to deploy.
const dataDir = path.join(process.cwd(), '.data');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS consultation_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    practice_area TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;
