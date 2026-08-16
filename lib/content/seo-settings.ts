import { getContentOverride } from '@/lib/content/overrides';

export interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  googleSiteVerification: string;
  ogImage: string;
}

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  defaultTitle: 'مجید سواری | مشاوره حقوقی آنلاین و وکیل در اهواز',
  titleTemplate: '%s | مجید سواری',
  defaultDescription:
    'مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، ارائه‌دهنده مشاوره حقوقی آنلاین در سراسر ایران و خدمات حضوری در اهواز در حوزه‌های حقوقی و کیفری.',
  keywords: [
    'وکیل اهواز',
    'وکیل پایه یک دادگستری اهواز',
    'دفتر وکالت اهواز',
    'مشاوره حقوقی اهواز',
    'مشاوره حقوقی آنلاین',
    'وکیل آنلاین سراسر ایران',
    'وکیل کیفری اهواز',
    'وکیل ملکی اهواز',
    'وکیل چک',
    'وکیل خانواده اهواز',
    'مجید سواری',
  ],
  googleSiteVerification: '',
  ogImage: '/opengraph-image',
};

export async function getSeoSettings(): Promise<SeoSettings> {
  return getContentOverride<SeoSettings>('seo_settings', DEFAULT_SEO_SETTINGS);
}
