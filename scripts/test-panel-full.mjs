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

async function runFullPanelVerification() {
  console.log('=== STARTING FULL PANEL VERIFICATION ===\n');

  const [adminUser] = await db`select id, email, role, status from users where email = 'amirhoseinnemati79@gmail.com'`;
  const [clientUser] = await db`select id, email, role, status from users where email = 'bbb@bbb.bbb'`;

  if (!adminUser || !clientUser) {
    throw new Error('Test users not found in DB!');
  }

  console.log(`Admin User: ${adminUser.email} (Role: ${adminUser.role}, Status: ${adminUser.status})`);
  console.log(`Client User: ${clientUser.email} (Role: ${clientUser.role}, Status: ${clientUser.status})\n`);

  const adminToken = await generateSessionToken(adminUser.id, adminUser.role);
  const clientToken = await generateSessionToken(clientUser.id, clientUser.role);

  const adminRoutes = [
    { path: '/admin', title: 'داشبورد مدیریت' },
    { path: '/admin/appointments', title: 'مدیریت نوبت‌ها' },
    { path: '/admin/cases', title: 'مدیریت پرونده‌ها' },
    { path: '/admin/cases/new', title: 'ثبت پرونده جدید' },
    { path: '/admin/clients', title: 'مدیریت کاربران' },
    { path: '/admin/blog', title: 'مدیریت وبلاگ' },
    { path: '/admin/blog/new', title: 'مطلب جدید' },
    { path: '/admin/support', title: 'گفت‌وگو با موکلان' },
    { path: '/admin/messages', title: 'درخواست‌های مشاوره' },
    { path: '/admin/site', title: 'تنظیمات دفتر و سایت' },
    { path: '/admin/seo', title: 'SEO و دیده‌شدن در گوگل' },
    { path: '/admin/audit', title: 'گزارش فعالیت و امنیت' },
    { path: '/admin/security', title: 'امنیت حساب' },
  ];

  console.log('--- Checking Admin Panel Pages ---');
  let adminErrors = 0;
  for (const { path, title } of adminRoutes) {
    const res = await fetch(`http://localhost:3000${path}`, {
      headers: { Cookie: `dadgar_session=${adminToken}` },
    });
    const html = await res.text();

    const hasLogout = html.includes('خروج') || html.includes('در حال خروج...');
    const hasNaN = html.includes('NaN');
    const hasInvalidDate = html.includes('Invalid Date');

    if (res.status !== 200 || !hasLogout || hasNaN || hasInvalidDate) {
      console.error(`❌ FAIL: ${path} [Status: ${res.status}, hasLogout: ${hasLogout}, hasNaN: ${hasNaN}, hasInvalidDate: ${hasInvalidDate}]`);
      adminErrors++;
    } else {
      console.log(`✅ PASS: ${path} (${title}) -> Status: ${res.status}, Size: ${html.length} bytes`);
    }
  }

  console.log('\n--- Checking Client Portal Pages ---');
  const portalRoutes = [
    { path: '/portal', title: 'داشبورد موکل' },
    { path: '/portal/appointments', title: 'نوبت مشاوره' },
    { path: '/portal/cases', title: 'پرونده‌های من' },
    { path: '/portal/messages', title: 'صحبت با وکیل' },
    { path: '/portal/profile', title: 'اطلاعات حساب کاربری' },
  ];

  let portalErrors = 0;
  for (const { path, title } of portalRoutes) {
    const res = await fetch(`http://localhost:3000${path}`, {
      headers: { Cookie: `dadgar_session=${clientToken}` },
    });
    const html = await res.text();

    const hasLogout = html.includes('خروج') || html.includes('در حال خروج...');
    const hasNaN = html.includes('NaN');
    const hasInvalidDate = html.includes('Invalid Date');

    if (res.status !== 200 || !hasLogout || hasNaN || hasInvalidDate) {
      console.error(`❌ FAIL: ${path} [Status: ${res.status}, hasLogout: ${hasLogout}, hasNaN: ${hasNaN}, hasInvalidDate: ${hasInvalidDate}]`);
      portalErrors++;
    } else {
      console.log(`✅ PASS: ${path} (${title}) -> Status: ${res.status}, Size: ${html.length} bytes`);
    }
  }

  console.log('\n=== VERIFICATION SUMMARY ===');
  console.log(`Admin Pages Checked: ${adminRoutes.length}, Errors: ${adminErrors}`);
  console.log(`Portal Pages Checked: ${portalRoutes.length}, Errors: ${portalErrors}`);

  await db.end();

  if (adminErrors > 0 || portalErrors > 0) {
    process.exit(1);
  }
}

runFullPanelVerification().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
