import { Save, Building2, MapPin, Phone, Globe2 } from "lucide-react";
import AdminHeader from "../AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { getFirm } from "@/lib/content/firm";
import { requireAdmin } from "@/lib/session";
import { saveFirmAction } from "./actions";
import OfficeMap from "@/components/OfficeMap";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ saved?: string; error?: string }>;

const ERROR_TEXT: Record<string, string> = {
  required: "نام دفتر، تلفن، آدرس و دامنه اصلی باید کامل باشند.",
  url: "آدرس اصلی سایت معتبر نیست.",
  coordinates:
    "مختصات جغرافیایی معتبر نیست. عرض جغرافیایی بین ۹۰- تا ۹۰ و طول جغرافیایی بین ۱۸۰- تا ۱۸۰ باشد.",
  mapUrl: "یکی از لینک‌های اینستاگرام یا نقشه معتبر نیست.",
};

export default async function AdminSitePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const [firm, query] = await Promise.all([getFirm(), searchParams]);

  return (
    <div className="max-w-5xl">
      <AdminHeader
        title="تنظیمات دفتر و سایت"
        description="اطلاعات اصلی دفتر، نقشه و داده‌های محلی که در سایت و Schema گوگل استفاده می‌شوند."
      />
      {query.saved && <Alert className="mb-6">اطلاعات دفتر ذخیره شد.</Alert>}
      {query.error && (
        <Alert variant="destructive" className="mb-6">
          {ERROR_TEXT[query.error] ?? "اطلاعات واردشده معتبر نیست."}
        </Alert>
      )}

      <form action={saveFirmAction} className="space-y-6">
        <section className="dashboard-card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Building2 size={18} /> هویت دفتر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="نام کامل دفتر"
              name="name"
              defaultValue={firm.name}
              required
            />
            <Field
              label="نام کوتاه / برند"
              name="shortName"
              defaultValue={firm.shortName}
              required
            />
            <div className="md:col-span-2">
              <Field label="شعار" name="tagline" defaultValue={firm.tagline} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description">توضیح اصلی سایت</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={firm.description}
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <Field
                label="عنوان/عضویت حرفه‌ای"
                name="established"
                defaultValue={firm.established}
              />
            </div>
          </div>
        </section>

        <section className="dashboard-card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Phone size={18} /> راه‌های ارتباطی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="شماره اصلی نمایشی"
              name="phone"
              defaultValue={firm.phone}
              required
            />
            <Field
              label="لینک تماس اصلی"
              name="phoneHref"
              defaultValue={firm.phoneHref}
              dir="ltr"
              required
            />
            <Field
              label="شماره دوم"
              name="phone2"
              defaultValue={firm.phone2 ?? ""}
            />
            <Field
              label="لینک تماس دوم"
              name="phone2Href"
              defaultValue={firm.phone2Href ?? ""}
              dir="ltr"
            />
            <Field
              label="ایمیل"
              name="email"
              type="email"
              defaultValue={firm.email}
              dir="ltr"
            />
            <Field
              label="اینستاگرام"
              name="instagramUrl"
              defaultValue={firm.instagramUrl ?? ""}
              dir="ltr"
            />
          </div>
        </section>

        <section className="dashboard-card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <MapPin size={18} /> آدرس، نقشه و SEO محلی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Field
                label="آدرس کامل"
                name="address"
                defaultValue={firm.address}
                required
              />
            </div>
            <Field label="شهر" name="city" defaultValue={firm.city ?? " "} />
            <Field
              label="استان"
              name="region"
              defaultValue={firm.region ?? "خوزستان"}
            />
            <Field
              label="کد کشور"
              name="countryCode"
              defaultValue={firm.countryCode ?? "IR"}
              dir="ltr"
            />
            <Field
              label="کد پستی (اختیاری)"
              name="postalCode"
              defaultValue={firm.postalCode ?? ""}
              dir="ltr"
            />
            <Field
              label="ساعات کاری نمایشی"
              name="hours"
              defaultValue={firm.hours}
            />
            <div className="md:col-span-2">
              <Field
                label="لینک صفحه دفتر در Google Maps (اختیاری)"
                name="googleMapsUrl"
                defaultValue={firm.googleMapsUrl ?? ""}
                dir="ltr"
              />
            </div>
            <div className="md:col-span-2">
              <Field
                label="لینک Embed گوگل‌مپ (اختیاری)"
                name="googleMapsEmbedUrl"
                defaultValue={firm.googleMapsEmbedUrl ?? ""}
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="latitude">عرض جغرافیایی Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                min="-90"
                max="90"
                defaultValue={firm.latitude ?? ""}
                dir="ltr"
                className="mt-2"
                placeholder="مثلاً 31.3183"
              />
            </div>
            <div>
              <Label htmlFor="longitude">طول جغرافیایی Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                min="-180"
                max="180"
                defaultValue={firm.longitude ?? ""}
                dir="ltr"
                className="mt-2"
                placeholder="مثلاً 48.6706"
              />
            </div>
          </div>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            اگر لینک Embed یا مختصات را وارد نکنید، نقشه با استفاده از متن آدرس
            ساخته می‌شود. برای دقیق‌ترین نتیجه، لینک Google Maps و مختصات همان
            مکان را ثبت کنید.
          </p>
        </section>

        <section className="dashboard-card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Globe2 size={18} /> پیش‌نمایش نقشه دفتر
          </h2>
          <OfficeMap firm={firm} compact />
        </section>

        <section className="dashboard-card p-6">
          <h2 className="font-bold flex items-center gap-2 mb-5">
            <Globe2 size={18} /> دامنه
          </h2>
          <Field
            label="آدرس اصلی سایت"
            name="url"
            defaultValue={firm.url}
            dir="ltr"
            required
          />
          <p className="mt-2 text-xs text-muted-foreground">
            این آدرس در canonical، sitemap و Schema استفاده می‌شود؛ با احتیاط
            تغییرش دهید.
          </p>
        </section>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            <Save size={17} /> ذخیره تنظیمات
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  dir,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        dir={dir}
        className="mt-2"
      />
    </div>
  );
}
