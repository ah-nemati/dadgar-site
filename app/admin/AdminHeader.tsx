import { LogOut } from 'lucide-react';
import Seal from '@/components/Seal';
import { logout } from './actions';

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="bg-ink border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Seal size={32} />
          <span className="font-display text-parchment">{title}</span>
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
