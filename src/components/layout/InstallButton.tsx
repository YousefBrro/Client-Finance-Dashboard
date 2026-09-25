import { useEffect, useRef, useState } from 'react';
import { Download, Share } from 'lucide-react';
import { buttonStyles } from '@/components/ui/Button';
import { useInstallMode } from '@/hooks/useInstallMode';
import { useLanguage } from '@/i18n/LanguageContext';
import { promptInstall } from '@/lib/pwa';

function IosHelp({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
        className="w-full max-w-sm animate-rise rounded-2xl border border-line bg-surface p-5"
      >
        <h2 id="ios-install-title" className="flex items-center gap-2 text-base font-semibold">
          <Share aria-hidden="true" className="size-4 text-brand-light" />
          {t('install.iosTitle')}
        </h2>
        <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-ink-2 marker:text-brand-light">
          <li>{t('install.iosStep1')}</li>
          <li>{t('install.iosStep2')}</li>
          <li>{t('install.iosStep3')}</li>
        </ol>
        <button ref={closeRef} type="button" onClick={onClose} className={buttonStyles('primary', 'md', 'mt-5 w-full')}>
          {t('install.close')}
        </button>
      </div>
    </div>
  );
}

/** Shown only when installing is possible (Chrome/Edge/Android prompt, or iOS instructions). */
export function InstallButton() {
  const mode = useInstallMode();
  const { t } = useLanguage();
  const [help, setHelp] = useState(false);

  if (mode === 'none') return null;

  return (
    <>
      <button
        type="button"
        onClick={() => (mode === 'prompt' ? void promptInstall() : setHelp(true))}
        aria-label={t('install.button')}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-brand px-3 text-sm font-medium text-canvas transition-colors hover:bg-brand-light"
      >
        <Download aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline">{t('install.button')}</span>
      </button>
      {help && <IosHelp onClose={() => setHelp(false)} />}
    </>
  );
}
