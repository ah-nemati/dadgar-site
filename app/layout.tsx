import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicShell from "@/components/PublicShell";
import { getFirm } from "@/lib/content/firm";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const firm = await getFirm();
  return {
    metadataBase: new URL(firm.url),
    applicationName: firm.name,
    authors: [{ name: firm.shortName, url: firm.url }],
    creator: firm.shortName,
    publisher: firm.name,
    category: "خدمات حقوقی",
    manifest: "/manifest.webmanifest",
    referrer: "origin-when-cross-origin",
    formatDetection: { email: false, address: false, telephone: false },
    title: {
      default: `${firm.shortName} | مشاوره حقوقی آنلاین و وکیل در اهواز`,
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
      "وکیل آنلاین سراسر ایران",
      "وکیل کیفری اهواز",
      "وکیل ملکی اهواز",
      "وکیل چک",
      "وکیل خانواده اهواز",
      "وکیل قرارداد اهواز",
      "وکیل ارث اهواز",
      "مجید سواری",
      "کانون وکلای خوزستان",
    ],
    alternates: { canonical: "/", languages: { "fa-IR": "/" } },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${firm.shortName} | مشاوره حقوقی آنلاین و وکیل در اهواز`,
      description: firm.description,
      url: firm.url,
      siteName: firm.name,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${firm.shortName} | مشاوره حقوقی آنلاین و وکیل در اهواز`,
      description: firm.description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firm, practiceAreas] = await Promise.all([
    getFirm(),
    getPracticeAreas(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: firm.shortName,
    alternateName: firm.name,
    url: firm.url,
    description: firm.description,
    telephone: [
      firm.phoneHref.replace("tel:", ""),
      firm.phone2Href?.replace("tel:", ""),
    ].filter(Boolean),
    email: firm.email,
    image: new URL("/images/profile.jpeg", firm.url).toString(),
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "بلوار اصلی گلستان، نبش خیابان تربت، روبروی مدیریت بانک کشاورزی",
      addressLocality: "اهواز",
      addressRegion: "خوزستان",
      addressCountry: "IR",
    },
    areaServed: [
      { "@type": "Country", name: "ایران" },
      { "@type": "City", name: "اهواز" },
      { "@type": "AdministrativeArea", name: "خوزستان" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        opens: "17:00",
        closes: "22:00",
      },
    ],
    knowsAbout: practiceAreas.map((area) => area.title),
    memberOf: { "@type": "Organization", name: "کانون وکلای دادگستری خوزستان" },
    sameAs: ["https://www.instagram.com/savari_lawyer.ahvaz"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: firm.phoneHref.replace("tel:", ""),
      contactType: "legal consultation",
      areaServed: "IR",
      availableLanguage: "fa",
    },
    potentialAction: {
      "@type": "CommunicateAction",
      target: firm.phoneHref,
      name: "تماس برای مشاوره حقوقی",
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-parchment text-foreground">
        <Link
          href="#main-content"
          className="skip-link bg-gold text-ink font-bold text-sm px-5 py-2.5 rounded-sm"
        >
          پرش به محتوای اصلی
        </Link>
        <PublicShell header={<Header firm={firm} />} footer={<Footer />}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
