import { useEffect, useRef, useState } from 'react';
import { Check, Copy, ListFilter, TrendingDown, TrendingUp } from 'lucide-react';
import { Amount } from '@/components/ui/Amount';
import { Card } from '@/components/ui/Card';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import type { MenuItem } from '@/components/ui/DropdownMenu';
import { currencyMeta } from '@/data/currencies';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';
import { scrollToId } from '@/lib/dom';
import { formatMoney, formatPercent } from '@/lib/format';
import { currencyNameKey } from '@/lib/labels';
import type { CurrencySummary } from '@/types';
import { Sparkline } from './Sparkline';

export function BalanceCard({ summary }: { summary: CurrencySummary }) {
  const { t, lang } = useLanguage();
  const { update } = useTransactionFilters();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const { currency, balance, changePct } = summary;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copyBalance = async () => {
    try {
      await navigator.clipboard.writeText(formatMoney(balance, currency, lang).replace('\u00a0', ' '));
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const items: MenuItem[] = [
    {
      key: 'view',
      label: t('balance.viewTransactions', { currency }),
      icon: <ListFilter className="size-4" />,
      onSelect: () => {
        update({ currency });
        scrollToId('transactions');
      },
    },
    {
      key: 'copy',
      label: copied ? t('balance.copied') : t('balance.copy'),
      icon: copied ? <Check className="size-4 text-positive" /> : <Copy className="size-4" />,
      keepOpen: true,
      onSelect: copyBalance,
    },
  ];

  const up = changePct !== null && changePct >= 0;
  const TrendIcon = up ? TrendingUp : TrendingDown;

  return (
    <Card className="@container flex min-w-0 flex-col p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/15 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-sm font-semibold text-brand-light"
        >
          {currencyMeta[currency].symbol[lang]}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="leading-tight font-semibold">{currency}</h3>
          <p className="mt-0.5 truncate text-sm text-ink-2">{t(currencyNameKey[currency])}</p>
        </div>
        <DropdownMenu label={t('balance.menu', { currency })} items={items} />
      </div>

      <p className="mt-5 text-xl leading-none font-semibold tracking-tight @[14rem]:text-2xl @[18rem]:text-3xl">
        <Amount value={balance} currency={currency} />
      </p>

      {changePct !== null ? (
        <p className={cn('mt-2 flex items-center gap-1.5 text-sm font-medium', up ? 'text-positive' : 'text-negative')}>
          <TrendIcon aria-hidden="true" className="size-4 shrink-0" />
          <span className="num">{formatPercent(changePct, lang)}</span>
          <span className="font-normal text-ink-2">{t('balance.change30')}</span>
        </p>
      ) : (
        <p className="mt-2 text-sm text-ink-2">{t('balance.noChange')}</p>
      )}

      <Sparkline series={summary.series} className="mt-4" />

    </Card>
  );
}
