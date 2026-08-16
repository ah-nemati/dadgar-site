import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

const requiredPages = [
  'app/page.tsx',
  'app/blog/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/practice-areas/page.tsx',
  'app/practice-areas/[slug]/page.tsx',
  'app/lawyers/page.tsx',
  'app/lawyers/[slug]/page.tsx',
  'app/admin/page.tsx',
  'app/admin/blog/page.tsx',
  'app/admin/appointments/page.tsx',
  'app/admin/messages/page.tsx',
  'app/admin/cases/page.tsx',
  'app/admin/support/page.tsx',
  'app/admin/content/page.tsx',
  'app/admin/site/page.tsx',
  'app/admin/seo/page.tsx',
  'app/admin/clients/page.tsx',
  'app/admin/audit/page.tsx',
  'app/admin/security/page.tsx',
  'app/portal/page.tsx',
  'app/portal/messages/page.tsx',
  'app/portal/appointments/page.tsx',
  'app/portal/cases/page.tsx',
  'app/portal/profile/page.tsx',
];

for (const relative of requiredPages) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Missing route file: ${relative}`);
}

for (const relative of [
  'app/blog/[slug]/page.tsx',
  'app/practice-areas/[slug]/page.tsx',
  'app/lawyers/[slug]/page.tsx',
]) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const body = fs.readFileSync(file, 'utf8');
  if (!body.includes('force-dynamic')) {
    errors.push(`${relative} should render dynamically so CMS-created slugs do not 404 after deployment.`);
  }
}

for (const legacy of ['middleware.ts', 'proxy.ts']) {
  if (fs.existsSync(path.join(root, legacy))) {
    errors.push(`${legacy} should not exist; route authorization is handled inside App Router layouts.`);
  }
}

if (errors.length) {
  console.error('Route audit failed:\n');
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Route audit passed: ${requiredPages.length} route files are present and CMS slug routes are dynamic.`);
