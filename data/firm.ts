import type { Firm } from '@/types/content';

// ⚠️ Of the 3 Gmail addresses visible in the account-switcher screenshot, this
// picks `savari.vakil2023@gmail.com` as the most clearly "current professional"
// one (vakil-branded, newest). Swap this if a different address was meant —
// see the chat response.
export const FIRM: Firm = {
  name: 'دفتر وکالت مجید سواری',
  shortName: 'مجید سواری',
  tagline: 'وکالت و مشاوره تخصصی در دعاوی ملکی، چک و خانواده',
  description:
    'مجید سواری، وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان، ارائه‌دهنده خدمات مشاوره و وکالت تخصصی در دعاوی ملکی، چک و خانواده در اهواز.',
  phone: '۰۹۱۶ ۸۰۳ ۸۶۴۰',
  phoneHref: 'tel:+989168038640',
  phone2: '۰۹۳۶ ۹۹۸ ۵۳۹۲',
  phone2Href: 'tel:+989369985392',
  email: 'savari.vakil2023@gmail.com',
  address: 'اهواز، گلستان، بلوار اصلی گلستان، نبش خیابان تربت، روبروی مدیریت بانک کشاورزی',
  hours: 'شنبه تا چهارشنبه — ساعت ۹ الی ۱۷',
  established: '[تعداد سال‌های سابقه]',
  url: 'https://savarilawyer.ir',
};
