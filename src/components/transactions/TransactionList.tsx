import { Amount } from '@/components/ui/Amount';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatDate } from '@/lib/format';
import { getMovement } from '@/lib/finance';
import { operationLabelKey } from '@/lib/labels';
import type { Transaction } from '@/types';
import { MovementIcon } from './MovementIcon';

/** Mobile and tablet cards (below xl). */
export function TransactionList({ rows }: { rows: Transaction[] }) {
  const { t, lang } = useLanguage();

  return (
    <ul className="grid gap-2.5 md:grid-cols-2 xl:hidden">
      {rows.map((tx) => {
        const { direction, amount } = getMovement(tx);
        const incoming = direction === 'in';
        return (
          <li
            key={tx.id}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 transition-colors duration-150 hover:border-white/15 max-[380px]:flex-wrap"
          >
            <MovementIcon direction={direction} />
            <div className="min-w-0 flex-1 max-[380px]:w-[calc(100%-3.25rem)] max-[380px]:flex-none">
              <p className="line-clamp-2 font-medium break-words">{tx.description || t('tx.noDescription')}</p>
              <p className="mt-0.5 truncate text-xs text-ink-2">
                {formatDate(tx.date, lang)} &middot; {t(operationLabelKey[tx.type])}
              </p>
            </div>
            <div className="shrink-0 text-end max-[380px]:flex max-[380px]:w-full max-[380px]:items-baseline max-[380px]:justify-between max-[380px]:ps-[3.25rem] max-[380px]:text-start">
              <p className="text-sm font-semibold">
                <span className="sr-only">{incoming ? t('tx.in') : t('tx.out')} </span>
                <Amount
                  value={incoming ? amount : -amount}
                  currency={tx.currency}
                  signed
                  tone={incoming ? 'positive' : 'negative'}
                />
              </p>
              <p className="mt-0.5 text-xs text-ink-2 max-[380px]:mt-0">{tx.currency}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
