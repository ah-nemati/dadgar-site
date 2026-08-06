import { createClient } from '@/lib/supabase/server';

export interface AdminDashboardStats {
  clients: number;
  activeCases: number;
  newConsultations: number;
  openThreads: number;
  pendingAppointments: number;
  publishedPosts: number;
  draftPosts: number;
}

function readCount(result: { count: number | null; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.count ?? 0;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  const [
    clientsResult,
    activeCasesResult,
    consultationsResult,
    openThreadsResult,
    appointmentsResult,
    publishedPostsResult,
    draftPostsResult,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
    supabase.from('client_cases').select('*', { count: 'exact', head: true }).neq('status', 'closed'),
    supabase.from('consultation_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('support_threads').select('*', { count: 'exact', head: true }).neq('status', 'closed'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('published', false),
  ]);

  return {
    clients: readCount(clientsResult),
    activeCases: readCount(activeCasesResult),
    newConsultations: readCount(consultationsResult),
    openThreads: readCount(openThreadsResult),
    pendingAppointments: readCount(appointmentsResult),
    publishedPosts: readCount(publishedPostsResult),
    draftPosts: readCount(draftPostsResult),
  };
}
