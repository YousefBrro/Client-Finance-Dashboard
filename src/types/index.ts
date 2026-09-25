export type Language = 'ar' | 'en';

/** A plain string, or a per-language value for content that must be translated (e.g. client names). */
export type Localized = string | Record<Language, string>;

export const CURRENCIES = ['SYP', 'USD', 'EUR'] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export const OPERATION_TYPES = ['capital', 'payment', 'exchange'] as const;
export type OperationType = (typeof OPERATION_TYPES)[number];

export interface Transaction {
  id: string;
  /** ISO calendar date, YYYY-MM-DD */
  date: string;
  description: string;
  type: OperationType;
  currency: CurrencyCode;
  incoming: number;
  outgoing: number;
}

export interface ClientConfig {
  id: string;
  name: Localized;
  projectName: Localized;
  /** Where the data is read from (a private API route in production). */
  excelUrl: string;
  /** Optional link for the "Open Excel" button. The button is hidden when absent. */
  excelViewUrl?: string;
}

export interface ClientDataset {
  /** Sorted newest first. */
  transactions: Transaction[];
  /** ISO date of the last update (file modified date, or latest transaction date). */
  lastUpdate: string | null;
  skippedRows: number;
}

export interface CurrencySummary {
  currency: CurrencyCode;
  balance: number;
  /** Net movement over the last 30 days of data, relative to the balance before it. */
  changePct: number | null;
  /** Running balance after each transaction (max 30 points). Empty when there is not enough data. */
  series: number[];
}

export type OperationFilter = OperationType | 'all';
export type CurrencyFilter = CurrencyCode | 'all';

export interface TransactionFilters {
  q: string;
  currency: CurrencyFilter;
  type: OperationFilter;
}

export function isCurrency(value: string | null | undefined): value is CurrencyCode {
  return !!value && (CURRENCIES as readonly string[]).includes(value);
}

export function isOperationType(value: string | null | undefined): value is OperationType {
  return !!value && (OPERATION_TYPES as readonly string[]).includes(value);
}
