import type { PracticeAreaIconName } from '@/lib/icons';

export interface Firm {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  phone2?: string;
  phone2Href?: string;
  email: string;
  address: string;
  hours: string;
  established: string;
  url: string;
}

export type PracticeAreaSlug = 'real-estate' | 'cheque' | 'family';

export interface PracticeArea {
  slug: PracticeAreaSlug;
  title: string;
  icon: PracticeAreaIconName;
  shortDesc: string;
  longDesc: string;
  topics: string[];
}

export interface Lawyer {
  slug: string;
  name: string;
  role: string;
  specialties: PracticeAreaSlug[];
  experience: string;
  initials: string;
  bio: string;
  education: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export type ConsultationStatus = 'new' | 'read' | 'replied';

export interface ConsultationRequest {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  practiceArea: string | null;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
}
