import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';

/** Tibr mark: a gold ingot with a ledger line. */
export function BrandMark({ className = 'size-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#10171E" stroke="rgba(255,255,255,0.07)" />
      <path
        d="M9 21.5 11.5 11.5h9L23 21.5Z"
        fill="none"
        stroke="#F59E0B"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12.6 16.5h6.8" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  return (
    <span className="flex items-center gap-3">
      <BrandMark />
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-tight">{t('brand.name')}</span>
        <span className={cn('text-xs text-ink-2', compact && 'hidden sm:block')}>{t('brand.tagline')}</span>
      </span>
    </span>
  );
}
