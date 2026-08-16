import { Search, Save, ShieldCheck, Gauge, MapPinned, FileSearch } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { getSeoSettings } from '@/lib/content/seo-settings';
import { requireAdmin } from '@/lib/session';
import { saveSeoSettingsAction } from './actions';

export const dynamic = 'force-dynamic';
type SearchParams = Promise<{ saved?: string; error?: string }>;

export default async function AdminSeoPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const [seo, query] = await Promise.all([getSeoSettings(), searchParams]);
  return (
    <div className="max-w-5xl">
      <AdminHeader title="SEO و دیده‌شدن در گوگل" description="تنظیمات پایه متادیتا، Search Console و چک‌لیست فنی سایت." />
      {query.saved && <Alert className="mb-6">تنظیمات SEO ذخیره شد.</Alert>}
      {query.error && <Alert variant="destructive" className="mb-6">عنوان و توضیح پیش‌فرض الزامی است.</Alert>}

      <form action={saveSeoSettingsAction} className="dashboard-card p-6 space-y-5">
        <h2 className="font-bold flex items-center gap-2"><Search size={18} /> متادیتای عمومی</h2>
        <div><Label htmlFor="defaultTitle">عنوان پیش‌فرض</Label><Input id="defaultTitle" name="defaultTitle" defaultValue={seo.defaultTitle} className="mt-2" /></div>
        <div><Label htmlFor="titleTemplate">قالب عنوان صفحات</Label><Input id="titleTemplate" name="titleTemplate" defaultValue={seo.titleTemplate} dir="ltr" className="mt-2" /><p className="text-xs text-muted-foreground mt-2">برای محل عنوان صفحه از %s استفاده کنید.</p></div>
        <div><Label htmlFor="defaultDescription">توضیح پیش‌فرض</Label><Textarea id="defaultDescription" name="defaultDescription" defaultValue={seo.defaultDescription} rows={4} className="mt-2" /></div>
        <div><Label htmlFor="keywords">کلیدواژه‌های اصلی</Label><Textarea id="keywords" name="keywords" defaultValue={seo.keywords.join('\n')} rows={7} className="mt-2" /><p className="text-xs text-muted-foreground mt-2">هر عبارت در یک خط. این بخش برای مدیریت موضوعات هدف است؛ تکرار افراطی کلیدواژه در متن توصیه نمی‌شود.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div><Label htmlFor="googleSiteVerification">کد تأیید Google Search Console</Label><Input id="googleSiteVerification" name="googleSiteVerification" defaultValue={seo.googleSiteVerification} dir="ltr" className="mt-2" /></div>
          <div><Label htmlFor="ogImage">تصویر پیش‌فرض شبکه‌های اجتماعی</Label><Input id="ogImage" name="ogImage" defaultValue={seo.ogImage} dir="ltr" className="mt-2" /></div>
        </div>
        <div className="flex justify-end"><Button type="submit"><Save size={17} /> ذخیره SEO</Button></div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <Check icon={FileSearch} title="ایندکس و Sitemap" text="robots.txt و sitemap.xml در پروژه وجود دارد و صفحات خصوصی از خزیدن منع شده‌اند. انتشار مقاله جدید باید sitemap را هم بازاعتبارسنجی کند." />
        <Check icon={MapPinned} title="Local SEO" text="نام، شماره، آدرس، ساعات کاری و شهر باید با Google Business Profile و سایر دایرکتوری‌ها کاملاً یکسان بماند." />
        <Check icon={Gauge} title="Core Web Vitals" text="LCP، INP و CLS را در Search Console و Lighthouse پیگیری کنید؛ تصاویر، فونت و اسکریپت‌های ثالث بیشترین ریسک را دارند." />
        <Check icon={ShieldCheck} title="اعتماد و محتوای حقوقی" text="برای هر مقاله نویسنده، تاریخ بازبینی، منبع قانونی و مسئولیت‌پذیری روشن اضافه شود؛ مخصوصاً چون موضوع حقوقی حساس است." />
      </div>
    </div>
  );
}

function Check({ icon: Icon, title, text }: { icon: typeof Search; title: string; text: string }) {
  return <section className="dashboard-card p-5"><div className="flex items-center gap-3"><span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent"><Icon size={19} /></span><h2 className="font-bold">{title}</h2></div><p className="text-sm text-muted-foreground leading-7 mt-4">{text}</p></section>;
}
