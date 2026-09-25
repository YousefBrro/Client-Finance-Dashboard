/**
 * Server-side helpers (Cloudflare Pages Functions).
 * Client records live in a private KV namespace, never in the repository:
 *   key      = the private token in the client's link
 *   value    = { name, projectName, excelUrl, viewUrl? }  (excelUrl = OneDrive share link)
 *   metadata = { nameEn, nameAr, projectEn, projectAr }   (lets the admin panel list clients cheaply)
 */
export type Localized = string | { en: string; ar: string };

export interface ClientRecord {
  name: Localized;
  projectName: Localized;
  excelUrl: string;
  viewUrl?: string;
}

export interface ClientMetadata {
  nameEn: string;
  nameAr: string;
  projectEn: string;
  projectAr: string;
}

export interface KvListResult {
  keys: { name: string; metadata?: unknown }[];
  list_complete: boolean;
  cursor?: string;
}

export interface KvNamespace {
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { metadata?: unknown; expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { cursor?: string; limit?: number }): Promise<KvListResult>;
}

export interface Env {
  CLIENTS: KvNamespace;
  /** Cloudflare Pages secret. Missing in an environment means the admin panel is disabled there. */
  ADMIN_PASSWORD?: string;
}

export interface Ctx {
  request: Request;
  env: Env;
  params: { token?: string | string[] };
}

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

const BASE_HEADERS = {
  'cache-control': 'private, no-store',
  'x-robots-tag': 'noindex, nofollow',
  'x-content-type-options': 'nosniff',
} as const;

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...BASE_HEADERS, 'content-type': 'application/json; charset=utf-8' },
  });
}

/** Same response for "bad token" and "unknown token", so links cannot be probed. */
export const notFound = (): Response => json({ error: 'not-found' }, 404);

export function fileHeaders(lastModified: string | null): Headers {
  const headers = new Headers({
    ...BASE_HEADERS,
    'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  if (lastModified) headers.set('last-modified', lastModified);
  return headers;
}

export function isValidToken(token: unknown): token is string {
  return typeof token === 'string' && TOKEN_PATTERN.test(token);
}

export async function findClient(env: Env, token: unknown): Promise<ClientRecord | null> {
  if (!isValidToken(token)) return null;
  const record = await env.CLIENTS.get(token, 'json');
  if (!record || typeof record !== 'object') return null;
  const { name, projectName, excelUrl, viewUrl } = record as Partial<ClientRecord>;
  if (!name || !projectName || typeof excelUrl !== 'string') return null;
  const safeView = typeof viewUrl === 'string' && viewUrl.startsWith('https://') ? viewUrl : undefined;
  return { name, projectName, excelUrl, viewUrl: safeView };
}

/**
 * Turns a OneDrive "anyone with the link" URL into a direct-download URL.
 * Only OneDrive / SharePoint hosts are allowed.
 */
export function toDownloadUrl(shareUrl: string): string {
  const url = new URL(shareUrl);
  if (url.protocol !== 'https:') throw new Error('https required');
  const host = url.hostname.toLowerCase();

  if (host === '1drv.ms' || host === 'onedrive.live.com' || host === '1drv.com') {
    // Personal OneDrive: the public "shares" API accepts the base64url of the link.
    const encoded = btoa(shareUrl).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`;
  }
  if (host.endsWith('.sharepoint.com')) {
    // Microsoft 365 (work / school)
    url.searchParams.set('download', '1');
    return url.toString();
  }
  throw new Error('unsupported host');
}
