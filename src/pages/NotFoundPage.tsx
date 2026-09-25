import { useEffect } from 'react';
import { SearchX } from 'lucide-react';
import { PublicShell } from '@/components/layout/PublicShell';
import { StateMessage } from '@/components/ui/StateMessage';
import { useLanguage } from '@/i18n/LanguageContext';

export default function NotFoundPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `${t('notFound.title')} | ${t('brand.name')}`;
  }, [t]);

  return (
    <PublicShell>
      <StateMessage icon={<SearchX className="size-6" />} title={t('notFound.title')} description={t('notFound.body')} />
    </PublicShell>
  );
}
