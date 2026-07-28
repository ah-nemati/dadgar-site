import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Seal from '@/components/Seal';
import ContactForm from '@/components/ContactForm';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export const metadata: Metadata = {
  title: 'تماس با ما',
  description: 'درخواست مشاوره حقوقی از مجید سواری، وکیل پایه یک دادگستری در اهواز. فرم تماس، شماره تماس و آدرس دفتر.',
  keywords: ['تماس با وکیل اهواز', 'مشاوره حقوقی اهواز', 'آدرس دفتر وکالت اهواز', 'رزرو وقت مشاوره حقوقی'],
};

export default async function ContactPage() {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();

  return (
    <>
      <PageHero eyebrow="تماس با ما" title="درخواست مشاوره حقوقی" description="فرم زیر را تکمیل کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند." />
      <section className="bg-parchment">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <ContactForm practiceAreas={practiceAreas} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-ink rounded-sm p-8 lg:sticky lg:top-28">
              <Seal size={40} tone="cream" />
              <h3 className="text-parchment font-bold text-lg mt-6 mb-6">راه‌های ارتباطی</h3>
              <ul className="flex flex-col gap-5">
                <li className="flex items-start gap-3">
                  <Phone size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="block text-parchment text-sm" dir="ltr" style={{ textAlign: 'right' }}>{firm.phone}</span>
                    <span className="block text-xs mt-0.5 text-parchment/60">تلفن دفتر</span>
                  </span>
                </li>
                {firm.phone2 && (
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      <span className="block text-parchment text-sm" dir="ltr" style={{ textAlign: 'right' }}>{firm.phone2}</span>
                      <span className="block text-xs mt-0.5 text-parchment/60">تلفن همراه</span>
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <Mail size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="block text-parchment text-sm" dir="ltr" style={{ textAlign: 'right' }}>{firm.email}</span>
                    <span className="block text-xs mt-0.5 text-parchment/60">ایمیل</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="block text-parchment text-sm leading-6">{firm.address}</span>
                    <span className="block text-xs mt-0.5 text-parchment/60">آدرس دفتر</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="block text-parchment text-sm">{firm.hours}</span>
                    <span className="block text-xs mt-0.5 text-parchment/60">ساعات کاری</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
