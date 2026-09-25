#!/usr/bin/env node
import { namespaceId, wrangler } from './_wrangler.mjs';

const id = namespaceId();
const site = (process.env.SITE_URL || 'https://YOUR-SITE.pages.dev').replace(/\/$/, '');
const output = wrangler(['kv', 'key', 'list', `--namespace-id=${id}`, '--remote'], { capture: true });
const keys = JSON.parse(output.slice(output.indexOf('[')));

for (const { name: token } of keys) {
  const raw = wrangler(['kv', 'key', 'get', token, `--namespace-id=${id}`, '--remote'], { capture: true });
  const record = JSON.parse(raw);
  const label = typeof record.name === 'string' ? record.name : record.name.en;
  console.log(`${label}\n  ${site}/c/${token}`);
}
if (keys.length === 0) console.log('No clients yet.');
