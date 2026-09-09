import { scrypt } from "node:crypto";
import postgres from "postgres";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");

const sql = postgres(connectionString, {
  ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  max: 1,
  prepare: false,
});

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_MAXMEM = 32 * 1024 * 1024;

function validateBootstrapPassword(name, value) {
  if (!value) return "";
  if (
    value.length < 12 ||
    value.length > 128 ||
    value.startsWith("replace-with-")
  ) {
    throw new Error(
      `${name} must contain 12 to 128 non-placeholder characters.`,
    );
  }
  return value;
}

function deriveScrypt(password, salt) {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      32,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: SCRYPT_MAXMEM },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await deriveScrypt(password, salt);
  const encode = (value) => Buffer.from(value).toString("base64url");
  return `scrypt-v1$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${encode(salt)}$${encode(hash)}`;
}

async function upsertBootstrapUser({ email, password, name, phone, role }) {
  const normalizedEmail = email.trim().toLowerCase();
  const [existing] = await sql`
    select id, password_hash, status
    from users where lower(email) = ${normalizedEmail} limit 1
  `;
  const passwordHash = password ? await hashPassword(password) : null;

  if (existing) {
    const shouldSetInitialPassword =
      passwordHash &&
      (existing.status === "PASSWORD_RESET_REQUIRED" ||
        existing.password_hash === "!RESET_REQUIRED!");

    if (shouldSetInitialPassword) {
      await sql`
        update users
        set name = ${name}, phone = ${phone}, role = ${role},
            password_hash = ${passwordHash}, password_changed_at = now(),
            status = 'ACTIVE'
        where id = ${existing.id}
      `;
    } else {
      await sql`
        update users set name = ${name}, phone = ${phone}, role = ${role}
        where id = ${existing.id}
      `;
    }
    return existing.id;
  }

  const id = crypto.randomUUID();
  await sql`
    insert into users (
      id, email, password_hash, name, phone, role, status, password_changed_at
    ) values (
      ${id}, ${normalizedEmail}, ${passwordHash ?? "!RESET_REQUIRED!"},
      ${name}, ${phone}, ${role},
      ${passwordHash ? "ACTIVE" : "PASSWORD_RESET_REQUIRED"},
      ${passwordHash ? new Date() : null}
    )
  `;
  return id;
}

const posts = [
  {
    slug: "راهنمای-اولیه-مشاوره-حقوقی",
    title: "برای جلسه نخست مشاوره حقوقی چه مدارکی همراه داشته باشیم؟",
    category: "راهنمای حقوقی",
    excerpt:
      "چک‌لیستی کوتاه برای آماده‌سازی مدارک، قراردادها و پرسش‌های جلسه مشاوره.",
    content:
      "برای استفاده بهتر از زمان جلسه، اصل یا تصویر خوانای قراردادها، مکاتبات، ابلاغیه‌ها و یک خط زمانی کوتاه از رویدادها را همراه داشته باشید. همچنین پرسش‌های اصلی خود را از قبل یادداشت کنید.",
  },
];

for (const post of posts) {
  await sql`
    insert into blog_posts (slug, title, category, excerpt, content, published, featured)
    values (${post.slug}, ${post.title}, ${post.category}, ${post.excerpt}, ${post.content}, true, true)
    on conflict (slug) do nothing
  `;
}

const lawyerPassword = validateBootstrapPassword(
  "INITIAL_LAWYER_PASSWORD",
  process.env.INITIAL_LAWYER_PASSWORD || "",
);
const lawyerId = await upsertBootstrapUser({
  email: process.env.INITIAL_LAWYER_EMAIL || "",
  password: lawyerPassword,
  name: " ",
  phone: process.env.INITIAL_LAWYER_PHONE || "",
  role: "LAWYER",
});

await sql`
  insert into lawyer_profiles (user_id, license_number, education)
  values (
    ${lawyerId},
    '2306',
    ${["کارشناسی ارشد حقوق خصوصی", "کارشناسی ارشد زبان و ادبیات عربی"]}
  )
  on conflict (user_id) do update
  set license_number = excluded.license_number,
      education = excluded.education
`;

if (process.env.INITIAL_ADMIN_EMAIL && process.env.INITIAL_ADMIN_PASSWORD) {
  const adminPassword = validateBootstrapPassword(
    "INITIAL_ADMIN_PASSWORD",
    process.env.INITIAL_ADMIN_PASSWORD,
  );
  await upsertBootstrapUser({
    email: process.env.INITIAL_ADMIN_EMAIL,
    password: adminPassword,
    name: process.env.INITIAL_ADMIN_NAME || "مدیر سایت",
    phone: process.env.INITIAL_ADMIN_PHONE || "09120000000",
    role: "ADMIN",
  });
} else {
  console.warn(
    "Initial admin was not created: set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD before running db:seed.",
  );
}

console.log("Seed completed.");
await sql.end();
