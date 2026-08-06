
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Seal from '@/components/Seal';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [pathname, search]);

  useEffect(() => {
    function startLoading() {
      setLoading(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setLoading(false), 12000);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      if (url.pathname === current.pathname && url.search === current.search) return;
      if (url.pathname === current.pathname && url.hash) return;

      startLoading();
    }

    function handlePopState() {
      startLoading();
    }

    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', startLoading);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', startLoading);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="navigation-loader" role="status" aria-live="polite" aria-label="در حال بارگذاری صفحه">
      <div className="navigation-loader__bar" />
      <div className="navigation-loader__card">
        <div className="navigation-loader__seal"><Seal size={40} /></div>
        <div>
          <p className="font-bold text-foreground">در حال بارگذاری</p>
          <p className="text-xs text-muted-foreground mt-1">لطفاً چند لحظه صبر کنید...</p>
        </div>
      </div>
    </div>
  );
}
