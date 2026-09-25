import { useEffect, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Inbox, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { useLanguage } from '@/i18n/LanguageContext';
import { scrollToId } from '@/lib/dom';
import { filterTransactions } from '@/lib/finance';
import { cn } from '@/lib/cn';
import type { Transaction } from '@/types';
import { TransactionFilters } from './TransactionFilters';
import { TransactionList } from './TransactionList';
import { TransactionTable } from './TransactionTable';

const STEP = 10;
export const TRANSACTIONS_SECTION_ID = 'transactions';

interface Props {
  transactions: Transaction[];
  title: string;
  initialCount: number;
  /** Visually hide the heading when the page already has an equivalent h1. */
  hideHeading?: boolean;
  action?: ReactNode;
}

export function TransactionsSection({ transactions, title, initialCount, hideHeading, action }: Props) {
  const { t } = useLanguage();
  const headingId = useId();
  const { filters, update, clear, isActive } = useTransactionFilters();
  const [visible, setVisible] = useState(initialCount);

  const filtered = useMemo(() => filterTransactions(transactions, filters), [transactions, filters]);
  const rows = filtered.slice(0, visible);

  // A new search or filter always starts from the first page.
  useEffect(() => {
    setVisible(initialCount);
  }, [filters, initialCount]);

  const showLess = () => {
    setVisible(initialCount);
    scrollToId(TRANSACTIONS_SECTION_ID);
  };

  return (
    <section id={TRANSACTIONS_SECTION_ID} aria-labelledby={headingId} className="space-y-4">
      <div className={hideHeading ? undefined : 'flex items-center justify-between gap-3'}>
        <h2 id={headingId} className={cn('text-lg font-semibold tracking-tight', hideHeading && 'sr-only')}>
          {title}
        </h2>
        {action}
      </div>

      {transactions.length === 0 ? (
        <StateMessage
          icon={<Inbox className="size-6" />}
          title={t('tx.none.title')}
          description={t('tx.none.body')}
        />
      ) : (
        <>
          <TransactionFilters filters={filters} isActive={isActive} onChange={update} onClear={clear} />

          {filtered.length === 0 ? (
            <StateMessage
              icon={<SearchX className="size-6" />}
              title={t('tx.empty.title')}
              description={t('tx.empty.body')}
              action={
                <Button variant="secondary" onClick={clear}>
                  {t('tx.clear')}
                </Button>
              }
            />
          ) : (
            <>
              <TransactionTable rows={rows} caption={title} />
              <TransactionList rows={rows} />

              {filtered.length > initialCount && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p aria-live="polite" className="text-sm text-ink-2">
                    {t('tx.showing', { shown: rows.length, total: filtered.length })}
                  </p>
                  <div className="flex gap-2">
                    {visible > initialCount && (
                      <Button variant="ghost" onClick={showLess}>
                        {t('tx.showLess')}
                      </Button>
                    )}
                    {rows.length < filtered.length && (
                      <Button variant="secondary" onClick={() => setVisible((count) => count + STEP)}>
                        {t('tx.showMore')}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
