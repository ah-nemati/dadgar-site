import { db } from '@/lib/db';
import { requireAccount } from '@/lib/session';
import type { SupportMessage, SupportThread, SupportThreadStatus, UserRole } from '@/types/content';

interface ThreadRow {
  id: number | string; clientId: string; clientName: string; subject: string; status: SupportThreadStatus;
  createdAt: Date; updatedAt: Date; lastMessage: string | null;
}
interface MessageRow {
  id: number | string; threadId: number | string; senderId: string; senderName: string;
  senderRole: UserRole; body: string; createdAt: Date;
}
function mapThread(row: ThreadRow): SupportThread {
  return { id: Number(row.id), clientId: row.clientId, clientName: row.clientName || 'موکل', subject: row.subject,
    status: row.status, createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(), lastMessage: row.lastMessage };
}

export async function getSupportThreads(): Promise<SupportThread[]> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<ThreadRow[]>`
        select t.*, u.name as client_name,
          (select m.body from support_messages m where m.thread_id = t.id order by m.created_at desc limit 1) as last_message
        from support_threads t join users u on u.id = t.client_id
        order by t.updated_at desc
      `
    : await db<ThreadRow[]>`
        select t.*, u.name as client_name,
          (select m.body from support_messages m where m.thread_id = t.id order by m.created_at desc limit 1) as last_message
        from support_threads t join users u on u.id = t.client_id
        where t.client_id = ${account.id}
        order by t.updated_at desc
      `;
  return rows.map(mapThread);
}

export async function getSupportThread(id: number): Promise<SupportThread | null> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<ThreadRow[]>`
        select t.*, u.name as client_name, null::text as last_message
        from support_threads t join users u on u.id = t.client_id where t.id = ${id} limit 1
      `
    : await db<ThreadRow[]>`
        select t.*, u.name as client_name, null::text as last_message
        from support_threads t join users u on u.id = t.client_id
        where t.id = ${id} and t.client_id = ${account.id} limit 1
      `;
  return rows[0] ? mapThread(rows[0]) : null;
}

export async function getSupportMessages(threadId: number): Promise<SupportMessage[]> {
  if (!(await getSupportThread(threadId))) return [];
  const rows = await db<MessageRow[]>`
    select m.id, m.thread_id, m.sender_id, u.name as sender_name, u.role as sender_role, m.body, m.created_at
    from support_messages m join users u on u.id = m.sender_id
    where m.thread_id = ${threadId} order by m.created_at asc
  `;
  return rows.map((row) => ({ id: Number(row.id), threadId: Number(row.threadId), senderId: row.senderId,
    senderName: row.senderRole !== 'CLIENT' ? 'پشتیبانی دفتر' : row.senderName || 'موکل', senderRole: row.senderRole,
    body: row.body, createdAt: row.createdAt.toISOString() }));
}

export async function createSupportThread(subject: string, body: string): Promise<number> {
  const account = await requireAccount();
  if (account.role !== 'CLIENT') throw new Error('CLIENT_ONLY');
  return db.begin(async (tx) => {
    const [thread] = await tx<{ id: number | string }[]>`
      insert into support_threads (client_id, subject) values (${account.id}, ${subject}) returning id
    `;
    await tx`insert into support_messages (thread_id, sender_id, body) values (${thread.id}, ${account.id}, ${body})`;
    return Number(thread.id);
  });
}

export async function replySupportThread(threadId: number, body: string): Promise<void> {
  const account = await requireAccount();
  const [thread] = await db<{ clientId: string; status: SupportThreadStatus }[]>`
    select client_id, status from support_threads where id = ${threadId} limit 1
  `;
  if (!thread || (account.role === 'CLIENT' && thread.clientId !== account.id)) throw new Error('FORBIDDEN');
  if (thread.status === 'closed' && account.role === 'CLIENT') throw new Error('THREAD_CLOSED');
  await db.begin(async (tx) => {
    await tx`insert into support_messages (thread_id, sender_id, body) values (${threadId}, ${account.id}, ${body})`;
    await tx`update support_threads set status = ${account.role !== 'CLIENT' ? 'answered' : 'open'} where id = ${threadId}`;
  });
}

export async function setSupportThreadStatus(id: number, status: SupportThreadStatus): Promise<void> {
  await db`update support_threads set status = ${status} where id = ${id}`;
}
