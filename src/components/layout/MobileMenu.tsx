import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Brand } from '@/components/ui/Brand';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/cn';
import { NavList } from './NavList';
import { ReadOnlyNote } from './Sidebar';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      inert={!open}
      className={cn('fixed inset-0 z-50 lg:hidden', !open && 'pointer-events-none')}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.primary')}
        className={cn(
          'absolute inset-y-0 start-0 flex w-[min(20rem,85vw)] flex-col pt-[env(safe-area-inset-top)] border-e border-line bg-surface transition-transform duration-200 ease-out',
          open ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line ps-5 pe-3">
          <Brand />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('nav.closeMenu')}
            className="flex size-11 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-white/5 hover:text-ink"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <nav aria-label={t('nav.primary')} className="flex-1 overflow-y-auto px-3 py-4">
          <NavList onNavigate={onClose} />
        </nav>
        <div className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <ReadOnlyNote />
        </div>
      </div>
    </div>
  );
}
