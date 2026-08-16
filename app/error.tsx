'use client';

import Link from '@/components/NoPrefetchLink';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="dashboard-card w-full max-w-lg p-5 text-center sm:p-8">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <RotateCcw size={26} aria-hidden="true" />
        </div>
        <h1 className="text-xl font-extrabold">بارگذاری این بخش با مشکل مواجه شد</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          اتصال اینترنت یا تنظیمات سرویس را بررسی کنید و دوباره تلاش کنید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            تلاش دوباره
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home size={16} aria-hidden="true" />
              صفحه اصلی
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
