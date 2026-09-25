import type { ReactNode } from 'react';
import { Brand } from '@/components/ui/Brand';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';

/** Minimal frame for screens that have no client context (loading, not found, errors). */
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 sm:px-6">
      <header className="flex items-center justify-between">
        <Brand />
        <LanguageSwitch />
      </header>
      <main className="flex flex-1 items-center py-10">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
