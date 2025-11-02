import { authApi } from '@/store/services/auth';
import { customerApi } from '@/store/services/customer';
import { dashboardApi } from '@/store/services/dashboard';
import { inventoryApi } from '@/store/services/inventory';
import { salesApi } from '@/store/services/sales';
import { storeApi } from '@/store/services/store';
import { supplierApi } from '@/store/services/supplier';
import { authSlice } from '@/store/slice/authSlice';
import storeSlice from '@/store/slice/storeSlice';
import { configureStore } from '@reduxjs/toolkit';
import { errorHandlingMiddleware } from './../middleware/error-handling';

export const makeStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [supplierApi.reducerPath]: supplierApi.reducer,
      [inventoryApi.reducerPath]: inventoryApi.reducer,
      [salesApi.reducerPath]: salesApi.reducer,
      [storeApi.reducerPath]: storeApi.reducer,
      authSlice: authSlice.reducer,
      store: storeSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        customerApi.middleware,
        dashboardApi.middleware,
        supplierApi.middleware,
        inventoryApi.middleware,
        salesApi.middleware,
        storeApi.middleware,
        errorHandlingMiddleware,
      ]),
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
