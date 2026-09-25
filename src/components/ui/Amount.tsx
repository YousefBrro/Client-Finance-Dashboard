import { useLanguage } from '@/i18n/LanguageContext';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { CurrencyCode } from '@/types';

interface Props {
  value: number;
  currency: CurrencyCode;
  signed?: boolean;
  tone?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

const TONES = {
  positive: 'text-positive',
  negative: 'text-negative',
  neutral: '',
} as const;

export function Amount({ value, currency, signed = false, tone = 'neutral', className }: Props) {
  const { lang } = useLanguage();
  return (
    <span className={cn('num whitespace-nowrap', TONES[tone], className)}>
      {formatMoney(value, currency, lang, { signed })}
    </span>
  );
}
