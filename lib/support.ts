
import { createClient } from '@/lib/supabase/server';
import type {
  SupportMessage,
  SupportThread,
  SupportThreadStatus,
  UserRole,
} from '@/types/content';

interface ThreadRow {
  id: number;
  client_id: string;
  subject: string;
  status: SupportThreadStatus;
  created_at: string;
  updated_at: string;
}

interface MessageRow {
  id: number;
  thread_id: number;
  sender_id: string;
  body: string;
  created_at: string;
}

async function profilesMap(ids: string[]) {
  const map = new Map<string, { name: string; role: UserRole }>();
  if (ids.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name, role').in('id', ids);
  for (const row of data ?? []) {
    map.set(row.id, { name: row.full_name || 'کاربر', role: row.role as UserRole });
  }
  return map;
}

export async function getSupportThreads(): Promise<SupportThread[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('support_threads')
    .select()
    .order('updated_at', { ascending: false });

  if (error) throw error;
  const rows = data as ThreadRow[];
  const profiles = await profilesMap(Array.from(new Set(rows.map((row) => row.client_id))));

  const threadIds = rows.map((row) => row.id);
  const lastMap = new Map<number, string>();
  if (threadIds.length > 0) {
    const { data: messages } = await supabase
      .from('support_messages')
      .select('thread_id, body, created_at')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: false });

    for (const message of messages ?? []) {
      if (!lastMap.has(message.thread_id)) lastMap.set(message.thread_id, message.body);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    clientId: row.client_id,
    clientName: profiles.get(row.client_id)?.name ?? 'موکل',
    subject: row.subject,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastMessage: lastMap.get(row.id) ?? null,
  }));
}

export async function getSupportThread(id: number): Promise<SupportThread | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('support_threads')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const row = data as ThreadRow;
  const profiles = await profilesMap([row.client_id]);

  return {
    id: row.id,
    clientId: row.client_id,
    clientName: profiles.get(row.client_id)?.name ?? 'موکل',
    subject: row.subject,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSupportMessages(threadId: number): Promise<SupportMessage[]> {
  const [thread, supabase] = await Promise.all([
    getSupportThread(threadId),
    createClient(),
  ]);

  if (!thread) return [];

  const { data, error } = await supabase
    .from('support_messages')
    .select()
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  const rows = data as MessageRow[];

  return rows.map((row) => {
    const fromClient = row.sender_id === thread.clientId;
    return {
      id: row.id,
      threadId: row.thread_id,
      senderId: row.sender_id,
      senderName: fromClient ? thread.clientName : 'پشتیبانی دفتر',
      senderRole: fromClient ? 'client' : 'admin',
      body: row.body,
      createdAt: row.created_at,
    };
  });
}

export async function createSupportThread(subject: string, body: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('create_support_thread', {
    p_subject: subject,
    p_body: body,
  });

  if (error) throw error;
  return Number(data);
}

export async function replySupportThread(threadId: number, body: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('reply_support_thread', {
    p_thread_id: threadId,
    p_body: body,
  });
  if (error) throw error;
}

export async function setSupportThreadStatus(
  id: number,
  status: SupportThreadStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('support_threads')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}
