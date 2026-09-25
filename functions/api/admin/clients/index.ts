import { json } from '../../../_lib/clients';
import type { ClientMetadata, ClientRecord, Env } from '../../../_lib/clients';
import { isAuthorized, unauthorized } from '../../../_lib/adminAuth';

interface ClientSummary extends ClientMetadata {
  token: string;
  hasExcelButton: boolean;
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18)); // 24 URL-safe characters
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const bad = (message: string) => json({ error: 'bad-request', message }, 400);

/** GET: list every client. Uses KV metadata so this stays cheap even with many clients. */
export const onRequestGet = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!(await isAuthorized(request, env))) return unauthorized();

  const items: ClientSummary[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.CLIENTS.list({ cursor, limit: 1000 });
    for (const key of page.keys) {
      if (key.name.startsWith('__')) continue; // internal keys (e.g. the login lockout counter)
      const meta = (key.metadata ?? {}) as Partial<ClientMetadata & { hasExcelButton: boolean }>;
      items.push({
        token: key.name,
        nameEn: meta.nameEn ?? '',
        nameAr: meta.nameAr ?? '',
        projectEn: meta.projectEn ?? '',
        projectAr: meta.projectAr ?? '',
        hasExcelButton: meta.hasExcelButton === true,
      });
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  items.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  return json({ items });
};

/** POST: create a new client and return their private token. */
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!(await isAuthorized(request, env))) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('invalid JSON');
  }
  if (typeof body !== 'object' || body === null) return bad('invalid body');
  const b = body as Record<string, unknown>;

  const nameEn = text(b.nameEn);
  const nameAr = text(b.nameAr);
  const projectEn = text(b.projectEn);
  const projectAr = text(b.projectAr);
  const excelUrl = text(b.url);
  const viewUrl = text(b.viewUrl);

  if (!nameEn || !nameAr || !projectEn || !projectAr) return bad('all name and project fields are required');
  if (!isHttpsUrl(excelUrl)) return bad('url must be an https link');
  if (viewUrl && !isHttpsUrl(viewUrl)) return bad('viewUrl must be an https link');

  const token = randomToken();
  const record: ClientRecord = {
    name: { en: nameEn, ar: nameAr },
    projectName: { en: projectEn, ar: projectAr },
    excelUrl,
    ...(viewUrl ? { viewUrl } : {}),
  };
  const metadata: ClientMetadata & { hasExcelButton: boolean } = {
    nameEn,
    nameAr,
    projectEn,
    projectAr,
    hasExcelButton: Boolean(viewUrl),
  };

  await env.CLIENTS.put(token, JSON.stringify(record), { metadata });
  return json({ token }, 201);
};
