import { db } from '@/lib/db';

export interface AuditLogItem {
  id: number;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface Row { id: number|string; actorName: string|null; actorEmail: string|null; action: string; entityType: string; entityId: string|null; metadata: Record<string, unknown>; createdAt: Date; }

export async function getAuditLogs(limit = 100): Promise<AuditLogItem[]> {
  const rows = await db<Row[]>`
    select a.id, u.name as actor_name, u.email as actor_email, a.action, a.entity_type,
           a.entity_id, a.metadata, a.created_at
    from audit_logs a
    left join users u on u.id = a.actor_id
    order by a.created_at desc
    limit ${Math.max(1, Math.min(limit, 250))}
  `;
  return rows.map((row) => ({ id: Number(row.id), actorName: row.actorName, actorEmail: row.actorEmail, action: row.action, entityType: row.entityType, entityId: row.entityId, metadata: row.metadata ?? {}, createdAt: row.createdAt.toISOString() }));
}

export async function recordAudit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId?: string | number | null,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await db`
      insert into audit_logs (actor_id, action, entity_type, entity_id, metadata)
      values (${actorId}, ${action}, ${entityType}, ${entityId == null ? null : String(entityId)}, ${JSON.stringify(metadata)}::jsonb)
    `;
  } catch {
    // Audit logging must not turn a successful user action into a failed request.
  }
}
