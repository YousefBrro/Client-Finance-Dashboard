import { useSyncExternalStore } from 'react';
import { getInstallMode, subscribeInstall } from '@/lib/pwa';
import type { InstallMode } from '@/lib/pwa';

export function useInstallMode(): InstallMode {
  return useSyncExternalStore(subscribeInstall, getInstallMode, () => 'none' as const);
}
