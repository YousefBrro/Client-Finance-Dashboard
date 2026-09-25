import type { CurrencyCode, Language } from '@/types';

export interface CurrencyMeta {
  decimals: number;
  symbol: Record<Language, string>;
}

export const currencyMeta: Record<CurrencyCode, CurrencyMeta> = {
  SYP: { decimals: 0, symbol: { en: 'S£', ar: 'ل.س' } },
  USD: { decimals: 2, symbol: { en: '$', ar: '$' } },
  EUR: { decimals: 2, symbol: { en: '€', ar: '€' } },
};
