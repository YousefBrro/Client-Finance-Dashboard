import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
  className?: string;
}

export function StateMessage({ icon, title, description, action, tone = 'neutral', className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-line px-6 py-12 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mb-4 flex size-12 items-center justify-center rounded-full border border-line bg-surface-2',
          tone === 'danger' ? 'text-negative' : 'text-brand-light',
        )}
      >
        {icon}
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
