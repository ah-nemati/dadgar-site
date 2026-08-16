'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function isEditingForm(): boolean {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return false;
  return (
    active.matches('input, textarea, select') ||
    active.isContentEditable
  );
}

export default function ServerDataAutoRefresh({ intervalMs = 10_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible' || isEditingForm()) return;
      router.refresh();
    }, Math.max(5_000, intervalMs));

    return () => window.clearInterval(timer);
  }, [intervalMs, router]);

  return null;
}
