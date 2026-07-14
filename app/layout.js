import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FIRM } from '@/data/firm';

export const metadata = {
  metadataBase: new URL(FIRM.url),
  title: {
    default: `${FIRM.name} | ${FIRM.tagline}`,
    template: `%s | ${FIRM.name}`,
  },
  description: FIRM.description,
  openGraph: {
    title: FIRM.name,
    description: FIRM.description,
    locale: 'fa_IR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased min-h-screen flex flex-col bg-parchment text-charcoal">
        <a href="#main-content" className="skip-link bg-gold text-ink font-bold text-sm px-5 py-2.5 rounded-sm">
          پرش به محتوای اصلی
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
