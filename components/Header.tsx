"use client";

import { useEffect, useState } from "react";
import Link from "@/components/NoPrefetchLink";
import { usePathname } from "next/navigation";
import {
  CircleUserRound,
  LockKeyhole,
  Mail,
  Menu,
  Phone,
  X,
} from "lucide-react";
import Seal from "./Seal";
import { Button } from "@/components/ui/button";
import type { Firm } from "@/types/content";

const NAV_ITEMS = [
  { href: "/", label: "خانه" },
  { href: "/lawyer-ahvaz", label: "وکیل در اهواز" },
  { href: "/online-legal-consultation", label: "مشاوره آنلاین" },
  { href: "/practice-areas", label: "حوزه‌های تخصصی" },
  { href: "/fees", label: "تعرفه‌ها" },
  { href: "/blog", label: "وبلاگ" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/contact", label: "تماس با ما" },
];

export default function Header({ firm }: { firm: Firm }) {
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const pathname = usePathname();
  const menuOpen = menuPath === pathname;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuPath(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-ink shadow-lg shadow-ink/10">
      <div className="hidden border-b border-white/10 lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-6">
            <a href={firm.phoneHref} className="header-meta-link">
              <Phone size={14} aria-hidden="true" />
              <span dir="ltr">{firm.phone}</span>
            </a>
            {firm.phone2 && (
              <a href={firm.phone2Href ?? "#"} className="header-meta-link">
                <Phone size={14} aria-hidden="true" />
                <span dir="ltr">{firm.phone2}</span>
              </a>
            )}
            <a href={`mailto:${firm.email}`} className="header-meta-link">
              <Mail size={14} aria-hidden="true" />
              <span dir="ltr">{firm.email}</span>
            </a>
          </div>

          <Link href="/account" prefetch={false} className="header-meta-link font-semibold">
            <LockKeyhole size={14} aria-hidden="true" />
            <span>حساب کاربری</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between lg:h-[4.75rem]">
          <Link
            href="/"
            prefetch
            className="flex shrink-0 items-center gap-3"
            aria-label="صفحه اصلی"
          >
            <Seal size={42} />
            <div className="hidden text-right sm:block">
              <div className="font-display text-xl leading-none text-parchment">
                {firm.name}
              </div>
              <div className="mt-1 text-sm text-gold-light">
                دفتر خدمات حقوقی
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden lg:inline-flex">
              <Link href="/online-legal-consultation" prefetch>
                صحبت با وکیل
              </Link>
            </Button>

            <div className="lg:hidden">
              <Link
                href="/account"
                prefetch={false}
                className="header-icon-button inline-flex"
                aria-label="حساب کاربری"
              >
                <CircleUserRound size={22} aria-hidden="true" />
              </Link>
            </div>

            <button
              type="button"
              className="header-icon-button inline-flex lg:hidden"
              aria-label="باز کردن منو"
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuPath(pathname)}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-white/10 lg:block">
        <div className="mx-auto max-w-6xl px-6">
          <nav
            className="flex min-h-12 items-stretch justify-center"
            aria-label="منوی اصلی"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`header-desktop-nav-link ${
                  isActive(item.href) ? "header-desktop-nav-link--active" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="منوی سایت"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            aria-label="بستن منو"
            onClick={() => setMenuPath(null)}
          />
          <div
            id="mobile-navigation"
            className="absolute inset-y-0 right-0 flex w-[min(86vw,22rem)] flex-col bg-ink shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <span className="font-display text-lg text-parchment">
                {firm.name}
              </span>
              <button
                type="button"
                className="header-icon-button inline-flex"
                aria-label="بستن منو"
                onClick={() => setMenuPath(null)}
                autoFocus
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-5"
              aria-label="منوی موبایل"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={() => setMenuPath(null)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-sm px-3 py-3 text-right text-base font-medium ${
                    isActive(item.href)
                      ? "bg-parchment text-ink"
                      : "text-parchment/85 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t border-white/10" />
              <Link
                href="/account"
                prefetch={false}
                onClick={() => setMenuPath(null)}
                className="flex items-center gap-2 px-3 py-3 text-base font-medium text-parchment/90"
              >
                <CircleUserRound size={17} aria-hidden="true" />
                حساب کاربری
              </Link>
              <Button asChild className="mt-2">
                <Link
                  href="/online-legal-consultation"
                  prefetch
                  onClick={() => setMenuPath(null)}
                >
                  صحبت با وکیل
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
