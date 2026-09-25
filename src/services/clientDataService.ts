/**
 * The only data entry point the UI uses.
 * To move from Excel to an API / OneDrive / backend, change the loader below —
 * components, hooks and types stay untouched.
 */
import type { ClientConfig, ClientDataset } from '@/types';
import { DataError } from './dataError';
import { loadExcelDataset } from './excelService';

const cache = new Map<string, Promise<ClientDataset>>();

export function loadClientData(
  client: ClientConfig,
  options: { force?: boolean } = {},
): Promise<ClientDataset> {
  if (options.force) cache.delete(client.id);

  let request = cache.get(client.id);
  if (!request) {
    request = loadExcelDataset(client.excelUrl).catch((error: unknown) => {
      cache.delete(client.id);
      throw error instanceof DataError ? error : new DataError('unknown');
    });
    cache.set(client.id, request);
  }
  return request;
}
