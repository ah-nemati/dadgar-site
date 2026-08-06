
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleUserRound, LockKeyhole, Mail, Menu, Phone, X } from 'lucide-react';
import Seal from './Seal';
import { Button } from '@/components/ui/button';
import type { Firm } from '@/types/content';
import type { CurrentAccount } from '@/lib/session';

const NAV_ITEMS = [
  { href: '/', label: 'خانه' },
  { href: '/about', label: 'درباره ما' },
  { href: '/practice-areas', label: 'حوزه‌های تخصصی' },
  { href: '/lawyers', label: 'وکیل' },
  { href: '/blog', label: 'وبلاگ' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/contact', label: 'تماس با ما' },
];

function profilePath(account: CurrentAccount) {
  return account.role === 'admin' ? '/admin' : '/portal';
}

function initials(account: CurrentAccount) {
  const value = account.fullName.trim() || account.email;
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ''}`
    : value.slice(0, 2);
}

function AccountLink({ account, compact = false }: { account: CurrentAccount; compact?: boolean }) {
  return (
    <Link
      href={profilePath(account)}
      className={`profile-link ${compact ? 'profile-link--compact' : ''}`}
      aria-label={account.role === 'admin' ? 'ورود به پنل مدیریت' : 'ورود به پنل کاربری'}
      title={account.fullName || account.email}
    >
      <span className="profile-avatar" aria-hidden="true">{initials(account)}</span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-xs text-parchment/65">حساب کاربری</span>
          <span className="block text-sm text-parchment truncate max-w-32">
            {account.fullName || 'پروفایل من'}
          </span>
        </span>
      )}
    </Link>
  );
}

export default function Header({ firm, account }: { firm: Firm; account: CurrentAccount | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-ink shadow-lg shadow-ink/10">
      <div className="hidden md:block border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href={firm.phoneHref} className="header-meta-link">
              <Phone size={14} aria-hidden="true" />
              <span dir="ltr">{firm.phone}</span>
            </a>
            {firm.phone2 && (
              <a href={firm.phone2Href} className="header-meta-link">
                <Phone size={14} aria-hidden="true" />
                <span dir="ltr">{firm.phone2}</span>
              </a>
            )}
            <a href={`mailto:${firm.email}`} className="header-meta-link">
              <Mail size={14} aria-hidden="true" />
              <span dir="ltr">{firm.email}</span>
            </a>
          </div>

          {account ? (
            <AccountLink account={account} />
          ) : (
            <Link href="/login" className="header-meta-link font-semibold">
              <LockKeyhole size={14} aria-hidden="true" />
              <span>ورود / ثبت‌نام</span>
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="صفحه اصلی">
            <Seal size={42} />
            <div className="text-right hidden sm:block">
              <div className="font-display text-lg text-parchment leading-none">{firm.name}</div>
              <div className="text-xs text-gold-light mt-1">دفتر خدمات حقوقی</div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-0.5" aria-label="منوی اصلی">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-gold-light' : 'text-parchment/80 hover:text-gold-light'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href="/contact">درخواست مشاوره</Link>
            </Button>

            <div className="md:hidden">
              {account ? (
                <AccountLink account={account} compact />
              ) : (
                <Link href="/login" className="header-icon-button" aria-label="ورود به حساب کاربری">
                  <CircleUserRound size={22} aria-hidden="true" />
                </Link>
              )}
            </div>

            <button
              type="button"
              className="xl:hidden header-icon-button"
              aria-label="باز کردن منو"
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label="منوی سایت">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="بستن منو"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="mobile-navigation"
            className="absolute inset-y-0 right-0 flex w-[min(86vw,22rem)] flex-col bg-ink shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-base text-parchment">{firm.name}</span>
              <button
                type="button"
                className="header-icon-button"
                aria-label="بستن منو"
                onClick={() => setMenuOpen(false)}
                autoFocus
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5" aria-label="منوی موبایل">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-sm px-3 py-3 text-right text-sm font-medium ${
                    isActive(item.href) ? 'bg-parchment text-ink' : 'text-parchment/85 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-white/10" />
              {account ? (
                <Link
                  href={profilePath(account)}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-parchment/90"
                >
                  <CircleUserRound size={17} aria-hidden="true" />
                  {account.role === 'admin' ? 'پنل مدیریت' : 'پنل کاربری'}
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-parchment/90"
                >
                  <LockKeyhole size={17} aria-hidden="true" />
                  ورود / ثبت‌نام
                </Link>
              )}
              <Button asChild className="mt-2">
                <Link href="/contact" onClick={() => setMenuOpen(false)}>درخواست مشاوره</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
