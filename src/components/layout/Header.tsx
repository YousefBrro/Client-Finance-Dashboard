import { useState } from 'react';
import type { FormEvent } from 'react';
import { Menu, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Brand } from '@/components/ui/Brand';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';
import { InstallButton } from './InstallButton';
import { useClient } from '@/hooks/useClient';
import { useLanguage } from '@/i18n/LanguageContext';
import { initials } from '@/lib/text';
import { localize } from '@/lib/localize';

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { client } = useClient();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const clientName = localize(client.name, lang);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    navigate({
      pathname: `/c/${client.id}/transactions`,
      search: q ? `?q=${encodeURIComponent(q)}` : '',
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t('nav.openMenu')}
          className="-ms-2 flex size-11 shrink-0 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-white/5 hover:text-ink lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>

        <Link to={`/c/${client.id}`} aria-label={t('brand.name')} className="rounded-lg lg:hidden">
          <Brand compact />
        </Link>

        <form role="search" onSubmit={submit} className="relative hidden w-full max-w-md md:block">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('header.searchLabel')}
            placeholder={t('header.searchPlaceholder')}
            enterKeyHint="search"
            className="h-11 w-full rounded-xl border border-line bg-surface ps-10 pe-3 text-base text-ink transition-colors placeholder:text-white/45 hover:border-white/15 focus:border-brand/50 focus:outline-none"
          />
        </form>

        <div className="ms-auto flex items-center gap-3">
          <InstallButton />
          <LanguageSwitch />
          <div className="hidden min-w-0 items-center gap-2.5 md:flex">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand-light"
            >
              {initials(clientName)}
            </span>
            <span className="max-w-40 truncate text-sm font-medium">{clientName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
