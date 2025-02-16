import { authApi } from '@/store/services/auth';
import { customerApi } from '@/store/services/customer';
import { inventoryApi } from '@/store/services/inventory';
import { salesApi } from '@/store/services/sales';
import { supplierApi } from '@/store/services/supplier';
import { authSlice } from '@/store/slice/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { errorHandlingMiddleware } from './../middleware/error-handling';

export const makeStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
      [supplierApi.reducerPath]: supplierApi.reducer,
      [inventoryApi.reducerPath]: inventoryApi.reducer,
      [salesApi.reducerPath]: salesApi.reducer,
      authSlice: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        customerApi.middleware,
        supplierApi.middleware,
        inventoryApi.middleware,
        salesApi.middleware,
        errorHandlingMiddleware,
      ]),
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
