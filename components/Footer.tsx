import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import Seal from './Seal';
import PatternStrip from './PatternStrip';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';

export default async function Footer() {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();

  return (
    <footer className="bg-ink">
      <PatternStrip id="pattern-footer-top" color="#B08D45" />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Seal size={40} />
              <span className="font-display text-lg text-parchment">{firm.name}</span>
            </div>
            <p className="text-sm leading-7 text-parchment/75">{firm.tagline}</p>
          </div>

          <div>
            <h4 className="text-parchment font-semibold mb-4">دسترسی سریع</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/about" className="text-parchment/70 hover:text-gold-light transition-colors">درباره ما</Link></li>
              <li><Link href="/lawyers" className="text-parchment/70 hover:text-gold-light transition-colors">معرفی وکیل</Link></li>
              <li><Link href="/blog" className="text-parchment/70 hover:text-gold-light transition-colors">وبلاگ حقوقی</Link></li>
              <li><Link href="/faq" className="text-parchment/70 hover:text-gold-light transition-colors">سوالات متداول</Link></li>
              <li><Link href="/login" className="text-parchment/70 hover:text-gold-light transition-colors">ورود کاربران</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-parchment font-semibold mb-4">حوزه‌های تخصصی</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {practiceAreas.slice(0, 5).map((area) => (
                <li key={area.slug}>
                  <Link href={`/practice-areas/${area.slug}`} className="text-parchment/70 hover:text-gold-light transition-colors">
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-parchment font-semibold mb-4">اطلاعات تماس</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2 text-parchment/70">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{firm.address}</span>
              </li>
              <li className="flex items-center gap-2 text-parchment/70">
                <Clock size={16} className="shrink-0" aria-hidden="true" />
                <span>{firm.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-parchment/60">
          <span>© ۱۴۰۵ {firm.name}. تمامی حقوق محفوظ است.</span>
          <span>این وب‌سایت جنبه اطلاع‌رسانی عمومی دارد و جایگزین مشاوره حقوقی اختصاصی نیست.</span>
        </div>
      </div>
    </footer>
  );
}
