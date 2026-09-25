import { clearSessionCookieHeader } from '../../_lib/session';

export const onRequestPost = async (): Promise<Response> =>
  new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'private, no-store',
      'set-cookie': clearSessionCookieHeader(),
    },
  });
