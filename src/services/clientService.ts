import { clients as demoClients } from '@/data/clients';
import type { ClientConfig, Localized } from '@/types';

export type ClientLookup =
  | { status: 'found'; client: ClientConfig }
  | { status: 'missing' }
  | { status: 'error' };

const api = (path: string) => `${import.meta.env.BASE_URL}api/c/${path}`;

/**
 * Resolves the private token from the URL into a client.
 * Production: asks the private API (Cloudflare Function + KV). Nothing is stored in the repo.
 * Development: uses the fake demo clients so the UI works without a backend.
 */
export async function resolveClient(token: string): Promise<ClientLookup> {
  if (import.meta.env.DEV) {
    const demo = demoClients.find((client) => client.id === token);
    return demo ? { status: 'found', client: demo } : { status: 'missing' };
  }

  try {
    const response = await fetch(api(encodeURIComponent(token)), { cache: 'no-store' });
    if (response.status === 404) return { status: 'missing' };
    if (!response.ok) return { status: 'error' };
    const profile = (await response.json()) as {
      name: Localized;
      projectName: Localized;
      viewUrl?: string;
    };
    return {
      status: 'found',
      client: {
        id: token,
        name: profile.name,
        projectName: profile.projectName,
        excelUrl: api(`${encodeURIComponent(token)}/data`),
        excelViewUrl: profile.viewUrl,
      },
    };
  } catch {
    return { status: 'error' };
  }
}

/** Dev-only convenience for the root URL. */
export function getDefaultClient(): ClientConfig {
  const [first] = demoClients;
  if (!first) throw new Error('No demo clients configured');
  return first;
}
