import { BookOpen, CirclePlus, Scale, Trash2, Users } from 'lucide-react';
import AdminHeader from '../AdminHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { requireAdmin } from '@/lib/session';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { getLawyers } from '@/lib/content/lawyers';
import { getFaqs } from '@/lib/content/faqs';
import { getServiceFees } from '@/lib/content/fees';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';
import {
  createFaqAction,
  createFeeAction,
  createLawyerAction,
  createPracticeAreaAction,
  deleteFaqAction,
  deleteFeeAction,
  deleteLawyerAction,
  deletePracticeAreaAction,
  updateFaqAction,
  updateFeeAction,
  updateLawyerAction,
  updatePracticeAreaAction,
} from './actions';

export const dynamic = 'force-dynamic';
type SearchParams = Promise<{ saved?: string; created?: string; deleted?: string; error?: string }>;

export default async function AdminContentPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const [areas, lawyers, faqs, fees, query] = await Promise.all([
    getPracticeAreas(), getLawyers(), getFaqs(), getServiceFees(), searchParams,
  ]);

  return (
    <div className="max-w-6xl">
      <AdminHeader title="مدیریت محتوای سایت" description="حوزه‌های تخصصی، وکلا، سوالات متداول و تعرفه‌ها را بدون ویرایش کد مدیریت کنید." />
      {(query.saved || query.created || query.deleted) && <Alert className="mb-6">تغییرات ذخیره شد و صفحات عمومی برای بروزرسانی علامت‌گذاری شدند.</Alert>}
      {query.error && <Alert variant="destructive" className="mb-6">اطلاعات فرم کامل نیست یا نامک تکراری است.</Alert>}

      <Section title="حوزه‌های تخصصی" icon={Scale} count={areas.length}>
        <div className="space-y-4">
          {areas.map((area) => (
            <details key={area.slug} className="rounded-lg border border-border bg-card" open={false}>
              <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4"><span className="font-bold">{area.title}</span><span className="text-xs text-muted-foreground" dir="ltr">/{area.slug}</span></summary>
              <div className="border-t border-border p-5">
                <form action={updatePracticeAreaAction.bind(null, area.slug)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="عنوان" name="title" defaultValue={area.title} required />
                    <Field label="نامک انگلیسی" name="slug" defaultValue={area.slug} dir="ltr" required />
                    <div><Label htmlFor={`icon-${area.slug}`}>آیکن</Label><select id={`icon-${area.slug}`} name="icon" defaultValue={area.icon} className="mt-2 flex h-11 w-full rounded-sm border border-input bg-card px-4 text-sm">{Object.keys(PRACTICE_AREA_ICONS).map((name) => <option key={name}>{name}</option>)}</select></div>
                  </div>
                  <Field label="توضیح کوتاه" name="shortDesc" defaultValue={area.shortDesc} />
                  <Area label="توضیح کامل" name="longDesc" defaultValue={area.longDesc} rows={4} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان SEO" name="seoTitle" defaultValue={area.seoTitle ?? ''}/><Area label="توضیح متا" name="seoDescription" defaultValue={area.seoDescription ?? ''} rows={3}/></div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Area label="خدمات — هر مورد یک خط" name="topics" defaultValue={area.topics.join('\n')} rows={8} />
                    <Area label="مدارک — هر مورد یک خط" name="documents" defaultValue={area.documents.join('\n')} rows={8} />
                    <Area label="آمادگی — هر مورد یک خط" name="preparation" defaultValue={area.preparation.join('\n')} rows={8} />
                  </div>
                  <div className="flex flex-wrap justify-between gap-3"><Button type="submit">ذخیره حوزه</Button><Button type="submit" formAction={deletePracticeAreaAction.bind(null, area.slug)} variant="destructive"><Trash2 size={16}/> حذف</Button></div>
                </form>
              </div>
            </details>
          ))}
          <CreateArea />
        </div>
      </Section>

      <Section title="وکلا و پروفایل‌ها" icon={Users} count={lawyers.length}>
        <div className="space-y-4">
          {lawyers.map((lawyer) => (
            <details key={lawyer.slug} className="rounded-lg border border-border bg-card">
              <summary className="cursor-pointer list-none p-5 flex justify-between gap-4"><span className="font-bold">{lawyer.name}</span><span className="text-xs text-muted-foreground">{lawyer.role}</span></summary>
              <div className="border-t border-border p-5">
                <form action={updateLawyerAction.bind(null, lawyer.slug)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Field label="نام" name="name" defaultValue={lawyer.name} required/><Field label="نامک" name="slug" defaultValue={lawyer.slug} dir="ltr" required/><Field label="حروف آواتار" name="initials" defaultValue={lawyer.initials}/></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Field label="سمت" name="role" defaultValue={lawyer.role}/><Field label="شماره پروانه" name="licenseNumber" defaultValue={lawyer.licenseNumber}/><Field label="سابقه/عضویت" name="experience" defaultValue={lawyer.experience}/></div>
                  <Area label="معرفی" name="bio" defaultValue={lawyer.bio} rows={5}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان SEO" name="seoTitle" defaultValue={lawyer.seoTitle ?? ''}/><Area label="توضیح متا" name="seoDescription" defaultValue={lawyer.seoDescription ?? ''} rows={3}/></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Area label="تحصیلات — هر مورد یک خط" name="education" defaultValue={lawyer.education.join('\n')} rows={5}/><Area label="نامک حوزه‌های تخصصی — هر مورد یک خط" name="specialties" defaultValue={lawyer.specialties.join('\n')} rows={5}/></div>
                  <div className="flex justify-between gap-3"><Button type="submit">ذخیره پروفایل</Button><Button type="submit" formAction={deleteLawyerAction.bind(null, lawyer.slug)} variant="destructive"><Trash2 size={16}/> حذف</Button></div>
                </form>
              </div>
            </details>
          ))}
          <CreateLawyer areas={areas.map((x) => x.slug)} />
        </div>
      </Section>

      <Section title="سوالات متداول" icon={BookOpen} count={faqs.length}>
        <div className="space-y-4">
          {faqs.map((item, index) => <form key={`${item.q}-${index}`} action={updateFaqAction.bind(null, index)} className="rounded-lg border border-border bg-card p-5 space-y-4"><Field label={`سوال ${index + 1}`} name="q" defaultValue={item.q} required/><Area label="پاسخ" name="a" defaultValue={item.a} rows={4}/><div className="flex justify-between"><Button type="submit">ذخیره</Button><Button type="submit" formAction={deleteFaqAction.bind(null, index)} variant="destructive"><Trash2 size={16}/> حذف</Button></div></form>)}
          <form action={createFaqAction} className="rounded-lg border border-dashed border-primary/40 p-5 space-y-4"><h3 className="font-bold flex items-center gap-2"><CirclePlus size={17}/> افزودن سوال</h3><Field label="سوال" name="q" defaultValue="" required/><Area label="پاسخ" name="a" defaultValue="" rows={4}/><Button type="submit">افزودن</Button></form>
        </div>
      </Section>

      <Section title="تعرفه‌ها و خدمات" icon={Scale} count={fees.length}>
        <div className="space-y-4">
          {fees.map((item, index) => <form key={`${item.title}-${index}`} action={updateFeeAction.bind(null, index)} className="rounded-lg border border-border bg-card p-5 space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان خدمت" name="title" defaultValue={item.title} required/><Field label="عبارت هزینه" name="feeLabel" defaultValue={item.feeLabel} required/></div><Area label="توضیح" name="description" defaultValue={item.description} rows={3}/><Area label="موارد شامل خدمت — هر مورد یک خط" name="includes" defaultValue={item.includes.join('\n')} rows={5}/><div className="flex justify-between"><Button type="submit">ذخیره</Button><Button type="submit" formAction={deleteFeeAction.bind(null, index)} variant="destructive"><Trash2 size={16}/> حذف</Button></div></form>)}
          <form action={createFeeAction} className="rounded-lg border border-dashed border-primary/40 p-5 space-y-4"><h3 className="font-bold flex items-center gap-2"><CirclePlus size={17}/> افزودن خدمت</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان" name="title" defaultValue="" required/><Field label="عبارت هزینه" name="feeLabel" defaultValue="" required/></div><Area label="توضیح" name="description" defaultValue="" rows={3}/><Area label="موارد شامل خدمت" name="includes" defaultValue="" rows={4}/><Button type="submit">افزودن</Button></form>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, count, children }: { title: string; icon: typeof Scale; count: number; children: React.ReactNode }) { return <section className="dashboard-card p-5 md:p-6 mb-6"><div className="flex items-center justify-between gap-4 mb-5"><h2 className="font-bold flex items-center gap-2"><Icon size={19}/>{title}</h2><span className="text-xs text-muted-foreground">{count} مورد</span></div>{children}</section>; }
function Field({ label, name, defaultValue, required, dir }: { label: string; name: string; defaultValue: string; required?: boolean; dir?: 'ltr'|'rtl' }) { return <div><Label>{label}</Label><Input name={name} defaultValue={defaultValue} required={required} dir={dir} className="mt-2"/></div>; }
function Area({ label, name, defaultValue, rows }: { label: string; name: string; defaultValue: string; rows: number }) { return <div><Label>{label}</Label><Textarea name={name} defaultValue={defaultValue} rows={rows} className="mt-2"/></div>; }
function CreateArea() { return <details className="rounded-lg border border-dashed border-primary/40"><summary className="cursor-pointer list-none p-5 font-bold flex items-center gap-2"><CirclePlus size={17}/> افزودن حوزه تخصصی</summary><form action={createPracticeAreaAction} className="border-t border-border p-5 space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Field label="عنوان" name="title" defaultValue="" required/><Field label="نامک انگلیسی" name="slug" defaultValue="" dir="ltr" required/><div><Label>آیکن</Label><select name="icon" defaultValue="FileText" className="mt-2 flex h-11 w-full rounded-sm border border-input bg-card px-4 text-sm">{Object.keys(PRACTICE_AREA_ICONS).map((name) => <option key={name}>{name}</option>)}</select></div></div><Field label="توضیح کوتاه" name="shortDesc" defaultValue=""/><Area label="توضیح کامل" name="longDesc" defaultValue="" rows={4}/><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان SEO" name="seoTitle" defaultValue=""/><Area label="توضیح متا" name="seoDescription" defaultValue="" rows={3}/></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><Area label="خدمات" name="topics" defaultValue="" rows={6}/><Area label="مدارک" name="documents" defaultValue="" rows={6}/><Area label="آمادگی" name="preparation" defaultValue="" rows={6}/></div><Button type="submit">افزودن حوزه</Button></form></details>; }
function CreateLawyer({ areas }: { areas: string[] }) { return <details className="rounded-lg border border-dashed border-primary/40"><summary className="cursor-pointer list-none p-5 font-bold flex items-center gap-2"><CirclePlus size={17}/> افزودن وکیل</summary><form action={createLawyerAction} className="border-t border-border p-5 space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Field label="نام" name="name" defaultValue="" required/><Field label="نامک" name="slug" defaultValue="" dir="ltr" required/><Field label="حروف آواتار" name="initials" defaultValue=""/></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Field label="سمت" name="role" defaultValue="وکیل پایه یک دادگستری"/><Field label="شماره پروانه" name="licenseNumber" defaultValue=""/><Field label="سابقه/عضویت" name="experience" defaultValue=""/></div><Area label="معرفی" name="bio" defaultValue="" rows={5}/><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="عنوان SEO" name="seoTitle" defaultValue=""/><Area label="توضیح متا" name="seoDescription" defaultValue="" rows={3}/></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Area label="تحصیلات" name="education" defaultValue="" rows={5}/><Area label={`نامک حوزه‌ها — موجود: ${areas.join(', ')}`} name="specialties" defaultValue="" rows={5}/></div><Button type="submit">افزودن وکیل</Button></form></details>; }
