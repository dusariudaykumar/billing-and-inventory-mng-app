'use client';

import {
  isFulfilled,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { toast } from 'sonner';

export const errorHandlingMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action: any) => {
    if (isRejectedWithValue(action)) {
      const data = action?.payload?.data;
      if (data?.message) {
        toast.error(data?.message);
      }
      if (data?.redirectToLogin) {
        window.location.href = `/login`;
      }
    }
    if (isFulfilled(action)) {
      if (action?.payload?.message) {
        toast.success(action?.payload?.message);
      }
    }
    return next(action);
  };
