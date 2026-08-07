"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { BlogPost } from "@/types/content";
import Image from "next/image";
import { blogPostPath } from "@/lib/blog-slug";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("همه");
  const categories = [
    "همه",
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];
  const filtered =
    activeCategory === "همه"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              activeCategory === category
                ? "bg-ink text-parchment border-ink"
                : "bg-card border-border text-muted-foreground hover:border-gold hover:text-foreground"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          مطلبی در این دسته یافت نشد.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <a
              key={post.slug}
              href={blogPostPath(post.slug)}
              className="bg-card border border-border hover:border-gold hover:-translate-y-1 hover:shadow-lg transition-all rounded-lg text-right overflow-hidden flex flex-col"
            >
              {post.imageUrl ? (
                <div className="blog-cover relative overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="blog-cover bg-gradient-to-br from-ink to-ink-2 flex items-center justify-center">
                  <span className="font-display text-parchment/70 text-lg">
                    یادداشت حقوقی
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-semibold text-teal">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-primary">
                      <Star size={13} fill="currentColor" aria-hidden="true" />{" "}
                      ویژه
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-foreground mb-3 leading-7">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-7 mb-5 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
