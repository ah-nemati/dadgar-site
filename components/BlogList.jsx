'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BlogList({ posts }) {
  const [activeCategory, setActiveCategory] = useState('همه');
  const categories = ['همه', ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === 'همه' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm px-4 py-2 rounded-sm border transition-colors ${
              activeCategory === cat
                ? 'bg-ink text-parchment border-ink'
                : 'border-sand text-muted hover:border-gold hover:text-charcoal'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-sm">مطلبی در این دسته یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-card border border-sand hover:border-gold hover:-translate-y-0.5 transition-all rounded-sm p-6 text-right flex flex-col items-start"
            >
              <span className="text-xs font-semibold text-teal mb-3">{post.category}</span>
              <h3 className="text-base font-bold text-charcoal mb-3 leading-7">{post.title}</h3>
              <p className="text-sm text-muted leading-7 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted mt-auto">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
