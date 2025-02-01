import { useVerifyUserQuery } from '@/store/services/auth';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoadingContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { pathname } = router;

  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  const skipVerification = pathname === '/login';

  const { isError, refetch } = useVerifyUserQuery(undefined, {
    skip: skipVerification,
  });

  useEffect(() => {
    if (!skipVerification) {
      refetch();
    }
    if (isError) {
      router.push('/login');
    }
  }, [skipVerification, refetch, router]);
  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
