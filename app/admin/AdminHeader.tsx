import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Seal from '@/components/Seal';
import { logout } from './actions';

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="bg-ink border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Seal size={32} />
            <span className="font-display text-parchment hidden sm:inline">{title}</span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/messages" className="text-parchment/80 hover:text-gold-light transition-colors">
              پیام‌ها
            </Link>
            <Link href="/admin/blog" className="text-parchment/80 hover:text-gold-light transition-colors">
              وبلاگ
            </Link>
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-parchment/80 hover:text-gold-light transition-colors"
          >
            خروج <LogOut size={14} aria-hidden="true" />
          </button>
        </form>
      </div>
    </header>
  );
}
