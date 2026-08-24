import { db } from '@/lib/db';
import { requireAccount } from '@/lib/session';
import { deleteAsset, signedDownloadUrl, uploadAsset, type UploadedAsset } from '@/lib/storage/imagekit';
import type {
  SupportAttachment,
  SupportMessage,
  SupportThread,
  SupportThreadStatus,
  UserRole,
} from '@/types/content';

interface ThreadRow {
  id: number | string;
  clientId: string;
  clientName: string;
  subject: string;
  practiceArea: string | null;
  status: SupportThreadStatus;
  createdAt: Date;
  updatedAt: Date;
  lastMessage: string | null;
}

interface MessageRow {
  id: number | string;
  threadId: number | string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  body: string;
  createdAt: Date;
}

interface AttachmentRow {
  id: number | string;
  messageId: number | string;
  threadId: number | string;
  filePath: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | string | null;
  createdAt: Date;
}

function mapThread(row: ThreadRow): SupportThread {
  const createdAtIso = row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString();
  const updatedAtIso = row.updatedAt instanceof Date ? row.updatedAt.toISOString() : new Date(row.updatedAt).toISOString();
  return {
    id: Number(row.id),
    clientId: row.clientId,
    clientName: row.clientName || 'موکل',
    subject: row.subject,
    practiceArea: row.practiceArea,
    status: row.status,
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
    lastMessage: row.lastMessage,
  };
}

