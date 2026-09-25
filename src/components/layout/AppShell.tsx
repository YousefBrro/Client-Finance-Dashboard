import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { Header } from './Header';
import { MobileMenu } from './MobileMenu';
import { Sidebar } from './Sidebar';

export function AppShell() {
  const { t } = useLanguage();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-canvas"
      >
        {t('nav.skip')}
      </a>
      <Sidebar />
      <div className="lg:ps-64">
        <Header onOpenMenu={openMenu} />
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 pt-6 pb-[max(4rem,env(safe-area-inset-bottom))] focus:outline-none sm:px-6 sm:pt-8 lg:px-8"
        >
          <div key={location.pathname} className="animate-rise">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </div>
  );
}
