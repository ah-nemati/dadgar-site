'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Lock, Menu } from 'lucide-react';
import Seal from './Seal';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import type { Firm } from '@/types/content';

const NAV_ITEMS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره ما' },
  { href: '/practice-areas', label: 'حوزه‌های تخصصی' },
  { href: '/lawyers', label: 'وکیل' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/contact', label: 'تماس با ما' },
];

export default function Header({ firm }: { firm: Firm }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 bg-ink">
      <div className="hidden md:block border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href={firm.phoneHref} className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors">
              <Phone size={14} aria-hidden="true" />
              <span dir="ltr">{firm.phone}</span>
            </a>
            {firm.phone2 && (
              <a href={firm.phone2Href} className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors">
                <Phone size={14} aria-hidden="true" />
                <span dir="ltr">{firm.phone2}</span>
              </a>
            )}
            <a href={`mailto:${firm.email}`} className="flex items-center gap-2 text-parchment/85 hover:text-gold-light transition-colors">
              <Mail size={14} aria-hidden="true" />
              <span dir="ltr">{firm.email}</span>
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
              <div className="font-display text-lg text-parchment leading-none">{firm.name}</div>
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
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/contact">درخواست مشاوره</Link>
            </Button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden text-parchment p-2" aria-label="باز کردن منو">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="start" className="p-0">
                <SheetHeader className="border-b border-white/10">
                  <SheetTitle>{firm.name}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 pb-4">
                  {NAV_ITEMS.map((item) => (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={`px-3 py-3 text-sm font-medium rounded-sm text-right ${
                          isActive(item.href) ? 'text-gold bg-ink' : 'text-parchment/80'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link href="/client-login" className="px-3 py-3 text-sm font-medium flex items-center gap-2 text-parchment/80">
                      <Lock size={14} aria-hidden="true" /> ورود موکلین
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="mt-2">
                      <Link href="/contact">درخواست مشاوره</Link>
                    </Button>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
