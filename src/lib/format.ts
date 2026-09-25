import { currencyMeta } from '@/data/currencies';
import type { CurrencyCode, Language } from '@/types';

/** Latin digits in both languages so figures match the Excel file. */
function numberLocale(lang: Language): string {
  return lang === 'ar' ? 'ar-u-nu-latn' : 'en-US';
}

function dateLocale(lang: Language): string {
  return lang === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-US';
}

const numberFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getNumberFormatter(lang: Language, decimals: number): Intl.NumberFormat {
  const key = `${lang}:${decimals}`;
  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(numberLocale(lang), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    numberFormatters.set(key, formatter);
  }
  return formatter;
}

export function formatMoney(
  value: number,
  currency: CurrencyCode,
  lang: Language,
  options: { signed?: boolean } = {},
): string {
  const meta = currencyMeta[currency];
  const sign = value < 0 ? '\u2212' : options.signed && value > 0 ? '+' : '';
  const amount = getNumberFormatter(lang, meta.decimals).format(Math.abs(value));
  const symbol = meta.symbol[lang];
  return `${sign}${symbol}\u00a0${amount}`;
}

export function formatPercent(value: number, lang: Language): string {
  if (Math.abs(value) > 999) return value > 0 ? '>999%' : '<\u2212999%';
  const sign = value > 0 ? '+' : value < 0 ? '\u2212' : '';
  return `${sign}${getNumberFormatter(lang, 1).format(Math.abs(value))}%`;
}

export function formatDate(iso: string, lang: Language, options: { year?: boolean } = {}): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  const key = `${lang}:${options.year ? 'y' : 'n'}`;
  let formatter = dateFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(dateLocale(lang), {
      day: 'numeric',
      month: 'short',
      ...(options.year ? { year: 'numeric' as const } : {}),
    });
    dateFormatters.set(key, formatter);
  }
  return formatter.format(new Date(year, month - 1, day));
}
