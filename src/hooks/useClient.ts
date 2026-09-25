import { createContext, useContext } from 'react';
import type { ClientConfig } from '@/types';
import type { ClientDataState } from './useClientData';

export interface ClientContextValue {
  client: ClientConfig;
  state: ClientDataState;
  reload: () => void;
}

export const ClientContext = createContext<ClientContextValue | null>(null);

export function useClient(): ClientContextValue {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClient must be used inside a client route');
  return context;
}
