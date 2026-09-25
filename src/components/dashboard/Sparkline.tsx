import { cn } from '@/lib/cn';

const W = 100;
const H = 32;
const PAD = 3;
/** Purely decorative shape, used when there is not enough real history. */
const DECORATIVE = 'M0 22 C10 22 12 12 22 14 S38 26 48 20 S64 8 74 12 S90 20 100 10';

function buildPath(series: number[]): string {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min;
  return series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * W;
      const y = span === 0 ? H / 2 : H - PAD - ((value - min) / span) * (H - PAD * 2);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

/** Running-balance line. Charts read left-to-right in both languages. */
export function Sparkline({ series, className }: { series: number[]; className?: string }) {
  const real = series.length >= 2;
  const line = real ? buildPath(series) : DECORATIVE;

  return (
    <div dir="ltr" className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn('h-10 w-full', real ? 'text-brand' : 'text-ink-3')}
      >
        {real && <path d={`${line} L${W} ${H} L0 ${H} Z`} fill="currentColor" opacity="0.08" />}
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={real ? undefined : '3 4'}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
