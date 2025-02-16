import type { AppProps } from 'next/app';
import { Toaster } from 'sonner';

import '../styles/globals.css';

import { Loader } from '@/components/loader/loader';

import { LoaderProvider, useLoading } from '@/context/loader-provider';
import StoreProvider from '@/context/store-provider';

function AppLoader() {
  const { isLoading } = useLoading();

  return isLoading ? <Loader /> : null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <LoaderProvider>
        <AppLoader />
        <Component {...pageProps} />
        <Toaster richColors />
      </LoaderProvider>
    </StoreProvider>
  );
}
