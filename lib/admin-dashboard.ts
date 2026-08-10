import { db } from '@/lib/db';

export interface AdminDashboardStats {
  clients: number;
  activeCases: number;
  newConsultations: number;
  openThreads: number;
  pendingAppointments: number;
  publishedPosts: number;
  draftPosts: number;
}

interface StatsRow {
  clients: number | string;
  activeCases: number | string;
  newConsultations: number | string;
  openThreads: number | string;
  pendingAppointments: number | string;
  publishedPosts: number | string;
  draftPosts: number | string;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [row] = await db<StatsRow[]>`
    select
      (select count(*) from users where role = 'CLIENT')::int as clients,
      (select count(*) from client_cases where status <> 'closed')::int as active_cases,
      (select count(*) from consultation_requests where status = 'new')::int as new_consultations,
      (select count(*) from support_threads where status <> 'closed')::int as open_threads,
      (select count(*) from appointments where status = 'pending')::int as pending_appointments,
      (select count(*) from blog_posts where published = true)::int as published_posts,
      (select count(*) from blog_posts where published = false)::int as draft_posts
  `;
  return {
    clients: Number(row.clients),
    activeCases: Number(row.activeCases),
    newConsultations: Number(row.newConsultations),
    openThreads: Number(row.openThreads),
    pendingAppointments: Number(row.pendingAppointments),
    publishedPosts: Number(row.publishedPosts),
    draftPosts: Number(row.draftPosts),
  };
}
