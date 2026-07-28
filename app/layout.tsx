import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFirm } from "@/lib/content/firm";
import { getPracticeAreas } from "@/lib/content/practice-areas";

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
      "وکیل اهواز",
      "بهترین وکیل اهواز",
      "وکیل پایه یک دادگستری اهواز",
      "دفتر وکالت اهواز",
      "مشاوره حقوقی اهواز",
      "مشاوره حقوقی آنلاین",
      "وکیل ملکی اهواز",
      "وکیل ملک و املاک",
      "وکیل مبایعه‌نامه",
      "وکیل چک",
      "وکیل چک برگشتی",
      "وکیل مطالبه وجه چک",
      "وکیل خانواده اهواز",
      "وکیل طلاق اهواز",
      "وکیل مهریه",
      "وکیل حضانت فرزند",
      "مجید سواری",
      "کانون وکلای خوزستان",
      "وکیل خوزستان",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      description: firm.description,
      url: firm.url,
      siteName: firm.name,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      description: firm.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const firm = await getFirm();
  const practiceAreas = await getPracticeAreas();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    name: firm.shortName,
    alternateName: firm.name,
    url: firm.url,
    description: firm.description,
    telephone: firm.phoneHref.replace("tel:", ""),
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "بلوار اصلی گلستان، نبش خیابان تربت، روبروی مدیریت بانک کشاورزی",
      addressLocality: "اهواز",
      addressRegion: "خوزستان",
      addressCountry: "IR",
    },
    areaServed: {
      "@type": "City",
      name: "اهواز",
    },
    knowsAbout: practiceAreas.map((a) => a.title),
    memberOf: {
      "@type": "Organization",
      name: "کانون وکلای دادگستری خوزستان",
    },
    sameAs: ["https://www.instagram.com/savari_lawyer.ahvaz"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
      opens: "09:00",
      closes: "17:00",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: firm.name,
    alternateName: firm.shortName,
    url: firm.url,
    inLanguage: "fa-IR",
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-parchment text-foreground">
        <a
          href="#main-content"
          className="skip-link bg-gold text-ink font-bold text-sm px-5 py-2.5 rounded-sm"
        >
          پرش به محتوای اصلی
        </a>
        <Header firm={firm} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
