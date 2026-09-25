import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function MovementIcon({ direction }: { direction: 'in' | 'out' }) {
  const incoming = direction === 'in';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full',
        incoming ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative',
      )}
    >
      {incoming ? <ArrowDownLeft className="size-5" /> : <ArrowUpRight className="size-5" />}
    </span>
  );
}
