import { DataGate } from '@/components/layout/DataGate';
import { TransactionsSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { TransactionsSection } from '@/components/transactions/TransactionsSection';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { localize } from '@/lib/localize';

export default function TransactionsPage() {
  const { client } = useClient();
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-8">
      <header className="border-s-2 border-brand ps-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('page.transactions.title')}</h1>
        <p className="mt-1 text-sm text-ink-2">
          {localize(client.projectName, lang)} &middot; {localize(client.name, lang)}
        </p>
      </header>
      <DataGate skeleton={<TransactionsSkeleton />}>
        {(data) => (
          <TransactionsSection
            transactions={data.transactions}
            title={t('tx.all')}
            initialCount={15}
            hideHeading
          />
        )}
      </DataGate>
    </div>
  );
}
