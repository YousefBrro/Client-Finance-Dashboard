import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BalanceGrid } from '@/components/dashboard/BalanceGrid';
import { ClientHero } from '@/components/dashboard/ClientHero';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { DataGate } from '@/components/layout/DataGate';
import { TransactionsSection } from '@/components/transactions/TransactionsSection';
import { buttonStyles } from '@/components/ui/Button';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';

export default function DashboardPage() {
  const { client } = useClient();
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      <ClientHero />
      <DataGate skeleton={<DashboardSkeleton />}>
        {(data) => (
          <>
            <BalanceGrid transactions={data.transactions} />
            <TransactionsSection
              transactions={data.transactions}
              title={t('tx.recent')}
              initialCount={6}
              action={
                <Link to={`/c/${client.id}/transactions`} className={buttonStyles('ghost', 'sm')}>
                  {t('tx.viewAll')}
                  <ChevronRight aria-hidden="true" className="size-4 rtl:-scale-x-100" />
                </Link>
              }
            />
          </>
        )}
      </DataGate>
    </div>
  );
}
