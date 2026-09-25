import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';
import { operationLabelKey } from '@/lib/labels';
import type { OperationType } from '@/types';

const DOT: Record<OperationType, string> = {
  capital: 'bg-info',
  payment: 'bg-brand',
  exchange: 'bg-white/50',
};

export function TypeBadge({ type }: { type: OperationType }) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', DOT[type])} />
      {t(operationLabelKey[type])}
    </span>
  );
}
