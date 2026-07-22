import type { Metadata } from 'next';
import '../globals.css';
import { FIRM } from '@/data/firm';

export const metadata: Metadata = {
  metadataBase: new URL(FIRM.url),
  title: 'پنل مدیریت',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased min-h-screen bg-parchment text-foreground font-body">{children}</body>
    </html>
  );
}
