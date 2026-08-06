
import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NavigationLoader from '@/components/NavigationLoader';
import PublicShell from '@/components/PublicShell';
import { getFirm } from '@/lib/content/firm';
import { getPracticeAreas } from '@/lib/content/practice-areas';
import { getCurrentAccount } from '@/lib/session';

export async function generateMetadata(): Promise<Metadata> {
  const firm = await getFirm();
  return {
    metadataBase: new URL(firm.url),
    title: {
      default: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      template: `%s | ${firm.shortName}`,
    },
    description: firm.description,
    keywords: [
      'وکیل اهواز',
      'بهترین وکیل اهواز',
      'وکیل پایه یک دادگستری اهواز',
      'دفتر وکالت اهواز',
      'مشاوره حقوقی اهواز',
      'مشاوره حقوقی آنلاین',
      'وکیل ملکی اهواز',
      'وکیل چک',
      'وکیل خانواده اهواز',
      'مجید سواری',
      'کانون وکلای خوزستان',
    ],
    alternates: { canonical: '/' },
    openGraph: {
      title: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      description: firm.description,
      url: firm.url,
      siteName: firm.name,
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      description: firm.description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [firm, practiceAreas, account] = await Promise.all([
    getFirm(),
    getPracticeAreas(),
    getCurrentAccount(),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Attorney',
    name: firm.shortName,
    alternateName: firm.name,
    url: firm.url,
    description: firm.description,
    telephone: firm.phoneHref.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'بلوار اصلی گلستان، نبش خیابان تربت، روبروی مدیریت بانک کشاورزی',
      addressLocality: 'اهواز',
      addressRegion: 'خوزستان',
      addressCountry: 'IR',
    },
    areaServed: { '@type': 'City', name: 'اهواز' },
    knowsAbout: practiceAreas.map((area) => area.title),
    memberOf: { '@type': 'Organization', name: 'کانون وکلای دادگستری خوزستان' },
    sameAs: ['https://www.instagram.com/savari_lawyer.ahvaz'],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: firm.name,
    alternateName: firm.shortName,
    url: firm.url,
    inLanguage: 'fa-IR',
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-parchment text-foreground">
        <a href="#main-content" className="skip-link bg-gold text-ink font-bold text-sm px-5 py-2.5 rounded-sm">
          پرش به محتوای اصلی
        </a>
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <PublicShell
          header={<Header firm={firm} account={account} />}
          footer={<Footer />}
        >
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
