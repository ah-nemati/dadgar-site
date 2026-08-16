import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PublicShell from "@/components/PublicShell";
import { getFirm } from "@/lib/content/firm";
import { getPracticeAreas } from "@/lib/content/practice-areas";
import { getSeoSettings } from "@/lib/content/seo-settings";
import { getAppointmentSettings } from "@/lib/content/appointment-settings";
import Link from "@/components/NoPrefetchLink";
import { officeMapLink } from "@/components/OfficeMap";
import RouteProgress from "@/components/RouteProgress";

export const viewport: Viewport = {
  themeColor: "#e0f2fe",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const [firm, seo] = await Promise.all([getFirm(), getSeoSettings()]);
  return {
    metadataBase: new URL(firm.url),
    applicationName: firm.name,
    authors: [{ name: firm.shortName, url: firm.url }],
    creator: firm.shortName,
    publisher: firm.name,
    category: "خدمات حقوقی",
    icons: {
      icon: [{ url: "/favicon.ico" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    },
    referrer: "origin-when-cross-origin",
    formatDetection: { email: false, address: false, telephone: false },
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate,
    },
    description: seo.defaultDescription,
    keywords: seo.keywords,
    verification: seo.googleSiteVerification ? { google: seo.googleSiteVerification } : undefined,
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
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      url: firm.url,
      siteName: firm.name,
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firm, practiceAreas, appointmentSettings] = await Promise.all([
    getFirm(),
    getPracticeAreas(),
    getAppointmentSettings(),
  ]);

  const schemaDays: Record<number, string> = {
    0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
    4: "Thursday", 5: "Friday", 6: "Saturday",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": new URL("/#legal-service", firm.url).toString(),
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
      streetAddress: firm.address,
      addressLocality: firm.city || "اهواز",
      addressRegion: firm.region || "خوزستان",
      addressCountry: firm.countryCode || "IR",
      postalCode: firm.postalCode || undefined,
    },
    ...(typeof firm.latitude === "number" && typeof firm.longitude === "number" ? {
      geo: {
        "@type": "GeoCoordinates",
        latitude: firm.latitude,
        longitude: firm.longitude,
      },
    } : {}),
    hasMap: officeMapLink(firm),
    areaServed: [
      { "@type": "Country", name: "ایران" },
      { "@type": "City", name: firm.city || "اهواز" },
      { "@type": "AdministrativeArea", name: firm.region || "خوزستان" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: appointmentSettings.workingDays.map((day) => schemaDays[day]).filter(Boolean),
        opens: `${appointmentSettings.openHour.toString().padStart(2, "0")}:00`,
        closes: `${appointmentSettings.closeHour.toString().padStart(2, "0")}:00`,
      },
    ],
    knowsAbout: practiceAreas.map((area) => area.title),
    memberOf: { "@type": "Organization", name: "کانون وکلای دادگستری خوزستان" },
    sameAs: [firm.instagramUrl].filter(Boolean),
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
    "@id": new URL("/#website", firm.url).toString(),
    name: firm.name,
    alternateName: firm.shortName,
    url: firm.url,
    inLanguage: "fa-IR",
    publisher: { "@id": new URL("/#legal-service", firm.url).toString() },
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
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
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
