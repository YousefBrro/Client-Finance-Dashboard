import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { StateMessage } from '@/components/ui/StateMessage';
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext';
import { getDefaultClient } from '@/services/clientService';
import ClientLayout from '@/pages/ClientLayout';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import TransactionsPage from '@/pages/TransactionsPage';

function CrashFallback() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl items-center px-4">
      <StateMessage
        className="w-full"
        tone="danger"
        icon={<RefreshCw className="size-6" />}
        title={t('state.crash.title')}
        description={t('state.crash.body')}
        action={
          <Button variant="primary" onClick={() => window.location.reload()}>
            {t('state.reload')}
          </Button>
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ErrorBoundary fallback={<CrashFallback />}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Dev convenience only. In production the root reveals nothing: each client has a private link. */}
            <Route
              path="/"
              element={
                import.meta.env.DEV ? (
                  <Navigate to={`/c/${getDefaultClient().id}`} replace />
                ) : (
                  <NotFoundPage />
                )
              }
            />
            <Route path="/c/:clientId" element={<ClientLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
