'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Lock, LogIn, MessageSquare } from 'lucide-react';

export default function ClientLoginForm() {
  const [showInfo, setShowInfo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowInfo(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="bg-card border border-sand rounded-sm p-7">
        <div className="mb-5">
          <label htmlFor="cl-user" className="block text-sm font-medium text-charcoal mb-2">نام کاربری</label>
          <div className="relative">
            <User size={16} className="text-muted absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <input
              id="cl-user"
              type="text"
              className="w-full py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              style={{ paddingRight: 40, paddingLeft: 16 }}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="cl-pass" className="block text-sm font-medium text-charcoal mb-2">رمز عبور</label>
          <div className="relative">
            <Lock size={16} className="text-muted absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <input
              id="cl-pass"
              type="password"
              className="w-full py-2.5 rounded-sm text-sm bg-card border border-sand focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              style={{ paddingRight: 40, paddingLeft: 16 }}
            />
          </div>
        </div>
        <button type="button" onClick={() => setShowInfo(true)} className="text-teal hover:text-gold transition-colors text-xs mb-6 font-semibold">
          رمز عبور را فراموش کرده‌اید؟
        </button>

        {showInfo && (
          <div className="mb-6 p-4 rounded-sm flex items-start gap-3 bg-parchment border border-sand">
            <MessageSquare size={18} className="text-teal shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-charcoal leading-6">
              پرتال اختصاصی موکلین در فاز دوم این پروژه (پنل مدیریتی) راه‌اندازی می‌شود. برای پیگیری فوری پرونده خود،
              لطفاً با دفتر تماس بگیرید.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-ink font-semibold px-5 py-3 rounded-sm text-sm transition-colors"
        >
          ورود <LogIn size={16} aria-hidden="true" />
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        موکل جدید هستید؟{' '}
        <Link href="/contact" className="text-teal hover:text-gold transition-colors font-semibold">با ما تماس بگیرید</Link>
      </p>
    </>
  );
}
