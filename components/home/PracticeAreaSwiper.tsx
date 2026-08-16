'use client';

import Link from '@/components/NoPrefetchLink';
import { ArrowLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Pagination } from 'swiper/modules';
import type { PracticeArea } from '@/types/content';
import { PRACTICE_AREA_ICONS } from '@/lib/icons';

import 'swiper/css';
import 'swiper/css/pagination';

export default function PracticeAreaSwiper({ areas }: { areas: PracticeArea[] }) {
  return (
    <Swiper
      className="dadgar-swiper !overflow-visible pb-11"
      modules={[Pagination, Keyboard, A11y]}
      keyboard={{ enabled: true }}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1.08}
      breakpoints={{
        640: { slidesPerView: 2.05, spaceBetween: 18 },
        1024: { slidesPerView: 3, spaceBetween: 20 },
      }}
    >
      {areas.map((area, index) => {
        const Icon = PRACTICE_AREA_ICONS[area.icon];
        return (
          <SwiperSlide key={area.slug} className="!h-auto">
            <Link href={`/practice-areas/${area.slug}`} className="blue-service-card group flex h-full flex-col p-6 md:p-7">
              <div className="flex items-start justify-between gap-5">
                <span className="blue-icon-box"><Icon size={21} aria-hidden="true" /></span>
                <span className="blue-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 text-lg font-extrabold text-foreground">{area.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{area.shortDesc}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                جزئیات خدمت <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
