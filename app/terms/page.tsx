import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import { getFirm } from '@/lib/content/firm';

export const metadata: Metadata = {
  title: 'شرایط استفاده',
  description: 'شرایط استفاده از وب‌سایت، محتوای حقوقی و خدمات آنلاین دفتر وکالت.',
  alternates: { canonical: '/terms' },
};

export default async function TermsPage() {
  const firm = await getFirm();
  return (
    <main className="bg-parchment">
      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">شرایط استفاده</h1>
        <p className="text-sm text-muted-foreground mb-10">آخرین به‌روزرسانی: مرداد ۱۴۰۵</p>
        <div className="prose-legal space-y-7">
          <section><h2>ماهیت محتوای سایت</h2><p>مطالب عمومی سایت برای اطلاع‌رسانی و آموزش حقوقی تهیه می‌شوند و به‌تنهایی جایگزین بررسی اسناد و مشاوره حقوقی متناسب با شرایط یک پرونده نیستند.</p></section>
          <section><h2>تشکیل رابطه وکیل و موکل</h2><p>ارسال فرم، ثبت‌نام، رزرو نوبت یا ارسال پیام به‌تنهایی به معنای قبول وکالت یا ایجاد رابطه وکیل و موکل نیست. پذیرش پرونده و حدود خدمات پس از بررسی و توافق مشخص می‌شود.</p></section>
          <section><h2>دقت اطلاعات</h2><p>تلاش می‌شود محتوای حقوقی با منابع معتبر و تاریخ به‌روزرسانی روشن منتشر شود، اما قوانین، رویه‌ها و شرایط پرونده‌ها ممکن است تغییر کنند. برای تصمیم حقوقی مهم باید وضعیت روز و اسناد همان پرونده بررسی شود.</p></section>
          <section><h2>حساب کاربری و اسناد</h2><p>کاربر مسئول حفظ دسترسی حساب خود و صحت اطلاعاتی است که ارسال می‌کند. از بارگذاری فایل‌های نامرتبط، مخرب یا اطلاعات اشخاص ثالث بدون مجوز قانونی خودداری شود.</p></section>
          <section><h2>رزرو و هزینه خدمات</h2><p>ثبت زمان پیشنهادی نوبت، تأیید نهایی نوبت محسوب نمی‌شود مگر این‌که دفتر آن را تأیید کند. هزینه و دامنه هر خدمت بر اساس نوع درخواست و توافق نهایی تعیین می‌شود.</p></section>
          <section><h2>ارتباط</h2><p>برای پرسش درباره شرایط استفاده می‌توانید از صفحه <Link href="/contact" className="underline">تماس با ما</Link> یا شماره <Link href={firm.phoneHref} className="underline">{firm.phone}</Link> استفاده کنید.</p></section>
        </div>
      </section>
    </main>
  );
}
