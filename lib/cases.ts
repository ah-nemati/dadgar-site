
import { createClient } from '@/lib/supabase/server';
import type {
  CaseStatus,
  CaseUpdate,
  ClientCase,
  ClientDocument,
} from '@/types/content';

interface CaseRow {
  id: number;
  client_id: string;
  case_number: string;
  title: string;
  court: string | null;
  status: CaseStatus;
  description: string | null;
  next_action: string | null;
  next_action_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UpdateRow {
  id: number;
  case_id: number;
  title: string;
  body: string;
  created_at: string;
}

interface DocumentRow {
  id: number;
  case_id: number;
  client_id: string;
  title: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
}

async function clientNameMap(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (ids.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('id, full_name').in('id', ids);
  for (const row of data ?? []) map.set(row.id, row.full_name || 'بدون نام');
  return map;
}

function toCase(row: CaseRow, names: Map<string, string>): ClientCase {
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: names.get(row.client_id) ?? 'موکل',
    caseNumber: row.case_number,
    title: row.title,
    court: row.court,
    status: row.status,
    description: row.description,
    nextAction: row.next_action,
    nextActionAt: row.next_action_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCases(): Promise<ClientCase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('client_cases')
    .select()
    .order('updated_at', { ascending: false });

  if (error) throw error;
  const rows = data as CaseRow[];
  const names = await clientNameMap(Array.from(new Set(rows.map((row) => row.client_id))));
  return rows.map((row) => toCase(row, names));
}

export async function getCaseById(id: number): Promise<ClientCase | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('client_cases')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const row = data as CaseRow;
  const names = await clientNameMap([row.client_id]);
  return toCase(row, names);
}

export interface CaseInput {
  clientId: string;
  caseNumber: string;
  title: string;
  court: string | null;
  status: CaseStatus;
  description: string | null;
  nextAction: string | null;
  nextActionAt: string | null;
}

function caseInputRow(input: CaseInput) {
  return {
    client_id: input.clientId,
    case_number: input.caseNumber,
    title: input.title,
    court: input.court,
    status: input.status,
    description: input.description,
    next_action: input.nextAction,
    next_action_at: input.nextActionAt,
  };
}

export async function createCase(input: CaseInput): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('client_cases')
    .insert(caseInputRow(input))
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateCase(id: number, input: CaseInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('client_cases')
    .update(caseInputRow(input))
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCase(id: number): Promise<void> {
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from('client_documents')
    .select('file_path')
    .eq('case_id', id);

  if (documents?.length) {
    await supabase.storage
      .from('client-documents')
      .remove(documents.map((document: { file_path: string }) => document.file_path));
  }

  const { error } = await supabase.from('client_cases').delete().eq('id', id);
  if (error) throw error;
}

export async function getCaseUpdates(caseId: number): Promise<CaseUpdate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('case_updates')
    .select()
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as UpdateRow[]).map((row) => ({
    id: row.id,
    caseId: row.case_id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function addCaseUpdate(caseId: number, title: string, body: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('case_updates')
    .insert({ case_id: caseId, title, body });

  if (error) throw error;
}

export async function deleteCaseUpdate(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('case_updates').delete().eq('id', id);
  if (error) throw error;
}

export async function getCaseDocuments(caseId: number): Promise<ClientDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('client_documents')
    .select()
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return Promise.all(
    (data as DocumentRow[]).map(async (row) => {
      const { data: signed } = await supabase.storage
        .from('client-documents')
        .createSignedUrl(row.file_path, 60 * 60);

      return {
        id: row.id,
        caseId: row.case_id,
        clientId: row.client_id,
        title: row.title,
        filePath: row.file_path,
        fileName: row.file_name,
        mimeType: row.mime_type,
        fileSize: row.file_size,
        createdAt: row.created_at,
        downloadUrl: signed?.signedUrl,
      };
    })
  );
}

export async function uploadCaseDocument(
  caseId: number,
  clientId: string,
  title: string,
  file: File
): Promise<void> {
  if (!file.name || file.size === 0) throw new Error('EMPTY_FILE');
  if (file.size > 10 * 1024 * 1024) throw new Error('FILE_TOO_LARGE');

  const supabase = await createClient();
  const safeName = file.name.replace(/[^\p{L}\p{N}._-]+/gu, '-');
  const path = `${clientId}/${caseId}/${crypto.randomUUID()}-${safeName}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('client-documents')
    .upload(path, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from('client_documents').insert({
    case_id: caseId,
    client_id: clientId,
    title,
    file_path: path,
    file_name: file.name,
    mime_type: file.type || null,
    file_size: file.size,
  });

  if (dbError) {
    await supabase.storage.from('client-documents').remove([path]);
    throw dbError;
  }
}

export async function deleteCaseDocument(id: number): Promise<void> {
  const supabase = await createClient();
  const { data: document, error: readError } = await supabase
    .from('client_documents')
    .select('file_path')
    .eq('id', id)
    .single();

  if (readError) throw readError;
  const { error } = await supabase.from('client_documents').delete().eq('id', id);
  if (error) throw error;
  await supabase.storage.from('client-documents').remove([document.file_path]);
}
