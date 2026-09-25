import { useEffect, useMemo } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { PublicShell } from '@/components/layout/PublicShell';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { ClientContext } from '@/hooks/useClient';
import { useClientData } from '@/hooks/useClientData';
import { useClientManifest } from '@/hooks/useClientManifest';
import { useResolvedClient } from '@/hooks/useResolvedClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { localize } from '@/lib/localize';
import NotFoundPage from './NotFoundPage';

/**
 * Resolves the private token from the URL, loads that client's data once,
 * and shares it with every child route.
 */
export default function ClientLayout() {
  const { clientId = '' } = useParams();
  const { state: lookup, retry } = useResolvedClient(clientId);
  const client = lookup.status === 'found' ? lookup.client : undefined;
  const { state, reload } = useClientData(client);
  const { t, lang } = useLanguage();
  useClientManifest(client);

  useEffect(() => {
    if (client) document.title = `${localize(client.projectName, lang)} | ${t('brand.name')}`;
  }, [client, lang, t]);

  const value = useMemo(() => (client ? { client, state, reload } : null), [client, state, reload]);

  if (lookup.status === 'loading') {
    return (
      <PublicShell>
        <p role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-ink-2">
          <Loader2 aria-hidden="true" className="size-4 animate-spin text-brand-light" />
          {t('state.opening')}
        </p>
      </PublicShell>
    );
  }

  if (lookup.status === 'missing') return <NotFoundPage />;

  if (lookup.status === 'error' || !value) {
    return (
      <PublicShell>
        <StateMessage
          tone="danger"
          icon={<AlertTriangle className="size-6" />}
          title={t('state.error.title')}
          description={t('state.error.network')}
          action={
            <Button variant="primary" onClick={retry} icon={<RefreshCw aria-hidden="true" className="size-4" />}>
              {t('state.retry')}
            </Button>
          }
        />
      </PublicShell>
    );
  }

  return (
    <ClientContext.Provider value={value}>
      <AppShell />
    </ClientContext.Provider>
  );
}
