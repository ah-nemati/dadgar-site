import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

for (const legacyFile of ['middleware.ts', 'middleware.js', 'proxy.ts', 'proxy.js']) {
  if (fs.existsSync(path.join(root, legacyFile))) {
    errors.push(`${legacyFile} must not exist; Auth0 is mounted through app/auth/[auth0]/route.ts.`);
  }
}

const authRoute = path.join(root, 'app', 'auth', '[auth0]', 'route.ts');
if (!fs.existsSync(authRoute)) {
  errors.push('Missing app/auth/[auth0]/route.ts.');
}

const authClient = path.join(root, 'lib', 'auth0.ts');
if (!fs.existsSync(authClient)) {
  errors.push('Missing lib/auth0.ts.');
} else {
  const body = fs.readFileSync(authClient, 'utf8');
  if (!body.includes('rolling: false')) {
    errors.push('Auth0 rolling sessions must be disabled when no global middleware is used.');
  }
}

if (errors.length > 0) {
  console.error('Runtime audit failed:\n');
  console.error(errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('Runtime audit passed: Auth0 uses the Cloudflare-safe route handler.');
