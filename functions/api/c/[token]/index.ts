import { findClient, json, notFound } from '../../../_lib/clients';
import type { Ctx } from '../../../_lib/clients';

/** GET /api/c/:token -> the client's display info (never the OneDrive link). */
export const onRequestGet = async ({ env, params }: Ctx): Promise<Response> => {
  const record = await findClient(env, params.token);
  if (!record) return notFound();
  return json({ name: record.name, projectName: record.projectName, viewUrl: record.viewUrl });
};
