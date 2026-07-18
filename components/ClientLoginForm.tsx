'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { User, Lock, LogIn, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ClientLoginForm() {
  const [showInfo, setShowInfo] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setShowInfo(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="bg-card border border-border rounded-sm p-7">
        <div className="space-y-2 mb-5">
          <Label htmlFor="cl-user">نام کاربری</Label>
          <div className="relative">
            <User size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <Input id="cl-user" type="text" style={{ paddingRight: 40, paddingLeft: 16 }} />
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <Label htmlFor="cl-pass">رمز عبور</Label>
          <div className="relative">
            <Lock size={16} className="text-muted-foreground absolute" style={{ right: 14, top: '50%', transform: 'translateY(-50%)' }} aria-hidden="true" />
            <Input id="cl-pass" type="password" style={{ paddingRight: 40, paddingLeft: 16 }} />
          </div>
        </div>

        <Button
          type="button"
          variant="link"
          onClick={() => setShowInfo(true)}
          className="h-auto p-0 text-xs mb-6 font-semibold"
        >
          رمز عبور را فراموش کرده‌اید؟
        </Button>

        {showInfo && (
          <Alert className="mb-6">
            <MessageSquare />
            <AlertDescription>
              پرتال اختصاصی موکلین در فاز دوم این پروژه (پنل مدیریتی) راه‌اندازی می‌شود. برای پیگیری فوری پرونده خود،
              لطفاً با دفتر تماس بگیرید.
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full">
          ورود <LogIn size={16} aria-hidden="true" />
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        موکل جدید هستید؟{' '}
        <Link href="/contact" className="text-teal hover:text-gold transition-colors font-semibold">
          با ما تماس بگیرید
        </Link>
      </p>
    </>
  );
}
