import type { TranslationKey } from '@/i18n/translations';
import type { CurrencyCode, OperationType } from '@/types';
import type { DataErrorCode } from '@/services/dataError';

export const operationLabelKey: Record<OperationType, TranslationKey> = {
  capital: 'op.capital',
  payment: 'op.payment',
  exchange: 'op.exchange',
};

export const currencyNameKey: Record<CurrencyCode, TranslationKey> = {
  SYP: 'currency.SYP',
  USD: 'currency.USD',
  EUR: 'currency.EUR',
};

export const errorMessageKey: Record<DataErrorCode, TranslationKey> = {
  network: 'state.error.network',
  'not-found': 'state.error.notFound',
  format: 'state.error.format',
  unknown: 'state.error.unknown',
};
