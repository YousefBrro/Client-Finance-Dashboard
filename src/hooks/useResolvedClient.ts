import { useCallback, useEffect, useState } from 'react';
import { resolveClient } from '@/services/clientService';
import type { ClientLookup } from '@/services/clientService';

export type ClientLookupState = { status: 'loading' } | ClientLookup;

export function useResolvedClient(token: string) {
  const [state, setState] = useState<ClientLookupState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    resolveClient(token).then((result) => {
      if (!cancelled) setState(result);
    });
    return () => {
      cancelled = true;
    };
  }, [token, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
