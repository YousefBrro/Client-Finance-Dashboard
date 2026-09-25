import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url));

export function namespaceId() {
  const id = process.env.KV_NAMESPACE_ID;
  if (!id) {
    console.error('Missing KV_NAMESPACE_ID. Copy .env.example to .env.local and fill it in.');
    process.exit(1);
  }
  return id;
}

/** Runs wrangler without a shell, so JSON arguments need no quoting on any OS. */
export function wrangler(args, { capture = false } = {}) {
  return execFileSync(process.execPath, [bin, ...args], {
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
  });
}
