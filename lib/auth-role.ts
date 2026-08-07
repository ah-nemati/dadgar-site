import type { UserRole } from '@/types/content';

/**
 * Resolve a role from Auth0 claims without touching the database.
 * A null result means the database profile remains authoritative.
 */
export function roleFromAuth0Identity(user: unknown): UserRole | null {
  if (!user || typeof user !== 'object') return null;

  const identity = user as Record<string, unknown>;
  const namespace = (process.env.AUTH0_ROLE_CLAIM_NAMESPACE || 'https://dadgar.example.com').replace(/\/$/, '');
  const claim = identity[`${namespace}/role`];
  if (claim === 'admin' || claim === 'client') return claim;

  const email = String(identity.email || '').trim().toLowerCase();
  if (!email) return null;

  const admins = (process.env.AUTH0_ADMIN_EMAILS || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return admins.includes(email) ? 'admin' : null;
}
