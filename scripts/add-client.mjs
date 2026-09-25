#!/usr/bin/env node
/**
 * Adds a client and prints their private link.
 *   npm run client:add -- --name-en "Al-Noor" --name-ar "النور" \
 *     --project-en "Retail" --project-ar "المتاجر" --url "https://1drv.ms/x/..."
 *   Optional: --show-excel (button uses the same link) or --view-url "<another view-only link>"
 */
import { randomBytes } from 'node:crypto';
import { parseArgs } from 'node:util';
import { namespaceId, wrangler } from './_wrangler.mjs';

const { values } = parseArgs({
  options: {
    'name-en': { type: 'string' },
    'name-ar': { type: 'string' },
    'project-en': { type: 'string' },
    'project-ar': { type: 'string' },
    url: { type: 'string' },
    'view-url': { type: 'string' },
    'show-excel': { type: 'boolean' },
  },
});

const required = ['name-en', 'name-ar', 'project-en', 'project-ar', 'url'];
const missing = required.filter((key) => !values[key]);
if (missing.length) {
  console.error(`Missing: ${missing.map((key) => `--${key}`).join(' ')}`);
  process.exit(1);
}

try {
  const parsed = new URL(values.url);
  if (parsed.protocol !== 'https:') throw new Error();
} catch {
  console.error('--url must be an https OneDrive share link.');
  process.exit(1);
}

const token = randomBytes(18).toString('base64url'); // 24 URL-safe characters
const record = {
  name: { en: values['name-en'], ar: values['name-ar'] },
  projectName: { en: values['project-en'], ar: values['project-ar'] },
  excelUrl: values.url,
};

// Optional "Open Excel" button: a separate view-only link, or the same link with --show-excel.
const viewUrl = values['view-url'] ?? (values['show-excel'] ? values.url : undefined);
if (viewUrl) record.viewUrl = viewUrl;

const metadata = {
  nameEn: values['name-en'],
  nameAr: values['name-ar'],
  projectEn: values['project-en'],
  projectAr: values['project-ar'],
  hasExcelButton: Boolean(viewUrl),
};

wrangler([
  'kv', 'key', 'put', token, JSON.stringify(record),
  `--namespace-id=${namespaceId()}`,
  `--metadata=${JSON.stringify(metadata)}`,
  '--remote',
]);

const site = (process.env.SITE_URL || 'https://YOUR-SITE.pages.dev').replace(/\/$/, '');
console.log(`\nPrivate link for ${values['name-en']}:\n${site}/c/${token}\n`);
