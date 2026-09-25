import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MoreHorizontal } from 'lucide-react';

export interface MenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  /** Keep the menu open after selecting (e.g. to show a "Copied" confirmation). */
  keepOpen?: boolean;
  onSelect: () => void;
}

export function DropdownMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="-m-1.5 flex size-11 items-center justify-center rounded-xl text-ink-2 transition-colors hover:bg-white/5 hover:text-ink"
      >
        <MoreHorizontal aria-hidden="true" className="size-5" />
      </button>
      {open && (
        <div className="absolute end-0 top-full z-20 mt-1 min-w-52 animate-rise rounded-xl border border-line bg-surface-2 p-1.5 shadow-lg shadow-black/40">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                item.onSelect();
                if (!item.keepOpen) setOpen(false);
              }}
              className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-start text-sm text-ink transition-colors hover:bg-white/5"
            >
              <span aria-hidden="true" className="text-ink-2">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
