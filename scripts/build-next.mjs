import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const nextBin = resolve('node_modules/next/dist/bin/next');

if (!existsSync(nextBin)) {
  console.error('Next.js is not installed. Run: npm install --include=optional');
  process.exit(1);
}

const result = spawnSync(process.execPath, [nextBin, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Prevent Next.js from trying to rewrite package-lock.json during a build.
    // Optional SWC packages are installed explicitly through .npmrc / npm install.
    NEXT_IGNORE_INCORRECT_LOCKFILE: '1',
    NEXT_TELEMETRY_DISABLED: '1',
  },
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
