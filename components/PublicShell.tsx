'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import PageTransition from '@/components/motion/PageTransition';

export default function PublicShell({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const dashboardRoute = pathname.startsWith('/admin') || pathname.startsWith('/portal');

  if (dashboardRoute) return <>{children}</>;

  return (
    <>
      {header}
      <main id="main-content" className="flex-1 overflow-x-clip">
        <PageTransition pageKey={pathname}>{children}</PageTransition>
      </main>
      {footer}
    </>
  );
}
