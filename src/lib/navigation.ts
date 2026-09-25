import { ArrowLeftRight, LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from '@/i18n/translations';

export interface NavItem {
  key: string;
  icon: LucideIcon;
  labelKey: TranslationKey;
  /** Path below /c/:clientId */
  path: string;
}

export const navItems: NavItem[] = [
  { key: 'dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard', path: '' },
  { key: 'transactions', icon: ArrowLeftRight, labelKey: 'nav.transactions', path: '/transactions' },
];
