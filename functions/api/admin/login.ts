import { json } from '../../_lib/clients';
import type { Env } from '../../_lib/clients';
import { clearLockout, isLockedOut, recordFailedLogin } from '../../_lib/lockout';
import { createSessionToken, sessionCookieHeader, timingSafeEqual } from '../../_lib/session';

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.ADMIN_PASSWORD) return json({ error: 'not-configured' }, 500);
  if (await isLockedOut(env)) return json({ error: 'locked' }, 429);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad-request' }, 400);
  }
  const password =
    body && typeof body === 'object' && 'password' in body ? String((body as { password: unknown }).password) : '';

  const ok = password.length > 0 && (await timingSafeEqual(password, env.ADMIN_PASSWORD));
  if (!ok) {
    await recordFailedLogin(env);
    return json({ error: 'invalid' }, 401);
  }

  await clearLockout(env);
  const token = await createSessionToken(env.ADMIN_PASSWORD, SESSION_TTL_MS);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'private, no-store',
      'set-cookie': sessionCookieHeader(token, SESSION_TTL_MS / 1000),
    },
  });
};
