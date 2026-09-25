import { isValidToken, json } from '../../../_lib/clients';
import type { Env } from '../../../_lib/clients';
import { isAuthorized, unauthorized } from '../../../_lib/adminAuth';

/** DELETE: revoke a client's link immediately. */
export const onRequestDelete = async ({
  request,
  env,
  params,
}: {
  request: Request;
  env: Env;
  params: { token?: string | string[] };
}): Promise<Response> => {
  if (!(await isAuthorized(request, env))) return unauthorized();
  const token = params.token;
  if (!isValidToken(token)) return json({ error: 'bad-request' }, 400);

  await env.CLIENTS.delete(token);
  return json({ ok: true });
};
