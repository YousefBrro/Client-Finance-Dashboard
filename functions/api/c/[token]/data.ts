import { fileHeaders, findClient, json, notFound, toDownloadUrl } from '../../../_lib/clients';
import type { Ctx } from '../../../_lib/clients';

/** GET /api/c/:token/data -> the client's Excel file, fetched from OneDrive on demand. */
export const onRequestGet = async ({ env, params }: Ctx): Promise<Response> => {
  const record = await findClient(env, params.token);
  if (!record) return notFound();

  let target: string;
  try {
    target = toDownloadUrl(record.excelUrl);
  } catch {
    return json({ error: 'bad-config' }, 500);
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; Tibr/1.0)' },
    });
  } catch {
    return json({ error: 'upstream' }, 502);
  }

  const type = upstream.headers.get('content-type') ?? '';
  // A sign-in or preview page instead of the file means the share link is not "anyone with the link".
  if (!upstream.ok || type.includes('text/html')) return json({ error: 'upstream' }, 502);

  return new Response(upstream.body, { headers: fileHeaders(upstream.headers.get('last-modified')) });
};
