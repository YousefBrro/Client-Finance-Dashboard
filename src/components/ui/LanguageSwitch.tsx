import { Languages } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export function LanguageSwitch() {
  const { t, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t('lang.switchLabel')}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-white/5 hover:text-ink"
    >
      <Languages aria-hidden="true" className="size-4" />
      {t('lang.other')}
    </button>
  );
}
