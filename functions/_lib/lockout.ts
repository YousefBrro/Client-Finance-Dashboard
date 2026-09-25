import type { Env } from './clients';

/** Internal KV key. Excluded from the client listing by its `__` prefix. */
const LOCK_KEY = '__admin_login_lockout__';
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000;

interface LockState {
  count: number;
  resetAt: number;
}

async function readLock(env: Env): Promise<LockState> {
  const raw = await env.CLIENTS.get(LOCK_KEY, 'json');
  const now = Date.now();
  if (raw && typeof raw === 'object' && typeof (raw as LockState).resetAt === 'number' && (raw as LockState).resetAt > now) {
    return raw as LockState;
  }
  return { count: 0, resetAt: now + WINDOW_MS };
}

export async function isLockedOut(env: Env): Promise<boolean> {
  const lock = await readLock(env);
  return lock.count >= MAX_ATTEMPTS && lock.resetAt > Date.now();
}

export async function recordFailedLogin(env: Env): Promise<void> {
  const lock = await readLock(env);
  const next: LockState = { count: lock.count + 1, resetAt: lock.resetAt };
  const ttl = Math.max(60, Math.ceil((next.resetAt - Date.now()) / 1000) + 5);
  await env.CLIENTS.put(LOCK_KEY, JSON.stringify(next), { expirationTtl: ttl });
}

export async function clearLockout(env: Env): Promise<void> {
  await env.CLIENTS.delete(LOCK_KEY).catch(() => undefined);
}
