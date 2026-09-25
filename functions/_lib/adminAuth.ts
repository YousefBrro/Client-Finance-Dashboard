import { parseCookie, verifySessionToken } from './session';
import type { Env } from './clients';
import { json } from './clients';

export async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = parseCookie(request.headers.get('cookie'), 'tibr_admin');
  return verifySessionToken(cookie, env.ADMIN_PASSWORD);
}

export const unauthorized = (): Response => json({ error: 'unauthorized' }, 401);
