import { Amount } from '@/components/ui/Amount';
import { useLanguage } from '@/i18n/LanguageContext';
import { formatDate } from '@/lib/format';
import { getMovement } from '@/lib/finance';
import type { Transaction } from '@/types';
import { MovementIcon } from './MovementIcon';
import { TypeBadge } from './TypeBadge';

const TH = 'px-4 py-3 text-start font-medium';

/** Desktop (xl and up). Smaller screens use TransactionList. */
export function TransactionTable({ rows, caption }: { rows: Transaction[]; caption: string }) {
  const { t, lang } = useLanguage();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface xl:block">
      <table className="w-full table-fixed text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line bg-surface-2/60 text-xs text-ink-2">
            <th scope="col" className={`${TH} w-32`}>{t('tx.col.date')}</th>
            <th scope="col" className={TH}>{t('tx.col.description')}</th>
            <th scope="col" className={`${TH} w-32`}>{t('tx.col.type')}</th>
            <th scope="col" className={`${TH} w-28`}>{t('tx.col.currency')}</th>
            <th scope="col" className={`${TH} w-44 text-end`}>{t('tx.col.incoming')}</th>
            <th scope="col" className={`${TH} w-44 text-end`}>{t('tx.col.outgoing')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tx) => {
            const { direction } = getMovement(tx);
            const description = tx.description || t('tx.noDescription');
            return (
              <tr
                key={tx.id}
                className="border-b border-line transition-colors duration-150 last:border-b-0 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3.5 whitespace-nowrap text-ink-2">
                  {formatDate(tx.date, lang, { year: true })}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <MovementIcon direction={direction} />
                    <span className="min-w-0 truncate font-medium" title={description}>
                      {description}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-ink-2">
                  <TypeBadge type={tx.type} />
                </td>
                <td className="px-4 py-3.5 text-ink-2">{tx.currency}</td>
                <td className="px-4 py-3.5 text-end font-medium">
                  {tx.incoming > 0 ? (
                    <Amount value={tx.incoming} currency={tx.currency} tone="positive" />
                  ) : (
                    <span aria-hidden="true" className="text-ink-3">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-end font-medium">
                  {tx.outgoing > 0 ? (
                    <Amount value={tx.outgoing} currency={tx.currency} tone="negative" />
                  ) : (
                    <span aria-hidden="true" className="text-ink-3">&mdash;</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
