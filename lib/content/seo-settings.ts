import { getContentOverride } from "@/lib/content/overrides";

export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  googleSiteVerification: string;
  ogImage: string;
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultTitle: "  | مشاوره حقوقی آنلاین و وکیل در  ",
  titleTemplate: "%s |  ",
  defaultDescription:
    " ، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، ارائه‌دهنده مشاوره حقوقی آنلاین در سراسر ایران و خدمات حضوری در   در حوزه‌های حقوقی و کیفری.",
  keywords: [
    "وکیل  ",
    "وکیل پایه یک دادگستری  ",
    "دفتر وکالت  ",
    "مشاوره حقوقی  ",
    "مشاوره حقوقی آنلاین",
    "وکیل آنلاین سراسر ایران",
    "وکیل کیفری  ",
    "وکیل ملکی  ",
    "وکیل چک",
    "وکیل خانواده  ",
    " ",
  ],
  googleSiteVerification: "",
  ogImage: "/opengraph-image",
};

export async function getSeoSettings(): Promise<SeoSettings> {
  return getContentOverride<SeoSettings>("seo_settings", DEFAULT_SEO_SETTINGS);
}
