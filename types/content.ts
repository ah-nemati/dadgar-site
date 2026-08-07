
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
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
  imageUrl: string | null;
  imageFileId: string | null;
  imageAlt: string | null;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type UserRole = 'admin' | 'client';

export interface CurrentAccount {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  createdAt: string;
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

export type CaseStatus = 'new' | 'in_progress' | 'waiting' | 'closed';

export interface ClientCase {
  id: number;
  clientId: string;
  clientName: string;
  caseNumber: string;
  title: string;
  court: string | null;
  status: CaseStatus;
  description: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseUpdate {
  id: number;
  caseId: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ClientDocument {
  id: number;
  caseId: number;
  clientId: string;
  title: string;
  fileId: string | null;
  filePath: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
  downloadUrl?: string;
}

export type SupportThreadStatus = 'open' | 'answered' | 'closed';

export interface SupportThread {
  id: number;
  clientId: string;
  clientName: string;
  subject: string;
  status: SupportThreadStatus;
  createdAt: string;
  updatedAt: string;
  lastMessage?: string | null;
}

export interface SupportMessage {
  id: number;
  threadId: number;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  createdAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: number;
  clientId: string;
  clientName: string;
  subject: string;
  requestedAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}
