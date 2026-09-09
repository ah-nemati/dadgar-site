"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, CircleUserRound, Mail, Menu, Phone } from "lucide-react";
import Link from "@/components/NoPrefetchLink";
import AccountEntryLink from "@/components/AccountEntryLink";
import Seal from "./Seal";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Firm } from "@/types/content";

const DESKTOP_NAV = [
  { href: "/", label: "خانه" },
  { href: "/practice-areas", label: "حوزه‌های حقوقی" },
  { href: "/lawyer-ahvaz", label: "وکیل در  " },
  { href: "/online-legal-consultation", label: "مشاوره آنلاین" },
  { href: "/fees", label: "تعرفه‌ها" },
  { href: "/blog", label: "مجله حقوقی" },
  { href: "/contact", label: "تماس" },
];

const MOBILE_NAV = [
  ...DESKTOP_NAV,
  { href: "/about", label: "درباره دفتر" },
  { href: "/faq", label: "سوالات متداول" },
];

export default function Header({ firm }: { firm: Firm }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="site-header__utility hidden xl:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-6">
            <a href={firm.phoneHref} className="header-meta-link">
              <Phone size={13} />
              <span dir="ltr">{firm.phone}</span>
            </a>
            <a href={`mailto:${firm.email}`} className="header-meta-link">
              <Mail size={13} />
              <span dir="ltr">{firm.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/faq" className="header-meta-link">
              پرسش‌های متداول
            </Link>
            <Link href="/about" className="header-meta-link">
              درباره دفتر
            </Link>
            <AccountEntryLink className="header-meta-link font-bold">
              <CircleUserRound size={14} /> حساب کاربری
            </AccountEntryLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
        <div className="site-header__main flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            prefetch
            className="site-brand shrink-0"
            aria-label="صفحه اصلی"
          >
            <Seal size={42} />
            <div className="site-brand__copy">
              <div className="site-brand__name">{firm.name}</div>
              <div className="site-brand__meta">وکیل پایه یک دادگستری</div>
            </div>
          </Link>

          <nav className="header-desktop-nav" aria-label="منوی اصلی">
            {DESKTOP_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  aria-current={active ? "page" : undefined}
                  className="header-desktop-nav-link"
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="header-nav-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions mr-auto flex shrink-0 items-center gap-2">
            <Button asChild size="sm" className="header-desktop-cta">
              <Link href="/online-legal-consultation" prefetch>
                صحبت با وکیل <ArrowLeft size={15} />
              </Link>
            </Button>
            <AccountEntryLink
              className="header-icon-button header-account-button inline-flex"
              aria-label="حساب کاربری"
            >
              <CircleUserRound size={20} />
            </AccountEntryLink>

            <div className="header-menu-trigger">
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="header-icon-button inline-flex"
                    aria-label="باز کردن منو"
                  >
                    <Menu size={21} />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="start"
                  className="w-[min(90vw,24rem)] border-l border-sky-100 bg-white p-0 text-foreground"
                >
                  <SheetHeader className="border-b border-sky-100 bg-sky-50/70 px-5 py-5 text-right">
                    <div className="flex items-center gap-3 pl-10">
                      <Seal size={38} />
                      <div>
                        <SheetTitle className="text-sm font-extrabold text-foreground">
                          {firm.name}
                        </SheetTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          دفتر خدمات حقوقی
                        </p>
                      </div>
                    </div>
                  </SheetHeader>
                  <nav
                    className="flex-1 overflow-y-auto p-4"
                    aria-label="منوی موبایل"
                  >
                    <div className="space-y-1.5">
                      {MOBILE_NAV.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch
                          data-active={isActive(item.href)}
                          className="mobile-nav-link"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>{item.label}</span>
                          <ArrowLeft size={15} />
                        </Link>
                      ))}
                    </div>
                    <div className="my-5 h-px bg-sky-100" />
                    <Button asChild className="w-full">
                      <Link
                        href="/online-legal-consultation"
                        onClick={() => setMenuOpen(false)}
                      >
                        شروع مشاوره حقوقی <ArrowLeft size={16} />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="mt-3 w-full">
                      <AccountEntryLink onClick={() => setMenuOpen(false)}>
                        <CircleUserRound size={17} /> ورود به حساب کاربری
                      </AccountEntryLink>
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
