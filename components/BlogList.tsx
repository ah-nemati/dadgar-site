'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Star } from 'lucide-react';
import type { BlogPost } from '@/types/content';
import Image from 'next/image';
import Link from '@/components/NoPrefetchLink';
import { blogPostPath } from '@/lib/blog-slug';
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BlogListProps {
  posts: BlogPost[];
}

const PAGE_SIZE = 6;

export default function BlogList({ posts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState('همه');
  const [page, setPage] = useState(1);
  const reduceMotion = useReducedMotion();

  const categories = useMemo(() => ['همه', ...Array.from(new Set(posts.map((post) => post.category)))], [posts]);
  const filtered = useMemo(
    () => (activeCategory === 'همه' ? posts : posts.filter((post) => post.category === activeCategory)),
    [activeCategory, posts],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  return (
    <>
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
            className={`relative shrink-0 overflow-hidden rounded-full border px-4 py-2 text-xs font-bold transition-all ${
              activeCategory === category
                ? 'border-primary bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(14,165,233,.18)]'
                : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-secondary hover:text-foreground'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="legal-card p-10 text-center text-sm text-muted-foreground">مطلبی در این دسته یافت نشد.</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${page}`}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((post) => (
              <Link key={post.slug} href={blogPostPath(post.slug)} className="blue-article-card group flex flex-col overflow-hidden">
                {post.imageUrl ? (
                  <div className="blog-cover relative overflow-hidden bg-secondary">
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="blog-cover flex items-end bg-[linear-gradient(135deg,#dff4ff,#f5fbff)] p-6">
                    <span className="text-sm font-bold text-primary">یادداشت حقوقی</span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-primary">{post.category}</span>
                    {post.featured && <span className="inline-flex items-center gap-1 text-primary"><Star size={12} fill="currentColor" /> ویژه</span>}
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold leading-8 text-foreground transition-colors group-hover:text-primary">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                    <span>{post.date} · {post.readTime}</span>
                    <ArrowLeft size={14} className="text-primary transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {pageCount > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem><PaginationPrevious disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} /></PaginationItem>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
              <PaginationItem key={item}>
                <PaginationButton active={item === page} onClick={() => setPage(item)}>{item.toLocaleString('fa-IR')}</PaginationButton>
              </PaginationItem>
            ))}
            <PaginationItem><PaginationNext disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} /></PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
