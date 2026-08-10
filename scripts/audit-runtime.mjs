import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const middlewareFile = path.join(root, 'middleware.ts');
const proxyFile = path.join(root, 'proxy.ts');
const removedProvider = `${'auth'}${'0'}`;
const noPrefetchLinkFile = path.join(root, 'components', 'NoPrefetchLink.tsx');

if (!fs.existsSync(middlewareFile)) {
  errors.push('Missing Edge Middleware for route protection.');
} else {
  const body = fs.readFileSync(middlewareFile, 'utf8');
  for (const required of [
    'verifySessionToken',
    'canonicalHostRedirect',
    "const WWW_HOST = 'www.majidsavarivakil.ir'",
    "const CANONICAL_HOST = 'majidsavarivakil.ir'",
    "runtime = 'experimental-edge'",
    "'/admin/:path*'",
    "'/portal/:path*'",
    "'/account'",
  ]) {
    if (!body.includes(required)) errors.push(`middleware.ts is missing ${required}.`);
  }
}

if (fs.existsSync(proxyFile)) {
  errors.push('Node.js proxy.ts is not supported by the configured OpenNext adapter.');
}

const nextConfigFile = path.join(root, 'next.config.ts');
if (
  fs.existsSync(nextConfigFile) &&
  /majidsavarivakil\.ir\/:path\*/.test(fs.readFileSync(nextConfigFile, 'utf8'))
) {
  errors.push('next.config.ts still contains the broken literal :path* redirect.');
}

if (
  !fs.existsSync(noPrefetchLinkFile) ||
  !fs.readFileSync(noPrefetchLinkFile, 'utf8').includes('prefetch={false}')
) {
  errors.push('The no-prefetch Link wrapper is missing or does not disable prefetching.');
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
      `Direct next/link import bypasses the no-prefetch wrapper in ${path.relative(root, target)}.`,
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
  'Runtime audit passed: internal sessions, route protection, provider cleanup and prefetch controls are present.',
);
