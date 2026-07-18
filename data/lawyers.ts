import type { Lawyer } from '@/types/content';

// ⚠️ `education` has a bracketed placeholder — real degree/university wasn't
// provided; replace before publishing. Everything else here reflects the
// lawyer's public Instagram bio (savari_lawyer.ahvaz).
export const LAWYERS: Lawyer[] = [
  {
    slug: 'majid-savari',
    name: 'مجید سواری',
    role: 'وکیل پایه یک دادگستری',
    specialties: ['real-estate', 'cheque', 'family'],
    experience: 'عضو کانون وکلای خوزستان',
    initials: 'م.س',
    bio: 'مجید سواری وکیل پایه یک دادگستری و عضو کانون وکلای خوزستان است. فعالیت وی به‌طور تخصصی بر دعاوی ملکی، چک و خانواده متمرکز است و مشاوره و وکالت با دقت و پیگیری مستمر تا حصول نتیجه ارائه می‌شود.',
    education: ['[مدرک تحصیلی و دانشگاه]', 'پروانه وکالت پایه یک دادگستری', 'عضو کانون وکلای دادگستری خوزستان'],
  },
];
