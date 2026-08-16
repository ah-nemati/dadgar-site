import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const middlewareFile = path.join(root, 'middleware.ts');
const proxyFile = path.join(root, 'proxy.ts');
const removedProvider = `${'auth'}${'0'}`;
const noPrefetchLinkFile = path.join(root, 'components', 'NoPrefetchLink.tsx');

// Route authorization is enforced by App Router layouts and server actions.
// Keeping auth out of middleware/proxy avoids an extra routing layer and keeps
// the Cloudflare/OpenNext deployment path predictable.
if (fs.existsSync(middlewareFile)) {
  errors.push('middleware.ts should be removed; protected routes are guarded by App Router layouts.');
}
if (fs.existsSync(proxyFile)) {
  errors.push('proxy.ts should be removed for the configured OpenNext deployment.');
}

const routeGuards = [
  ['app/admin/layout.tsx', 'requireStaff'],
  ['app/admin/blog/layout.tsx', 'requireAdmin'],
  ['app/admin/clients/layout.tsx', 'requireAdmin'],
  ['app/portal/layout.tsx', 'requireClient'],
  ['app/account/page.tsx', 'requireAccount'],
];

for (const [relative, guard] of routeGuards) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(guard)) {
    errors.push(`${relative} is missing the ${guard} route guard.`);
  }
}

const nextConfigFile = path.join(root, 'next.config.ts');
if (!fs.existsSync(nextConfigFile)) {
  errors.push('next.config.ts is missing.');
} else {
  const body = fs.readFileSync(nextConfigFile, 'utf8');
  for (const required of [
    "type: 'host'",
    "value: 'www.majidsavarivakil.ir'",
    "destination: 'https://majidsavarivakil.ir/:path*'",
  ]) {
    if (!body.includes(required)) errors.push(`next.config.ts is missing canonical redirect setting: ${required}.`);
  }
}

if (!fs.existsSync(noPrefetchLinkFile)) {
  errors.push('The shared Link wrapper is missing.');
} else {
  const body = fs.readFileSync(noPrefetchLinkFile, 'utf8');
  if (!body.includes('NON_PREFETCH_PREFIXES') || !body.includes('prefetch=')) {
    errors.push('The shared Link wrapper no longer applies selective prefetch behavior.');
  }
}

const passwordFile = path.join(root, 'lib', 'auth', 'password.ts');
const sessionFile = path.join(root, 'lib', 'auth', 'session-token.ts');
const migrationFile = path.join(root, 'database', 'migrations', '003_internal_auth.sql');

if (!fs.existsSync(passwordFile) || !fs.readFileSync(passwordFile, 'utf8').includes('600_000')) {
  errors.push('The password hashing module is missing the configured PBKDF2 work factor.');
}
if (!fs.existsSync(sessionFile) || !fs.readFileSync(sessionFile, 'utf8').includes('hashSessionToken')) {
  errors.push('The signed and hashed session-token module is missing.');
}
if (!fs.existsSync(migrationFile)) {
  errors.push('The internal authentication database migration is missing.');
}

const scanRoots = [
  'app',
  'components',
  'lib',
  'scripts',
  'database',
  'package.json',
  '.env.example',
  '.dev.vars.example',
  'wrangler.jsonc',
  '.github',
];
const skipped = new Set(['node_modules', '.next', '.open-next', '.git']);

function scan(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
      if (!skipped.has(entry.name)) scan(path.join(target, entry.name));
    }
    return;
  }

  const source = fs.readFileSync(target, 'utf8');
  const body = source.toLowerCase();
  if (body.includes(removedProvider)) {
    errors.push(`Removed authentication provider reference remains in ${path.relative(root, target)}.`);
  }

  if (
    target !== noPrefetchLinkFile &&
    /from\s+['"]next\/link['"]/.test(source)
  ) {
    errors.push(
      `Direct next/link import bypasses the shared Link wrapper in ${path.relative(root, target)}.`,
    );
  }
}

for (const item of scanRoots) scan(path.join(root, item));
if (fs.existsSync(path.join(root, removedProvider))) {
  errors.push('Removed authentication provider directory still exists.');
}

if (errors.length > 0) {
  console.error('Runtime audit failed:\n');
  console.error(errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(
  'Runtime audit passed: App Router guards, canonical host redirect, internal sessions and selective prefetch controls are present.',
);
