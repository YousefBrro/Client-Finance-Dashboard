import { useCallback, useEffect, useRef, useState } from 'react';
import { DataError } from '@/services/dataError';
import type { DataErrorCode } from '@/services/dataError';
import { loadClientData } from '@/services/clientDataService';
import type { ClientConfig, ClientDataset } from '@/types';

export type ClientDataState =
  | { status: 'loading' }
  | { status: 'success'; data: ClientDataset }
  | { status: 'error'; code: DataErrorCode };

export function useClientData(client: ClientConfig | undefined) {
  const [state, setState] = useState<ClientDataState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const forceRef = useRef(false);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    const force = forceRef.current;
    forceRef.current = false;

    setState({ status: 'loading' });
    loadClientData(client, { force })
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', code: error instanceof DataError ? error.code : 'unknown' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [client, attempt]);

  const reload = useCallback(() => {
    forceRef.current = true;
    setAttempt((n) => n + 1);
  }, []);

  return { state, reload };
}
