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
      "وکیل ملکی اهواز",
      "وکیل چک",
      "وکیل خانواده اهواز",
      "مجید سواری",
      "دفتر وکالت اهواز",
      "کانون وکلای خوزستان",
    ],
    openGraph: {
      title: `${firm.shortName} | وکیل پایه یک دادگستری در اهواز`,
      description: firm.description,
      locale: "fa_IR",
      type: "website",
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

  return (
    <html lang="fa" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
