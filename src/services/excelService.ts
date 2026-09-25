/**
 * Excel adapter. Turns a workbook into the app's own `Transaction` shape.
 * Nothing outside `services/` knows Excel is involved.
 *
 * Accepted columns (English or Arabic headers, any order):
 *   Date | Description | Type | Currency | Incoming | Outgoing
 */
import { normalizeText } from '@/lib/text';
import type { ClientDataset, CurrencyCode, OperationType, Transaction } from '@/types';
import { DataError } from './dataError';

type XlsxModule = typeof import('xlsx');
type Field = 'date' | 'description' | 'type' | 'currency' | 'incoming' | 'outgoing';
type ColumnMap = Partial<Record<Field, number>>;

const FIELDS: Field[] = ['date', 'description', 'type', 'currency', 'incoming', 'outgoing'];
const norm = normalizeText;
const toSet = (list: string[]) => new Set(list.map(norm));

const HEADER_ALIASES: Record<Field, Set<string>> = {
  date: toSet(['date', 'التاريخ', 'تاريخ']),
  description: toSet(['description', 'details', 'notes', 'البيان', 'الوصف', 'التفاصيل', 'بيان']),
  type: toSet(['type', 'operation', 'operation type', 'نوع العملية', 'النوع', 'العملية', 'نوع']),
  currency: toSet(['currency', 'العملة', 'عملة']),
  incoming: toSet(['incoming', 'in', 'credit', 'وارد', 'الوارد', 'دخل', 'له']),
  outgoing: toSet(['outgoing', 'out', 'debit', 'صادر', 'الصادر', 'خرج', 'عليه']),
};

function buildLookup<T extends string>(source: Record<T, string[]>): Map<string, T> {
  const map = new Map<string, T>();
  (Object.keys(source) as T[]).forEach((key) => {
    source[key].forEach((alias) => map.set(norm(alias), key));
  });
  return map;
}

const TYPE_LOOKUP = buildLookup<OperationType>({
  capital: ['capital', 'رأس مال', 'رأس المال', 'راس المال', 'رأسمال'],
  payment: ['payment', 'دفعة', 'دفع', 'مصروف', 'مدفوعات'],
  exchange: ['exchange', 'صرف', 'تصريف', 'مصارفة', 'تحويل عملة'],
});

const CURRENCY_LOOKUP = buildLookup<CurrencyCode>({
  SYP: ['syp', 'ل.س', 'ليرة', 'ليرة سورية', 'sp', 's£'],
  USD: ['usd', '$', 'دولار', 'دولار أمريكي', 'دولار امريكي'],
  EUR: ['eur', '€', 'يورو'],
});

const SHEET_NAMES = toSet(['transactions', 'العمليات', 'الحركات']);
const HEADER_SCAN_ROWS = 10;

const pad = (n: number) => String(n).padStart(2, '0');

function toIso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseDateCell(value: unknown, XLSX: XlsxModule): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const parts = XLSX.SSF.parse_date_code(value);
    return parts ? toIso(parts.y, parts.m, parts.d) : null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toIso(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }
  if (typeof value === 'string') {
    const text = value.trim();
    const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(text);
    if (iso) return toIso(Number(iso[1]), Number(iso[2]), Number(iso[3]));
    // Day-first, e.g. 18/09/2026
    const dmy = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(text);
    if (dmy) return toIso(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));
  }
  return null;
}

function parseAmount(value: unknown): number {
  let n = 0;
  if (typeof value === 'number') {
    n = value;
  } else if (typeof value === 'string') {
    const cleaned = value
      .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
      .replace(/[,\s\u066c]/g, '')
      .replace(/[^\d.-]/g, '');
    n = Number.parseFloat(cleaned);
  }
  return Number.isFinite(n) ? Math.round(Math.abs(n) * 100) / 100 : 0;
}

const cellText = (value: unknown): string => (value == null ? '' : String(value));

