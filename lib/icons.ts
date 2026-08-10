import {
  BadgeDollarSign,
  BriefcaseBusiness,
  FileText,
  Handshake,
  Home,
  Landmark,
  ScrollText,
  ShieldAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Practice areas store an icon *name* (a plain string), not a component reference —
 * a live component can't be passed from a Server Component into a Client Component
 * prop, and a future CMS can only persist simple values like a string anyway.
 * This registry is the single place that maps a name back to its component.
 */
export const PRACTICE_AREA_ICONS = {
  Users,
  Home,
  FileText,
  ShieldAlert,
  Handshake,
  ScrollText,
  BadgeDollarSign,
  Landmark,
  BriefcaseBusiness,
} satisfies Record<string, LucideIcon>;

export type PracticeAreaIconName = keyof typeof PRACTICE_AREA_ICONS;
