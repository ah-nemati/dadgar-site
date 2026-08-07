import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const middlewareFile = path.join(root, 'middleware.ts');
const proxyFile = path.join(root, 'proxy.ts');
const legacyAuthRoute = path.join(root, 'app', 'auth', '[auth0]', 'route.ts');

if (!fs.existsSync(middlewareFile)) {
  errors.push('Missing middleware.ts; Auth0 v4 requires middleware to mount /auth/* routes.');
} else {
  const body = fs.readFileSync(middlewareFile, 'utf8');
  if (!body.includes('auth0.middleware')) {
    errors.push('middleware.ts must delegate authentication requests to auth0.middleware(request).');
  }
  if (!body.includes('/auth/:path*')) {
    errors.push('middleware.ts must match /auth/:path*.');
  }
  if (!body.includes("'/account'")) {
    errors.push('middleware.ts must resolve /account before the public loading UI renders.');
  }
}

if (fs.existsSync(proxyFile)) {
  errors.push('proxy.ts must not coexist with middleware.ts in this Cloudflare build.');
}

if (fs.existsSync(legacyAuthRoute)) {
  errors.push('Remove app/auth/[auth0]/route.ts; Auth0 v4 routes are mounted by middleware.');
}

const authClient = path.join(root, 'lib', 'auth0.ts');
if (!fs.existsSync(authClient)) {
  errors.push('Missing lib/auth0.ts.');
} else {
  const body = fs.readFileSync(authClient, 'utf8');
  if (!body.includes('rolling: false')) {
    errors.push('Auth0 rolling sessions must remain disabled with the narrow middleware matcher.');
  }
}

if (errors.length > 0) {
  console.error('Runtime audit failed:\n');
  console.error(errors.map((item) => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log('Runtime audit passed: Auth0 routes and account routing use Cloudflare-compatible middleware.');
