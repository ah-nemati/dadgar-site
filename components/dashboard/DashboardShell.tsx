"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "@/components/NoPrefetchLink";
import { usePathname } from "next/navigation";
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
  | "profile";

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

  return (
    <div className="dashboard-shell">
      {open && (
        <button
          className="dashboard-backdrop lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="بستن منو"
        />
      )}

      <aside className="dashboard-sidebar" data-open={open}>
        <div className="h-[4.5rem] px-5 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <Seal size={36} />
            <div>
              <p className="font-display text-sm text-parchment">
                {panelTitle}
              </p>
              <p className="text-[11px] text-parchment/55 mt-1">
                دفتر خدمات حقوقی
              </p>
            </div>
          </Link>
          <button
            className="header-icon-button lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="بستن منو"
          >
            <X size={21} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4" aria-label="منوی پنل">
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className="dashboard-nav-link"
                data-active={active(item.href)}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link href="/" className="dashboard-nav-link !mx-0 mb-1">
            <ExternalLink size={18} aria-hidden="true" />
            مشاهده سایت
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="dashboard-nav-link !mx-0 w-full text-right"
            >
              <LogOut size={18} aria-hidden="true" />
              خروج از حساب
            </button>
          </form>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="lg:hidden inline-flex items-center justify-center size-10 rounded-full hover:bg-muted"
            onClick={() => setOpen(true)}
            aria-label="باز کردن منوی پنل"
          >
            <Menu size={22} />
          </button>

          <div className="mr-auto lg:mr-0 min-w-0">
            <p className="text-xs text-muted-foreground">
              {account.role === "ADMIN"
                ? "مدیر سایت"
                : account.role === "LAWYER"
                  ? "وکیل"
                  : "حساب موکل"}
            </p>
            <p className="text-sm font-bold truncate">
              {account.fullName || account.email}
            </p>
          </div>

          <Link
            href={account.role === "CLIENT" ? "/portal/profile" : "/admin/security"}
            className="inline-flex items-center gap-2 min-w-0"
            aria-label="مشاهده پروفایل"
          >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-parchment text-xs font-extrabold">
              {initials(account)}
            </span>
          </Link>
        </header>

        <main id="main-content" className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
