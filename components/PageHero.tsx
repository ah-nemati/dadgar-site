import Seal from './Seal';
import Eyebrow from './Eyebrow';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero__mark" aria-hidden="true"><Seal size={260} tone="cream" /></div>
      <div className="page-hero__inner mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative z-10">
          <Eyebrow dark>{eyebrow}</Eyebrow>
          <h1 className="page-hero__title">{title}</h1>
          {description && <p className="page-hero__description">{description}</p>}
        </div>
        <div className="hidden justify-self-end lg:block">
          <div className="w-40 border-t border-sky-200 pt-4 text-xs leading-7 text-sky-800/65">
            بررسی دقیق موضوع، شفافیت در مسیر و حفظ محرمانگی اطلاعات
          </div>
        </div>
      </div>
    </section>
  );
}
