import { ChevronDown } from 'lucide-react';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

/** Native select (best on phones) with the product styling. */
export function SelectField<T extends string>({ id, label, value, options, onChange }: Props<T>) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs text-ink-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="h-11 w-full appearance-none rounded-xl border border-line bg-surface ps-3.5 pe-10 text-base text-ink transition-colors hover:border-white/15 focus:border-brand/50 focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-2 text-ink">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2"
        />
      </div>
    </div>
  );
}
