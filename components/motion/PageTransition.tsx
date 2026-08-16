'use client';

import type { ReactNode } from 'react';

/**
 * Stable route boundary.
 *
 * Route-level Framer Motion wrappers can race React/Next route replacement on
 * Server Action redirects (notably logout), which can surface as a browser
 * `removeChild` NotFoundError. Keep route replacement DOM-stable and use Motion
 * inside individual sections/cards instead.
 */
export default function PageTransition({ children }: { children: ReactNode; pageKey?: string }) {
  return <>{children}</>;
}
