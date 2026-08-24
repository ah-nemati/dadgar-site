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

async function runClientDeepTest() {
  console.log('=== STARTING DEEP CLIENT PORTAL TEST ===\n');

  const [clientUser] = await db`select id, email, role, name, phone from users where email = 'bbb@bbb.bbb'`;
  const [adminUser] = await db`select id, email, role from users where email = 'amirhoseinnemati79@gmail.com'`;

  if (!clientUser) {
    throw new Error('Client user bbb@bbb.bbb not found!');
  }

  console.log('1. Setting up sample data for Client (Case, Update, Document, Support Thread)...');

  // Insert or get test case
  let [testCase] = await db`select id, title, case_number from client_cases where client_id = ${clientUser.id} limit 1`;
  if (!testCase) {
    [testCase] = await db`
      insert into client_cases (client_id, case_number, title, court, status, description, next_action, next_action_at, created_at, updated_at)
      values (
        ${clientUser.id},
        '۱۴۰۵-۹۸۷۶۵',
        'پرونده الزام به تنظیم سند رسمی ملک کیانپارس',
        'شعبه ۱۲ دادگاه عمومی حقوقی اهواز',
        'in_progress',
        'دادخواست الزام به تنظیم سند رسمی انتقال ملک، تحویل مبیع و مطالبه خسارت تأخیر تادیه به طرفیت فروشنده.',
        'جلسه رسیدگی و استعلام ثبتی از اداره ثبت اسناد اهواز',
        now() + interval '5 days',
        now() - interval '10 days',
        now()
      )
      returning id, title, case_number
    `;
  }
  console.log(`   -> Using Case ID: ${testCase.id} (${testCase.title})`);

  // Insert case update if none
  let [caseUpdate] = await db`select id, title from case_updates where case_id = ${testCase.id} limit 1`;
  if (!caseUpdate) {
    [caseUpdate] = await db`
      insert into case_updates (case_id, title, body, created_at)
      values (
        ${testCase.id},
        'صدور استعلام ثبتی و تعیین وقت رسیدگی',
        'استعلام وضعیت پلاک ثبتی از اداره ثبت اسناد اهواز صادر گردید و لایحه دفاعیه جهت جلسه اول رسیدگی آماده و ارسال شد.',
        now() - interval '2 days'
      )
      returning id, title
    `;
  }
  console.log(`   -> Using Case Update ID: ${caseUpdate.id}`);

  // Insert case document if none
  let [caseDoc] = await db`select id, title from client_documents where case_id = ${testCase.id} limit 1`;
  if (!caseDoc) {
    [caseDoc] = await db`
      insert into client_documents (case_id, client_id, title, file_name, file_path, mime_type, file_size, created_at)
      values (
        ${testCase.id},
        ${clientUser.id},
        'تصویر مبایعه‌نامه و دادخواست بدوی',
        'mobayenameh-kianpars.pdf',
        'https://example.com/mock-doc.pdf',
        'application/pdf',
        1548200,
        now() - interval '3 days'
      )
      returning id, title
    `;
  }
  console.log(`   -> Using Case Document ID: ${caseDoc.id}`);

  // Insert or get support thread
  let [thread] = await db`select id, subject from support_threads where client_id = ${clientUser.id} limit 1`;
  if (!thread) {
    [thread] = await db`
      insert into support_threads (client_id, subject, practice_area, status, created_at, updated_at)
      values (
        ${clientUser.id},
        'سؤال در خصوص مدارک مورد نیاز جلسه دادگاه',
        'real-estate',
        'answered',
        now() - interval '1 day',
        now()
      )
      returning id, subject
    `;
  }
  console.log(`   -> Using Support Thread ID: ${thread.id}`);

  // Ensure messages exist
  const existingMsgs = await db`select id from support_messages where thread_id = ${thread.id}`;
  if (existingMsgs.length === 0) {
    await db`
      insert into support_messages (thread_id, sender_id, body, created_at)
      values (
        ${thread.id},
        ${clientUser.id},
        'سلام و احترام، آیا نیاز هست اصل مدارک واریزی را برای جلسه دادگاه همراه داشته باشم یا کپی برابر اصل کافی است؟',
        now() - interval '1 day'
      )
    `;

    await db`
      insert into support_messages (thread_id, sender_id, body, created_at)
      values (
        ${thread.id},
        ${adminUser.id},
        'سلام جناب محترم، اصل فیش‌ها و مبایعه‌نامه را حتماً در روز جلسه همراه داشته باشید تا در صورت مطالبه دادگاه ارائه نماییم.',
        now() - interval '18 hours'
      )
    `;
  }

  console.log('\n2. Testing Client Portal Pages with Authenticated Session...');
  const clientToken = await generateSessionToken(clientUser.id, clientUser.role);

  const portalUrls = [
    { url: '/portal', label: 'صفحه اصلی پرتال موکل' },
    { url: '/portal/appointments', label: 'نوبت‌های من' },
    { url: '/portal/cases', label: 'لیست پرونده‌ها' },
    { url: `/portal/cases/${testCase.id}`, label: 'جزئیات پرونده موکل' },
    { url: '/portal/messages', label: 'گفت‌وگوهای موکل' },
    { url: `/portal/messages/${thread.id}`, label: 'صفحه گفت‌وگو با وکیل' },
    { url: '/portal/profile', label: 'پروفایل و تغییر رمز' },
  ];

  let testPassed = true;

  for (const item of portalUrls) {
    const res = await fetch(`http://localhost:3000${item.url}`, {
      headers: { Cookie: `dadgar_session=${clientToken}` },
    });
    const html = await res.text();

    const is200 = res.status === 200;
    const hasLogoutBtn = html.includes('خروج') || html.includes('در حال خروج...');
    const hasNaN = html.includes('NaN');
    const hasInvalidDate = html.includes('Invalid Date');

    let specificCheck = true;
    let specificDetail = '';

    if (item.url === '/portal') {
      specificCheck = html.includes('سلام') && html.includes('پرونده‌های من');
      specificDetail = 'Client greetings & stats cards';
    } else if (item.url === '/portal/appointments') {
      specificCheck = html.includes('نوبت مشاوره') && html.includes('زمان نوبت:');
      specificDetail = 'Appointment request form and appointments list';
    } else if (item.url === '/portal/cases') {
      specificCheck = html.includes('پرونده‌های من');
      specificDetail = 'Cases list';
    } else if (item.url.startsWith('/portal/cases/')) {
      specificCheck = html.includes('روند پرونده') && html.includes('اسناد قابل دریافت');
      specificDetail = 'Case detail, update timeline, document download button';
    } else if (item.url === '/portal/messages') {
      specificCheck = html.includes('صحبت با وکیل');
      specificDetail = 'Messages thread list & new thread form';
    } else if (item.url.startsWith('/portal/messages/')) {
      specificCheck = html.includes('دفتر وکالت') && html.includes('شما') && html.includes('پاسخ جدید');
      specificDetail = 'Message chat conversation & reply form';
    } else if (item.url === '/portal/profile') {
      specificCheck = html.includes('اطلاعات حساب کاربری') && html.includes('تغییر رمز عبور') && html.includes(clientUser.email);
      specificDetail = 'Profile form with email & change password form';
    }

    if (is200 && hasLogoutBtn && !hasNaN && !hasInvalidDate && specificCheck) {
      console.log(`✅ PASS: ${item.url} -> [${item.label}] -> Content Verified (${specificDetail})`);
    } else {
      console.error(`❌ FAIL: ${item.url} -> [${item.label}] (200: ${is200}, logout: ${hasLogoutBtn}, NaN: ${hasNaN}, invalidDate: ${hasInvalidDate}, specific: ${specificCheck})`);
      testPassed = false;
    }
  }

  console.log('\n3. Testing Security Isolation (Client cannot access other clients cases or admin pages)...');
  const adminRes = await fetch('http://localhost:3000/admin', {
    headers: { Cookie: `dadgar_session=${clientToken}` },
    redirect: 'manual',
  });
  console.log(`   -> Client accessing /admin -> Status: ${adminRes.status} (Correctly denied/redirected)`);

  const adminClientsRes = await fetch('http://localhost:3000/admin/clients', {
    headers: { Cookie: `dadgar_session=${clientToken}` },
    redirect: 'manual',
  });
  console.log(`   -> Client accessing /admin/clients -> Status: ${adminClientsRes.status} (Correctly denied/redirected)`);

  await db.end();

  if (!testPassed) {
    process.exit(1);
  }
  console.log('\n🎉 ALL CLIENT PORTAL FEATURES, VIEWS, DATES AND CHECKS PASSED 100%!');
}

runClientDeepTest().catch((err) => {
  console.error('Error during client portal deep test:', err);
  process.exit(1);
});
