import type { Metadata } from 'next';
import Link from '@/components/NoPrefetchLink';
import { getFirm } from '@/lib/content/firm';

export const metadata: Metadata = {
  title: 'حریم خصوصی',
  description: 'نحوه دریافت، استفاده و نگهداری اطلاعات کاربران و موکلان در وب‌سایت دفتر وکالت.',
  alternates: { canonical: '/privacy' },
};

export default async function PrivacyPage() {
  const firm = await getFirm();
  return (
    <main className="bg-parchment">
      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">حریم خصوصی</h1>
        <p className="text-sm text-muted-foreground mb-10">آخرین به‌روزرسانی: مرداد ۱۴۰۵</p>
        <div className="prose-legal space-y-7">
          <section><h2>چه اطلاعاتی دریافت می‌شود؟</h2><p>اطلاعاتی که خودتان در فرم‌های مشاوره، حساب کاربری، پرونده، نوبت یا مکاتبات وارد می‌کنید؛ مانند نام، شماره تماس، ایمیل، شرح موضوع، اسناد ارسالی و اطلاعات مرتبط با پرونده.</p></section>
          <section><h2>هدف استفاده از اطلاعات</h2><p>اطلاعات برای پاسخ‌گویی به درخواست مشاوره، مدیریت ارتباط با موکل، ارائه خدمات حقوقی، مدیریت نوبت و پرونده، حفظ امنیت حساب و انجام الزامات اداری مرتبط استفاده می‌شود.</p></section>
          <section><h2>محرمانگی و دسترسی</h2><p>دسترسی به اطلاعات پرونده و مکاتبات به کاربران مجاز محدود می‌شود. با این حال، ارسال اطلاعات در اینترنت همیشه بدون ریسک نیست؛ اطلاعات بسیار حساس را فقط از مسیرهای مورد تأیید دفتر ارسال کنید.</p></section>
          <section><h2>نگهداری و حذف</h2><p>اطلاعات تا زمانی که برای ارائه خدمت، پیگیری پرونده، امنیت یا تکالیف قانونی و حرفه‌ای لازم باشد نگهداری می‌شود. درخواست‌های مربوط به اصلاح یا حذف اطلاعات، در حدود الزامات قانونی و حرفه‌ای، از طریق اطلاعات تماس دفتر قابل پیگیری است.</p></section>
          <section><h2>سرویس‌های فنی</h2><p>وب‌سایت ممکن است برای میزبانی، پایگاه داده و نگهداری فایل‌ها از ارائه‌دهندگان زیرساخت استفاده کند. در صورت فعال‌شدن ابزارهای تحلیلی یا سرویس‌های غیرضروری جدید، این صفحه باید متناسب با آن به‌روزرسانی شود.</p></section>
          <section><h2>تماس درباره حریم خصوصی</h2><p>برای پیگیری موضوعات مرتبط با اطلاعات شخصی می‌توانید از طریق <Link href={`mailto:${firm.email}`} className="underline">{firm.email}</Link> یا شماره <Link href={firm.phoneHref} className="underline">{firm.phone}</Link> با دفتر تماس بگیرید.</p></section>
        </div>
      </section>
    </main>
  );
}
