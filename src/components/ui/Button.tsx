import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

export function buttonStyles(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap',
    'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
    size === 'md' ? 'min-h-11 px-4 text-sm' : 'min-h-10 px-3 text-sm',
    variant === 'primary' && 'bg-brand text-canvas hover:bg-brand-light',
    variant === 'secondary' && 'border border-line bg-surface-2 text-ink hover:bg-white/[0.07]',
    variant === 'ghost' && 'text-ink-2 hover:bg-white/5 hover:text-ink',
    className,
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant,
  size,
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  return (
    <button type={type} className={buttonStyles(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

/** External link styled as a button. */
export function LinkButton({
  variant,
  size,
  icon,
  className,
  children,
  ...rest
}: CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles(variant, size, className)}
      {...rest}
    >
      {icon}
      {children}
    </a>
  );
}
