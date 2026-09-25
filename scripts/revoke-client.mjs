#!/usr/bin/env node
/** npm run client:revoke -- <token>   (the link stops working immediately) */
import { namespaceId, wrangler } from './_wrangler.mjs';

const token = process.argv[2];
if (!token) {
  console.error('Usage: npm run client:revoke -- <token>');
  process.exit(1);
}
wrangler(['kv', 'key', 'delete', token, `--namespace-id=${namespaceId()}`, '--remote']);
console.log('Revoked.');
