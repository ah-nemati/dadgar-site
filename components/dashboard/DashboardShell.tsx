"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "@/components/NoPrefetchLink";
import { usePathname } from "next/navigation";
import PageTransition from '@/components/motion/PageTransition';
import {
  Briefcase,
  CalendarDays,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Search,
  ListChecks,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Seal from "@/components/Seal";
import type { CurrentAccount } from "@/types/content";
import { logoutAction } from "@/app/auth/actions";

export type DashboardIconName =
  | "dashboard"
  | "inbox"
  | "blog"
  | "users"
  | "cases"
  | "messages"
  | "calendar"
  | "profile"
  | "settings"
  | "seo"
  | "content"
  | "audit";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: DashboardIconName;
}

const ICONS = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  blog: FileText,
  users: Users,
  cases: Briefcase,
  messages: MessageSquare,
  calendar: CalendarDays,
  profile: UserRound,
  settings: Settings,
  seo: Search,
  content: ListChecks,
  audit: ShieldCheck,
} satisfies Record<DashboardIconName, typeof LayoutDashboard>;

function initials(account: CurrentAccount) {
  const value = account.fullName.trim() || account.email;
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts.at(-1)?.[0] ?? ""}`
    : value.slice(0, 2);
}

export default function DashboardShell({
  account,
  navItems,
  panelTitle,
  children,
}: {
  account: CurrentAccount;
  navItems: DashboardNavItem[];
  panelTitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) =>
    href === "/admin" || href === "/portal"
      ? pathname === href
      : pathname.startsWith(href);

  const activeItem = [...navItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => active(item.href));

  const profileHref = account.role === "CLIENT" ? "/portal/profile" : "/admin/security";
  const roleLabel = account.role === "ADMIN" ? "مدیر سایت" : account.role === "LAWYER" ? "وکیل" : "موکل";

  return (
    <div className="dashboard-shell">
      {open && (
        <button
          className="dashboard-backdrop xl:hidden"
          onClick={() => setOpen(false)}
          aria-label="بستن منو"
        />
      )}

      <aside className="dashboard-sidebar" data-open={open}>
        <div className="flex min-h-[5rem] items-center justify-between border-b border-white/10 px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
            <Seal size={39} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-parchment">{panelTitle}</p>
              <p className="mt-1 text-[11px] text-parchment/45">سامانه مدیریت خدمات حقوقی</p>
            </div>
          </Link>
          <button
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-parchment/70 hover:bg-white/10 xl:hidden"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
          >
            <X size={19} />
          </button>
        </div>

        <div className="px-4 pt-5">
          <p className="px-3 text-[10px] font-bold tracking-wider text-parchment/35">منوی اصلی</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-3" aria-label="منوی پنل">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="dashboard-nav-link"
                data-active={active(item.href)}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link href={profileHref} className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-3 hover:bg-white/[0.07]">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-xs font-extrabold text-gold-light">
              {initials(account)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold text-parchment">{account.fullName || account.email}</span>
              <span className="mt-1 block text-[10px] text-parchment/45">{roleLabel}</span>
            </span>
          </Link>

          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
            <Link href="/" className="flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 text-xs font-bold text-parchment/65 hover:bg-white/5 hover:text-parchment">
              <ExternalLink size={15} aria-hidden="true" /> سایت
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="dashboard-logout-button">
                <LogOut size={15} aria-hidden="true" /> خروج
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground xl:hidden"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منوی پنل"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-muted-foreground">{panelTitle}</p>
            <p className="mt-0.5 truncate text-sm font-extrabold text-foreground">{activeItem?.label ?? "داشبورد"}</p>
          </div>

          <div className="hidden min-w-0 items-center gap-3 sm:flex">
            <div className="text-left">
              <p className="max-w-48 truncate text-xs font-bold text-foreground">{account.fullName || account.email}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{roleLabel}</p>
            </div>
            <Link href={profileHref} className="inline-flex size-10 items-center justify-center rounded-full border border-sky-200 bg-sky-100 text-xs font-extrabold text-sky-700" aria-label="مشاهده پروفایل">
              {initials(account)}
            </Link>
          </div>
        </header>

        <main id="main-content" className="dashboard-content">
          <PageTransition pageKey={pathname}>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
