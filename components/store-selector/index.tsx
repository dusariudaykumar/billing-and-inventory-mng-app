'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useGetAllStoresQuery } from '@/store/services/store';
import {
  getSelectedStore,
  getStores,
  setSelectedStore,
  setStores,
} from '@/store/slice/storeSlice';
import { StoreIcon } from 'lucide-react';
import { useEffect } from 'react';

export function StoreSelector() {
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

  const handleStoreChange = (storeId: string) => {
    const store = stores.find((s) => s._id === storeId);
    if (store) {
      dispatch(setSelectedStore(store));
      // Force page reload to update all data
      window.location.reload();
    }
  };

  if (isLoading || !selectedStore) {
    return (
      <div className='text-muted-foreground flex items-center gap-2 px-2 py-1 text-sm'>
        <StoreIcon className='h-4 w-4' />
        <span>Loading stores...</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <StoreIcon className='text-muted-foreground h-4 w-4' />
      <Select value={selectedStore._id} onValueChange={handleStoreChange}>
        <SelectTrigger className='h-8 w-full'>
          <SelectValue>
            <span className='font-medium'>{selectedStore.name}</span>
            {selectedStore.code && (
              <span className='text-muted-foreground ml-1'>
                ({selectedStore.code})
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store._id} value={store._id}>
              <div className='flex flex-col'>
                <span className='font-medium'>{store.name}</span>
                {store.code && (
                  <span className='text-muted-foreground text-xs'>
                    {store.code}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
