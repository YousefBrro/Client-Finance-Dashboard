import { normalizeText } from '@/lib/text';
import type { CurrencyCode, CurrencySummary, Transaction, TransactionFilters } from '@/types';

const DAY_MS = 86_400_000;
const SERIES_POINTS = 30;

function isoToUtc(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Direction of a row. If both columns are filled, the net movement decides. */
export function getMovement(tx: Transaction): { direction: 'in' | 'out'; amount: number } {
  const net = tx.incoming - tx.outgoing;
  return { direction: net >= 0 ? 'in' : 'out', amount: Math.abs(net) };
}

/**
 * Per-currency totals. Currencies are never combined.
 * Expects `transactions` sorted newest first (as returned by the data service).
 */
export function summarizeCurrency(
  transactions: readonly Transaction[],
  currency: CurrencyCode,
): CurrencySummary {
  const rows = transactions.filter((tx) => tx.currency === currency).reverse();

  let balance = 0;
  const running: number[] = [];
  for (const tx of rows) {
    balance += tx.incoming - tx.outgoing;
    running.push(round2(balance));
  }

  let changePct: number | null = null;
  const last = rows.at(-1);
  if (last) {
    const cutoff = isoToUtc(last.date) - 30 * DAY_MS;
    let before = 0;
    let recentNet = 0;
    for (const tx of rows) {
      const net = tx.incoming - tx.outgoing;
      if (isoToUtc(tx.date) < cutoff) before += net;
      else recentNet += net;
    }
    if (before > 0) changePct = (recentNet / before) * 100;
  }

  const series = running.slice(-SERIES_POINTS);
  return {
    currency,
    balance: round2(balance),
    changePct,
    series: series.length >= 2 ? series : [],
  };
}

export function filterTransactions(
  transactions: readonly Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const query = normalizeText(filters.q);
  return transactions.filter((tx) => {
    if (filters.currency !== 'all' && tx.currency !== filters.currency) return false;
    if (filters.type !== 'all' && tx.type !== filters.type) return false;
    if (!query) return true;
    const haystack = normalizeText(
      `${tx.description} ${tx.date} ${tx.incoming || ''} ${tx.outgoing || ''} ${tx.currency}`,
    );
    return haystack.includes(query);
  });
}
