import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { Toaster } from 'sonner';

import StoreProvider from '@/context/store-provider';
import { LoaderProvider, useLoading } from '@/context/loader-provider';
import { Loader } from '@/components/loader/loader';

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
