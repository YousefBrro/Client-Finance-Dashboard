import type { Language, Localized } from '@/types';

export function localize(value: Localized, lang: Language): string {
  return typeof value === 'string' ? value : value[lang];
}
