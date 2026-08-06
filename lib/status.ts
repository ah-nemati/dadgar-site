
import type {
  AppointmentStatus,
  CaseStatus,
  ConsultationStatus,
  SupportThreadStatus,
} from '@/types/content';

export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  new: 'جدید',
  in_progress: 'در حال رسیدگی',
  waiting: 'در انتظار اقدام',
  closed: 'مختومه',
};

export const CASE_STATUS_VARIANT: Record<CaseStatus, 'default' | 'outline' | 'accent'> = {
  new: 'default',
  in_progress: 'accent',
  waiting: 'outline',
  closed: 'outline',
};

export const SUPPORT_STATUS_LABEL: Record<SupportThreadStatus, string> = {
  open: 'در انتظار پاسخ',
  answered: 'پاسخ داده شده',
  closed: 'بسته شده',
};

export const SUPPORT_STATUS_VARIANT: Record<SupportThreadStatus, 'default' | 'outline' | 'accent'> = {
  open: 'default',
  answered: 'accent',
  closed: 'outline',
};

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: 'در انتظار تأیید',
  confirmed: 'تأیید شده',
  cancelled: 'لغو شده',
  completed: 'انجام شده',
};

export const APPOINTMENT_STATUS_VARIANT: Record<AppointmentStatus, 'default' | 'outline' | 'accent' | 'destructive'> = {
  pending: 'default',
  confirmed: 'accent',
  cancelled: 'destructive',
  completed: 'outline',
};

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  new: 'جدید',
  read: 'خوانده شده',
  replied: 'پاسخ داده شده',
};
