'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetAllStoresQuery } from '@/store/services/store';
import {
  getSelectedStore,
  getStores,
  setSelectedStore,
  setStores,
} from '@/store/slice/storeSlice';
import { useEffect } from 'react';

/**
 * Store Initializer Component
 *
 * This component ensures stores are loaded early in the app lifecycle
 * and a store is selected before other components make API calls.
 * It should be placed high in the component tree (e.g., in Layout or _app).
 */
export function StoreInitializer() {
  const dispatch = useAppDispatch();
  const selectedStore = useAppSelector(getSelectedStore);
  const stores = useAppSelector(getStores);
  const { data: storesData, isLoading } = useGetAllStoresQuery();

  // Load stores into Redux when fetched
  useEffect(() => {
    if (storesData?.success && storesData.data) {
      dispatch(setStores(storesData.data));
    }
  }, [storesData, dispatch]);

  // Auto-select first store if none selected and stores are available
  useEffect(() => {
    if (!selectedStore && stores.length > 0) {
      dispatch(setSelectedStore(stores[0]));
    }
  }, [selectedStore, stores, dispatch]);

  // This component doesn't render anything
  return null;
}
