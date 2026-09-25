import type { ClientConfig } from '@/types';

const demo = (file: string) => `${import.meta.env.BASE_URL}demo-data/${file}`;

/**
 * DEMO clients, used only by `npm run dev`. Production clients come from the private API
 * (see functions/ and README): nothing about real clients belongs in this repository.
 * Client configuration layer. Nothing in the UI knows these values —
 * replace this file with an API call when a backend exists.
 */
export const clients: ClientConfig[] = [
  {
    id: 'client-001',
    name: { en: 'Al-Noor Trading Co.', ar: 'شركة النور للتجارة' },
    projectName: { en: 'Damascus Retail Expansion', ar: 'توسعة المتاجر في دمشق' },
    excelUrl: demo('demo.xlsx'),
    excelViewUrl: demo('demo.xlsx'),
  },
  {
    id: 'client-002',
    name: { en: 'Al-Shams Manufacturing', ar: 'مصنع الشمس' },
    projectName: { en: 'Production Line Upgrade', ar: 'تطوير خط الإنتاج' },
    excelUrl: demo('demo-002.xlsx'),
  },
  {
    id: 'client-003',
    name: { en: 'Horizon Studio', ar: 'استوديو الأفق' },
    projectName: { en: 'Brand & Web Retainer', ar: 'عقد الهوية والموقع' },
    excelUrl: demo('demo-003.xlsx'),
  },
];
