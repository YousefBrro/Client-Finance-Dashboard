import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { errorMessageKey } from '@/lib/labels';
import type { ClientDataset } from '@/types';

/** Handles the loading and error states once, so pages only render the happy path. */
export function DataGate({
  skeleton,
  children,
}: {
  skeleton: ReactNode;
  children: (data: ClientDataset) => ReactNode;
}) {
  const { state, reload } = useClient();
  const { t } = useLanguage();

  if (state.status === 'loading') {
    return (
      <div role="status" aria-live="polite">
        <p className="mb-4 flex items-center gap-2 text-sm text-ink-2">
          <Loader2 aria-hidden="true" className="size-4 animate-spin text-brand-light" />
          {t('state.loading')}
        </p>
        {skeleton}
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <StateMessage
        tone="danger"
        icon={<AlertTriangle className="size-6" />}
        title={t('state.error.title')}
        description={t(errorMessageKey[state.code])}
        action={
          <Button variant="primary" onClick={reload} icon={<RefreshCw aria-hidden="true" className="size-4" />}>
            {t('state.retry')}
          </Button>
        }
      />
    );
  }

  return <>{children(state.data)}</>;
}
