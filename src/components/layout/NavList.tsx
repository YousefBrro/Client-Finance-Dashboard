import { NavLink } from 'react-router-dom';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';
import { navItems } from '@/lib/navigation';

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { client } = useClient();
  const { t } = useLanguage();

  return (
    <ul className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.key}>
            <NavLink
              to={`/c/${client.id}${item.path}`}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-150',
                  isActive ? 'bg-brand/10 text-brand-light' : 'text-ink-2 hover:bg-white/5 hover:text-ink',
                )
              }
            >
              <Icon aria-hidden="true" className="size-5" />
              {t(item.labelKey)}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}
