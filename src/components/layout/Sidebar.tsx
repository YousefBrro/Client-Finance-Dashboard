import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Brand } from '@/components/ui/Brand';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { NavList } from './NavList';

export function ReadOnlyNote() {
  const { t } = useLanguage();
  return (
    <p className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 p-3 text-xs leading-relaxed text-ink-2">
      <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-light" />
      {t('sidebar.readOnly')}
    </p>
  );
}

export function Sidebar() {
  const { t } = useLanguage();
  const { client } = useClient();

  return (
    <aside className="fixed inset-y-0 start-0 z-20 hidden w-64 flex-col border-e border-line bg-surface lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
        <Link to={`/c/${client.id}`} aria-label={t('brand.name')} className="rounded-lg">
          <Brand />
        </Link>
      </div>
      <nav aria-label={t('nav.primary')} className="flex-1 overflow-y-auto px-3 py-4">
        <NavList />
      </nav>
      <div className="p-3">
        <ReadOnlyNote />
      </div>
    </aside>
  );
}