function detectColumns(row: unknown[]): ColumnMap {
  const map: ColumnMap = {};
  row.forEach((cell, index) => {
    const key = norm(cellText(cell));
    if (!key) return;
    for (const field of FIELDS) {
      if (map[field] === undefined && HEADER_ALIASES[field].has(key)) map[field] = index;
    }
  });
  return map;
}

function hasRequiredColumns(map: ColumnMap): boolean {
  return (
    map.date !== undefined &&
    map.currency !== undefined &&
    (map.incoming !== undefined || map.outgoing !== undefined)
  );
}

export interface ParsedWorkbook {
  transactions: Transaction[];
  skippedRows: number;
}

export async function parseWorkbook(buffer: ArrayBuffer): Promise<ParsedWorkbook> {
  const XLSX = await import('xlsx');

  let workbook: ReturnType<XlsxModule['read']>;
  try {
    workbook = XLSX.read(buffer, { type: 'array' });
  } catch {
    throw new DataError('format');
  }

  const sheetName =
    workbook.SheetNames.find((name) => SHEET_NAMES.has(norm(name))) ?? workbook.SheetNames[0];
  const sheet = sheetName ? workbook.Sheets[sheetName] : undefined;
  if (!sheet) throw new DataError('format');

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: false,
  });

  let headerIndex = -1;
  let columns: ColumnMap = {};
  for (let i = 0; i < Math.min(rows.length, HEADER_SCAN_ROWS); i += 1) {
    const candidate = detectColumns(rows[i] ?? []);
    if (hasRequiredColumns(candidate)) {
      headerIndex = i;
      columns = candidate;
      break;
    }
  }
  if (headerIndex === -1) throw new DataError('format');

  const read = (row: unknown[], field: Field): unknown => {
    const index = columns[field];
    return index === undefined ? null : row[index];
  };

  const transactions: Transaction[] = [];
  let skippedRows = 0;

  rows.slice(headerIndex + 1).forEach((row, offset) => {
    if (row.every((cell) => cellText(cell).trim() === '')) return;

    const date = parseDateCell(read(row, 'date'), XLSX);
    const currency = CURRENCY_LOOKUP.get(norm(cellText(read(row, 'currency'))));
    const incoming = parseAmount(read(row, 'incoming'));
    const outgoing = parseAmount(read(row, 'outgoing'));

    if (!date || !currency || (incoming === 0 && outgoing === 0)) {
      skippedRows += 1;
      return;
    }

    const type =
      TYPE_LOOKUP.get(norm(cellText(read(row, 'type')))) ??
      (incoming >= outgoing ? 'capital' : 'payment');

    transactions.push({
      id: `tx-${headerIndex + 2 + offset}`,
      date,
      description: cellText(read(row, 'description')).trim(),
      type,
      currency,
      incoming,
      outgoing,
    });
  });

  // Newest first; later rows win on the same date.
  const order = new Map(transactions.map((tx, index) => [tx.id, index]));
  transactions.sort(
    (a, b) => b.date.localeCompare(a.date) || (order.get(b.id) ?? 0) - (order.get(a.id) ?? 0),
  );

  return { transactions, skippedRows };
}

function headerDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export async function loadExcelDataset(url: string): Promise<ClientDataset> {
  let response: Response;
  try {
    response = await fetch(url, { cache: 'no-cache' });
  } catch {
    throw new DataError('network');
  }
  if (response.status === 404) throw new DataError('not-found');
  if (!response.ok) throw new DataError('network');
  // Dev servers return index.html for unknown paths.
  if ((response.headers.get('content-type') ?? '').includes('text/html')) {
    throw new DataError('not-found');
  }

  const parsed = await parseWorkbook(await response.arrayBuffer());
  const lastUpdate =
    headerDate(response.headers.get('last-modified')) ?? parsed.transactions[0]?.date ?? null;

  return { ...parsed, lastUpdate };
}
