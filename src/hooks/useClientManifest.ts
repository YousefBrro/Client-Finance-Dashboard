import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { localize } from '@/lib/localize';
import type { ClientConfig } from '@/types';

/**
 * Builds the web-app manifest per client, so an installed app opens straight on
 * that client's own private link instead of a generic start page.
 */
export function useClientManifest(client: ClientConfig | undefined): void {
  const { lang, dir, t } = useLanguage();

  useEffect(() => {
    if (!client) return;

    const base = new URL(import.meta.env.BASE_URL, window.location.origin);
    const abs = (path: string) => new URL(path, base).href;
    const startUrl = abs(`c/${client.id}`);

    const manifest = {
      id: startUrl,
      name: `${localize(client.projectName, lang)} | ${t('brand.name')}`,
      short_name: t('brand.name'),
      lang,
      dir,
      start_url: startUrl,
      scope: base.href,
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#070A0D',
      theme_color: '#070A0D',
      icons: [
        { src: abs('icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
        { src: abs('icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
        { src: abs('icons/maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    };

    const url = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' }));
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    const previous = link?.getAttribute('href') ?? null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = url;

    return () => {
      URL.revokeObjectURL(url);
      if (link && previous) link.setAttribute('href', previous);
    };
  }, [client, lang, dir, t]);
}
