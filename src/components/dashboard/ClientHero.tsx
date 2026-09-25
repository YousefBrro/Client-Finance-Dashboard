import { FileSpreadsheet, RefreshCw } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format';
import { localize } from '@/lib/localize';

export function ClientHero() {
  const { client, state, reload } = useClient();
  const { t, lang } = useLanguage();

  const lastUpdate = state.status === 'success' ? state.data.lastUpdate : null;

  return (
    <section
      aria-labelledby="client-title"
      className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0 border-s-2 border-brand ps-4">
        <p className="text-sm text-ink-2">{t('hero.welcome')}</p>
        <h1 id="client-title" className="mt-1 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {localize(client.projectName, lang)}
        </h1>
        <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-2">{t('hero.client')}</dt>
            <dd className="font-medium">{localize(client.name, lang)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-ink-2">{t('hero.lastUpdate')}</dt>
            <dd className="font-medium">
              {state.status === 'loading' ? (
                <span aria-hidden="true" className="block h-4 w-24 animate-pulse rounded bg-white/10" />
              ) : lastUpdate ? (
                formatDate(lastUpdate, lang, { year: true })
              ) : (
                '\u2014'
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={reload}
          aria-label={t('hero.refresh')}
          title={t('hero.refresh')}
          className="flex size-11 items-center justify-center rounded-xl border border-line text-ink-2 transition-colors hover:bg-white/5 hover:text-ink"
        >
          <RefreshCw
            aria-hidden="true"
            className={cn('size-4', state.status === 'loading' && 'animate-spin')}
          />
        </button>
        {client.excelViewUrl && (
          <LinkButton
            variant="primary"
            href={client.excelViewUrl}
            icon={<FileSpreadsheet aria-hidden="true" className="size-4" />}
            className="flex-1 sm:flex-none"
          >
            {t('hero.openExcel')}
          </LinkButton>
        )}
      </div>
    </section>
  );
}
