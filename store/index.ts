import { errorHandlingMiddleware } from './../middleware/error-handling';
import { authApi } from '@/store/services/auth';
import { customerApi } from '@/store/services/customer';
import { authSlice } from '@/store/slice/authSlice';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [customerApi.reducerPath]: customerApi.reducer,
      authSlice: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        customerApi.middleware,
        errorHandlingMiddleware,
      ]),
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
