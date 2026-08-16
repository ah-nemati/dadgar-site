'use client';

import Image from 'next/image';
import Link from '@/components/NoPrefetchLink';
import { ArrowLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Pagination } from 'swiper/modules';
import { blogPostPath } from '@/lib/blog-slug';
import type { BlogPost } from '@/types/content';

import 'swiper/css';
import 'swiper/css/pagination';

export default function BlogSwiper({ posts }: { posts: BlogPost[] }) {
  return (
    <Swiper
      className="dadgar-swiper !overflow-visible pb-11"
      modules={[Pagination, Keyboard, A11y]}
      keyboard={{ enabled: true }}
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1.08}
      breakpoints={{
        700: { slidesPerView: 2.05, spaceBetween: 18 },
        1100: { slidesPerView: 3, spaceBetween: 20 },
      }}
    >
      {posts.map((post) => (
        <SwiperSlide key={post.slug} className="!h-auto">
          <Link href={blogPostPath(post.slug)} className="blue-article-card group flex h-full flex-col overflow-hidden">
            {post.imageUrl ? (
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 31vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                />
              </div>
            ) : (
              <div className="aspect-[16/10] bg-[linear-gradient(135deg,#dff4ff,#f5fbff)]" />
            )}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-primary">{post.category}</span>
                <span className="text-muted-foreground">{post.readTime}</span>
              </div>
              <h3 className="mt-4 text-lg font-extrabold leading-8 text-foreground group-hover:text-primary">{post.title}</h3>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <ArrowLeft size={15} className="text-primary transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
