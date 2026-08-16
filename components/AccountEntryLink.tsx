'use client';

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

type AccountEntryLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  children: ReactNode;
  returnTo?: string;
  guestHref?: string;
};

export default function AccountEntryLink({
  children,
  returnTo = '/account',
  guestHref = '/login',
  className,
  onClick,
  ...props
}: AccountEntryLinkProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (pending) return;
    setPending(true);

    try {
      const query = new URLSearchParams({ returnTo, guestHref });
      const response = await fetch(`/api/auth/destination?${query.toString()}`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('ACCOUNT_DESTINATION_FAILED');
      const payload = (await response.json()) as { href?: string };
      router.push(payload.href || guestHref);
    } catch {
      router.push(guestHref);
    }
  }

  return (
    <>
      <a
        href={guestHref}
        className={className}
        onClick={handleClick}
        aria-busy={pending || undefined}
        data-resolve-destination="true"
        {...props}
      >
        {children}
      </a>
      {pending && (
        <div className="account-entry-loading" role="status" aria-live="polite">
          <div className="account-entry-loading__card">
            <LoaderCircle className="account-entry-loading__icon" size={24} aria-hidden="true" />
            <span>در حال ورود به پنل…</span>
          </div>
        </div>
      )}
    </>
  );
}
