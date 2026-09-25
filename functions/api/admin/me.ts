import { json } from '../../_lib/clients';
import type { Env } from '../../_lib/clients';
import { isAuthorized, unauthorized } from '../../_lib/adminAuth';

/** Lets the admin page check, on load, whether the saved session is still valid. */
export const onRequestGet = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!(await isAuthorized(request, env))) return unauthorized();
  return json({ ok: true });
};
