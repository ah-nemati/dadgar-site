import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const middlewareFile = path.join(root, 'middleware.ts');
const proxyFile = path.join(root, 'proxy.ts');
const removedProvider = `${'auth'}${'0'}`;

if (!fs.existsSync(middlewareFile)) {
  errors.push('Missing Edge Middleware for route protection.');
} else {
  const body = fs.readFileSync(middlewareFile, 'utf8');
  for (const required of [
    'verifySessionToken',
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

  const body = fs.readFileSync(target, 'utf8').toLowerCase();
  if (body.includes(removedProvider)) {
    errors.push(`Removed authentication provider reference remains in ${path.relative(root, target)}.`);
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

console.log('Runtime audit passed: internal sessions, route protection and provider cleanup are present.');
