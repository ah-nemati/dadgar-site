import postgres from 'postgres';
import dotenv from 'dotenv';
import { createHmac, randomBytes, createHash } from 'crypto';

dotenv.config({ path: '.env.local' });

const db = postgres(process.env.DATABASE_URL);

function randomBase64Url(bytesLength = 32) {
  return randomBytes(bytesLength).toString('base64url');
}

async function generateSessionToken(userId, role) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const payload = {
    version: 1,
    sessionId: randomBase64Url(32),
    userId,
    role,
    expiresAt: expiresAt.getTime(),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signedValue = `v1.${encodedPayload}`;
  const hmac = createHmac('sha256', process.env.SESSION_SECRET.trim());
  hmac.update(signedValue);
  const signature = hmac.digest('base64url');
  const token = `${signedValue}.${signature}`;

  const tokenHash = createHash('sha256').update(token).digest('hex');
  await db`
    insert into user_sessions (token_hash, user_id, expires_at, ip_hash, user_agent_hash)
    values (${tokenHash}, ${userId}, ${expiresAt}, null, null)
    on conflict (token_hash) do nothing
  `;
  return token;
}

async function testPages() {
  const [adminUser] = await db`select id, email, role from users where email = 'amirhoseinnemati79@gmail.com'`;
  const [clientUser] = await db`select id, email, role from users where email = 'bbb@bbb.bbb'`;

  const adminToken = await generateSessionToken(adminUser.id, adminUser.role);
  const clientToken = await generateSessionToken(clientUser.id, clientUser.role);

  const adminPages = [
    '/admin',
    '/admin/appointments',
    '/admin/cases',
    '/admin/cases/new',
    '/admin/clients',
    '/admin/blog',
    '/admin/blog/new',
    '/admin/support',
    '/admin/messages',
    '/admin/site',
    '/admin/seo',
    '/admin/audit',
    '/admin/security',
  ];

  console.log('--- Testing Admin Routes ---');
  for (const page of adminPages) {
    const res = await fetch(`http://localhost:3000${page}`, {
      headers: {
        Cookie: `dadgar_session=${adminToken}`,
      },
    });
    const html = await res.text();
    console.log(`[Admin] ${page} -> Status: ${res.status}, Length: ${html.length}`);
    if (res.status !== 200) {
      console.error(`ERROR on ${page}: status ${res.status}`);
    }
  }

  const cases = await db`select id from client_cases limit 2`;
  for (const c of cases) {
    const res = await fetch(`http://localhost:3000/admin/cases/${c.id}`, {
      headers: { Cookie: `dadgar_session=${adminToken}` },
    });
    console.log(`[Admin] /admin/cases/${c.id} -> Status: ${res.status}`);
  }

  const supportThreads = await db`select id from support_threads limit 2`;
  for (const t of supportThreads) {
    const res = await fetch(`http://localhost:3000/admin/support/${t.id}`, {
      headers: { Cookie: `dadgar_session=${adminToken}` },
    });
    console.log(`[Admin] /admin/support/${t.id} -> Status: ${res.status}`);
  }

  const clients = await db`select id from users limit 2`;
  for (const u of clients) {
    const res = await fetch(`http://localhost:3000/admin/clients/${u.id}`, {
      headers: { Cookie: `dadgar_session=${adminToken}` },
    });
    console.log(`[Admin] /admin/clients/${u.id} -> Status: ${res.status}`);
  }

  const blogPosts = await db`select id from blog_posts limit 2`;
  for (const b of blogPosts) {
    const res = await fetch(`http://localhost:3000/admin/blog/${b.id}`, {
      headers: { Cookie: `dadgar_session=${adminToken}` },
    });
    console.log(`[Admin] /admin/blog/${b.id} -> Status: ${res.status}`);
  }

  console.log('\n--- Testing Client Portal Routes ---');
  const portalPages = [
    '/portal',
    '/portal/appointments',
    '/portal/cases',
    '/portal/messages',
    '/portal/profile',
  ];
  for (const page of portalPages) {
    const res = await fetch(`http://localhost:3000${page}`, {
      headers: {
        Cookie: `dadgar_session=${clientToken}`,
      },
    });
    const html = await res.text();
    console.log(`[Portal] ${page} -> Status: ${res.status}, Length: ${html.length}`);
    if (res.status !== 200) {
      console.error(`ERROR on ${page}: status ${res.status}`);
    }
  }

  for (const t of supportThreads) {
    const res = await fetch(`http://localhost:3000/portal/messages/${t.id}`, {
      headers: { Cookie: `dadgar_session=${clientToken}` },
    });
    console.log(`[Portal] /portal/messages/${t.id} -> Status: ${res.status}`);
  }

  await db.end();
}

testPages().catch(console.error);
