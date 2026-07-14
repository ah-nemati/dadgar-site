'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Lock, Menu, X } from 'lucide-react';
import Seal from './Seal';
import { FIRM } from '@/data/firm';

const NAV_ITEMS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره ما' },
  { href: '/practice-areas', label: 'حوزه‌های تخصصی' },
  { href: '/lawyers', label: 'وکلا' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="hidden md:block border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href={FIRM.phoneHref} className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors">
              <Phone size={14} aria-hidden="true" />
              <span>{FIRM.phone}</span>
            </a>
            <a href={`mailto:${FIRM.email}`} className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors" dir="ltr">
              <Mail size={14} aria-hidden="true" />
              <span>{FIRM.email}</span>
            </a>
          </div>
          <Link href="/client-login" className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors">
            <Lock size={14} aria-hidden="true" />
            <span>ورود موکلین</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Seal size={42} />
            <div className="text-right">
              <div className="font-display text-lg text-parchment leading-none">{FIRM.name}</div>
              <div className="text-xs text-gold-light mt-1">دفتر خدمات حقوقی</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-gold' : 'text-parchment/80 hover:text-gold-light'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-2.5 text-sm rounded-sm transition-colors"
            >
              درخواست مشاوره
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-parchment p-2"
              aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-ink-2 border-t border-white/10">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-3 text-sm font-medium rounded-sm text-right ${
                  isActive(item.href) ? 'text-gold bg-ink' : 'text-parchment/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/client-login"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-3 text-sm font-medium flex items-center gap-2 text-parchment/80"
            >
              <Lock size={14} aria-hidden="true" /> ورود موکلین
            </Link>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="bg-gold text-ink font-semibold mt-2 px-5 py-3 rounded-sm text-sm text-center"
            >
              درخواست مشاوره
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
