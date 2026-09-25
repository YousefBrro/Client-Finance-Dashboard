import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isCurrency, isOperationType } from '@/types';
import type { TransactionFilters } from '@/types';

/** Filters live in the URL (?q=&cur=&op=) so they can be shared and survive reloads. */
export function useTransactionFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<TransactionFilters>(() => {
    const cur = params.get('cur');
    const op = params.get('op');
    return {
      q: params.get('q') ?? '',
      currency: isCurrency(cur) ? cur : 'all',
      type: isOperationType(op) ? op : 'all',
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<TransactionFilters>) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          const set = (key: string, value: string) => {
            if (value && value !== 'all') next.set(key, value);
            else next.delete(key);
          };
          if (patch.q !== undefined) set('q', patch.q);
          if (patch.currency !== undefined) set('cur', patch.currency);
          if (patch.type !== undefined) set('op', patch.type);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const clear = useCallback(() => update({ q: '', currency: 'all', type: 'all' }), [update]);
  const isActive = filters.q !== '' || filters.currency !== 'all' || filters.type !== 'all';

  return { filters, update, clear, isActive };
}
