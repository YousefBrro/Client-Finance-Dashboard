import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { useLanguage } from '@/i18n/LanguageContext';
import { operationLabelKey } from '@/lib/labels';
import { CURRENCIES, OPERATION_TYPES } from '@/types';
import type { CurrencyFilter, OperationFilter, TransactionFilters as Filters } from '@/types';

interface Props {
  filters: Filters;
  isActive: boolean;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
}

export function TransactionFilters({ filters, isActive, onChange, onClear }: Props) {
  const { t } = useLanguage();

  const currencyOptions = [
    { value: 'all' as CurrencyFilter, label: t('currency.all') },
    ...CURRENCIES.map((code) => ({ value: code as CurrencyFilter, label: code })),
  ];
  const typeOptions = [
    { value: 'all' as OperationFilter, label: t('op.all') },
    ...OPERATION_TYPES.map((type) => ({ value: type as OperationFilter, label: t(operationLabelKey[type]) })),
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem_11rem_auto] lg:items-end">
      <div className="relative">
        <label htmlFor="tx-search" className="sr-only">
          {t('tx.search')}
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2"
        />
        <input
          id="tx-search"
          type="search"
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value })}
          placeholder={t('tx.searchPlaceholder')}
          enterKeyHint="search"
          autoComplete="off"
          className="h-11 w-full rounded-xl border border-line bg-surface ps-10 pe-3 text-base text-ink transition-colors placeholder:text-white/45 hover:border-white/15 focus:border-brand/50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:contents">
        <SelectField
          id="tx-currency"
          label={t('tx.currency')}
          value={filters.currency}
          options={currencyOptions}
          onChange={(currency) => onChange({ currency })}
        />
        <SelectField
          id="tx-operation"
          label={t('tx.operation')}
          value={filters.type}
          options={typeOptions}
          onChange={(type) => onChange({ type })}
        />
      </div>

      {isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          icon={<X aria-hidden="true" className="size-4" />}
          className="self-start lg:self-end"
        >
          {t('tx.clear')}
        </Button>
      )}
    </div>
  );
}
