import { db } from '@/lib/db';
import { deleteAsset, signedDownloadUrl, uploadAsset } from '@/lib/storage/imagekit';
import { requireAccount } from '@/lib/session';
import type { CaseStatus, CaseUpdate, ClientCase, ClientDocument } from '@/types/content';

interface CaseRow {
  id: number | string;
  clientId: string;
  clientName: string;
  caseNumber: string;
  title: string;
  court: string | null;
  status: CaseStatus;
  description: string | null;
  nextAction: string | null;
  nextActionAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
interface UpdateRow { id: number | string; caseId: number | string; title: string; body: string; createdAt: Date }
interface DocumentRow {
  id: number | string; caseId: number | string; clientId: string; title: string; fileId: string | null; filePath: string;
  fileName: string; mimeType: string | null; fileSize: number | string | null; createdAt: Date;
}

function toCase(row: CaseRow): ClientCase {
  return {
    id: Number(row.id), clientId: row.clientId, clientName: row.clientName || 'موکل',
    caseNumber: row.caseNumber, title: row.title, court: row.court, status: row.status,
    description: row.description, nextAction: row.nextAction,
    nextActionAt: row.nextActionAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getCases(): Promise<ClientCase[]> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<CaseRow[]>`
        select c.*, u.name as client_name
        from client_cases c join users u on u.id = c.client_id
        order by c.updated_at desc
      `
    : await db<CaseRow[]>`
        select c.*, u.name as client_name
        from client_cases c join users u on u.id = c.client_id
        where c.client_id = ${account.id}
        order by c.updated_at desc
      `;
  return rows.map(toCase);
}

export async function getCaseById(id: number): Promise<ClientCase | null> {
  const account = await requireAccount();
  const rows = account.role !== 'CLIENT'
    ? await db<CaseRow[]>`
        select c.*, u.name as client_name
        from client_cases c join users u on u.id = c.client_id
        where c.id = ${id} limit 1
      `
    : await db<CaseRow[]>`
        select c.*, u.name as client_name
        from client_cases c join users u on u.id = c.client_id
        where c.id = ${id} and c.client_id = ${account.id} limit 1
      `;
  return rows[0] ? toCase(rows[0]) : null;
}

export interface CaseInput {
  clientId: string; caseNumber: string; title: string; court: string | null; status: CaseStatus;
  description: string | null; nextAction: string | null; nextActionAt: string | null;
}

export async function createCase(input: CaseInput): Promise<number> {
  const [row] = await db<{ id: number | string }[]>`
    insert into client_cases (client_id, case_number, title, court, status, description, next_action, next_action_at)
    values (${input.clientId}, ${input.caseNumber}, ${input.title}, ${input.court}, ${input.status},
            ${input.description}, ${input.nextAction}, ${input.nextActionAt})
    returning id
  `;
  return Number(row.id);
}

export async function updateCase(id: number, input: CaseInput): Promise<void> {
  await db`
    update client_cases set client_id = ${input.clientId}, case_number = ${input.caseNumber},
      title = ${input.title}, court = ${input.court}, status = ${input.status},
      description = ${input.description}, next_action = ${input.nextAction}, next_action_at = ${input.nextActionAt}
    where id = ${id}
  `;
}

export async function deleteCase(id: number): Promise<void> {
  const docs = await db<{ fileId: string | null }[]>`select file_id from client_documents where case_id = ${id}`;
  await db`delete from client_cases where id = ${id}`;
  await Promise.allSettled(docs.map((doc) => deleteAsset(doc.fileId)));
}

export async function getCaseUpdates(caseId: number): Promise<CaseUpdate[]> {
  if (!(await getCaseById(caseId))) return [];
  const rows = await db<UpdateRow[]>`
    select id, case_id, title, body, created_at from case_updates
    where case_id = ${caseId} order by created_at desc
  `;
  return rows.map((row) => ({ id: Number(row.id), caseId: Number(row.caseId), title: row.title, body: row.body, createdAt: row.createdAt.toISOString() }));
}

export async function addCaseUpdate(caseId: number, title: string, body: string): Promise<void> {
  await db`insert into case_updates (case_id, title, body) values (${caseId}, ${title}, ${body})`;
}

export async function deleteCaseUpdate(id: number): Promise<void> {
  await db`delete from case_updates where id = ${id}`;
}

export async function getCaseDocuments(caseId: number): Promise<ClientDocument[]> {
  if (!(await getCaseById(caseId))) return [];
  const rows = await db<DocumentRow[]>`
    select id, case_id, client_id, title, file_id, file_path, file_name, mime_type, file_size, created_at
    from client_documents where case_id = ${caseId} order by created_at desc
  `;
  return Promise.all(rows.map(async (row) => ({
    id: Number(row.id), caseId: Number(row.caseId), clientId: row.clientId, title: row.title,
    fileId: row.fileId, filePath: row.filePath, fileName: row.fileName, mimeType: row.mimeType,
    fileSize: row.fileSize === null ? null : Number(row.fileSize), createdAt: row.createdAt.toISOString(),
    downloadUrl: row.fileId ? signedDownloadUrl(row.filePath) : undefined,
  })));
}

export async function uploadCaseDocument(caseId: number, clientId: string, title: string, file: File): Promise<void> {
  if (!file.name || file.size === 0) throw new Error('EMPTY_FILE');
  if (file.size > 10 * 1024 * 1024) throw new Error('FILE_TOO_LARGE');
  const safeName = file.name.replace(/[^\p{L}\p{N}._-]+/gu, '-');
  const safeClientId = clientId.replace(/[^\p{L}\p{N}_-]+/gu, '-');
  const uploaded = await uploadAsset('private', file, {
    fileName: safeName,
    folder: `${safeClientId}/cases/${caseId}`,
    description: title,
    tags: ['client-document', `case-${caseId}`],
  });

  try {
    await db`
      insert into client_documents (
        case_id, client_id, title, file_id, file_path, file_name, mime_type, file_size
      ) values (
        ${caseId}, ${clientId}, ${title}, ${uploaded.fileId}, ${uploaded.filePath},
        ${file.name}, ${file.type || null}, ${file.size}
      )
    `;
  } catch (error) {
    await deleteAsset(uploaded.fileId).catch(() => undefined);
    throw error;
  }
}

export async function deleteCaseDocument(id: number): Promise<void> {
  const [doc] = await db<{ fileId: string | null }[]>`
    delete from client_documents where id = ${id} returning file_id
  `;
  await deleteAsset(doc?.fileId);
}