export async function getSupportThreads(): Promise<SupportThread[]> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<ThreadRow[]>`
        select t.*, u.name as client_name,
          (select m.body from support_messages m where m.thread_id = t.id order by m.created_at desc limit 1) as last_message
        from support_threads t left join users u on u.id = t.client_id
        order by
          case t.status when 'open' then 0 when 'answered' then 1 else 2 end,
          t.updated_at desc
      `
    : await db<ThreadRow[]>`
        select t.*, u.name as client_name,
          (select m.body from support_messages m where m.thread_id = t.id order by m.created_at desc limit 1) as last_message
        from support_threads t left join users u on u.id = t.client_id
        where t.client_id = ${account.id}
        order by
          case t.status when 'open' then 0 when 'answered' then 1 else 2 end,
          t.updated_at desc
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
  const [rows, attachmentRows] = await Promise.all([
    db<MessageRow[]>`
      select m.id, m.thread_id, m.sender_id, u.name as sender_name, u.role as sender_role, m.body, m.created_at
      from support_messages m join users u on u.id = m.sender_id
      where m.thread_id = ${threadId} order by m.created_at asc
    `,
    db<AttachmentRow[]>`
      select id, message_id, thread_id, file_path, file_name, mime_type, file_size, created_at
      from support_attachments where thread_id = ${threadId} order by created_at asc
    `,
  ]);

  const byMessage = new Map<number, SupportAttachment[]>();
  for (const row of attachmentRows) {
    const attachmentCreatedAt = row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString();
    const attachment: SupportAttachment = {
      id: Number(row.id),
      messageId: Number(row.messageId),
      threadId: Number(row.threadId),
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileSize: row.fileSize === null ? null : Number(row.fileSize),
      createdAt: attachmentCreatedAt,
      downloadUrl: signedDownloadUrl(row.filePath),
    };
    const list = byMessage.get(attachment.messageId) ?? [];
    list.push(attachment);
    byMessage.set(attachment.messageId, list);
  }

  return rows.map((row) => ({
    id: Number(row.id),
    threadId: Number(row.threadId),
    senderId: row.senderId,
    senderName: row.senderRole !== 'CLIENT' ? 'پشتیبانی دفتر' : row.senderName || 'موکل',
    senderRole: row.senderRole,
    body: row.body,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString(),
    attachments: byMessage.get(Number(row.id)) ?? [],
  }));
}

async function uploadSupportFiles(accountId: string, files: File[]): Promise<Array<{ asset: UploadedAsset; originalName: string; mimeType: string | null }>> {
  const uploaded: Array<{ asset: UploadedAsset; originalName: string; mimeType: string | null }> = [];
  try {
    for (const file of files) {
      const asset = await uploadAsset('private', file, {
        folder: `support/${accountId}`,
        fileName: file.name,
        description: 'پیوست گفت‌وگوی حقوقی خصوصی',
        tags: ['support', 'legal-consultation', 'private'],
      });
      uploaded.push({ asset, originalName: file.name.slice(0, 255), mimeType: file.type || null });
    }
    return uploaded;
  } catch (error) {
    await Promise.all(uploaded.map(({ asset }) => deleteAsset(asset.fileId).catch(() => undefined)));
    throw error;
  }
}

async function cleanupUploads(files: Array<{ asset: UploadedAsset }>) {
  await Promise.all(files.map(({ asset }) => deleteAsset(asset.fileId).catch(() => undefined)));
}

export async function createSupportThread(
  subject: string,
  body: string,
  practiceArea: string | null,
  files: File[] = [],
): Promise<number> {
  const account = await requireAccount();
  if (account.role !== 'CLIENT') throw new Error('CLIENT_ONLY');
  const uploaded = await uploadSupportFiles(account.id, files);
  try {
    return await db.begin(async (tx) => {
      const [thread] = await tx<{ id: number | string }[]>`
        insert into support_threads (client_id, subject, practice_area)
        values (${account.id}, ${subject}, ${practiceArea}) returning id
      `;
      const [message] = await tx<{ id: number | string }[]>`
        insert into support_messages (thread_id, sender_id, body)
        values (${thread.id}, ${account.id}, ${body}) returning id
      `;
      for (const item of uploaded) {
        await tx`
          insert into support_attachments (
            message_id, thread_id, uploaded_by, file_id, file_path, file_name, mime_type, file_size
          ) values (
            ${message.id}, ${thread.id}, ${account.id}, ${item.asset.fileId}, ${item.asset.filePath},
            ${item.originalName}, ${item.mimeType}, ${item.asset.size}
          )
        `;
      }
      return Number(thread.id);
    });
  } catch (error) {
    await cleanupUploads(uploaded);
    throw error;
  }
}

export async function replySupportThread(threadId: number, body: string, files: File[] = []): Promise<void> {
  const account = await requireAccount();
  const [thread] = await db<{ clientId: string; status: SupportThreadStatus }[]>`
    select client_id, status from support_threads where id = ${threadId} limit 1
  `;
  if (!thread || (account.role === 'CLIENT' && thread.clientId !== account.id)) throw new Error('FORBIDDEN');
  if (thread.status === 'closed' && account.role === 'CLIENT') throw new Error('THREAD_CLOSED');

  const uploaded = await uploadSupportFiles(account.id, files);
  try {
    await db.begin(async (tx) => {
      const [message] = await tx<{ id: number | string }[]>`
        insert into support_messages (thread_id, sender_id, body)
        values (${threadId}, ${account.id}, ${body}) returning id
      `;
      for (const item of uploaded) {
        await tx`
          insert into support_attachments (
            message_id, thread_id, uploaded_by, file_id, file_path, file_name, mime_type, file_size
          ) values (
            ${message.id}, ${threadId}, ${account.id}, ${item.asset.fileId}, ${item.asset.filePath},
            ${item.originalName}, ${item.mimeType}, ${item.asset.size}
          )
        `;
      }
      await tx`
        update support_threads
        set status = ${account.role !== 'CLIENT' ? 'answered' : 'open'}
        where id = ${threadId}
      `;
    });
  } catch (error) {
    await cleanupUploads(uploaded);
    throw error;
  }
}

export async function setSupportThreadStatus(id: number, status: SupportThreadStatus): Promise<void> {
  await db`update support_threads set status = ${status} where id = ${id}`;
}
