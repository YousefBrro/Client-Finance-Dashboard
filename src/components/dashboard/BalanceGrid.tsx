import { useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { summarizeCurrency } from '@/lib/finance';
import { CURRENCIES } from '@/types';
import type { Transaction } from '@/types';
import { BalanceCard } from './BalanceCard';

export function BalanceGrid({ transactions }: { transactions: Transaction[] }) {
  const { t } = useLanguage();
  // One summary per currency. Currencies are deliberately never added together.
  const summaries = useMemo(
    () => CURRENCIES.map((currency) => summarizeCurrency(transactions, currency)),
    [transactions],
  );

  return (
    <section aria-labelledby="balances-title">
      <div className="mb-4">
        <h2 id="balances-title" className="text-lg font-semibold tracking-tight">
          {t('balances.title')}
        </h2>
        <p className="mt-1 text-sm text-ink-2">{t('balances.note')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {summaries.map((summary) => (
          <BalanceCard key={summary.currency} summary={summary} />
        ))}
      </div>
    </section>
  );
}
