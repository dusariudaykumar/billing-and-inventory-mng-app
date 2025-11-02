import { getFromLocalStorage, setInLocalStorage } from '@/lib/helper';
import { RootState } from '@/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Store {
  _id: string;
  name: string;
  code: string;
  address?: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  isActive: boolean;
}

interface StoreInitialState {
  selectedStore: Store | null;
  stores: Store[];
  loading: boolean;
}

const getInitialStore = (): Store | null => {
  const stored = getFromLocalStorage('selected-store');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: StoreInitialState = {
  selectedStore: getInitialStore(),
  stores: [],
  loading: false,
};

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setSelectedStore: (state, action: PayloadAction<Store>) => {
      state.selectedStore = action.payload;
      setInLocalStorage('selected-store', JSON.stringify(action.payload));
    },
    setStores: (state, action: PayloadAction<Store[]>) => {
      state.stores = action.payload;
      // If no store is selected and stores are available, select the first one
      if (!state.selectedStore && action.payload.length > 0) {
        state.selectedStore = action.payload[0];
        setInLocalStorage('selected-store', JSON.stringify(action.payload[0]));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSelectedStore, setStores, setLoading } = storeSlice.actions;

export const getSelectedStore = (state: RootState) => state.store.selectedStore;
export const getStores = (state: RootState) => state.store.stores;
export const getStoreLoading = (state: RootState) => state.store.loading;

export default storeSlice.reducer;
