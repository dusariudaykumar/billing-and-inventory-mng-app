import logger from '@/lib/logger';
import { logout } from '@/store/slice/authSlice';
import { getSelectedStore } from '@/store/slice/storeSlice';
import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

export const getAPIBaseURL = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000/api';
  } else {
    return process.env.NEXT_PUBLIC_API_BASEURL;
  }
};

/**
 * Base Query with error handling and token management
 */
export const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: getAPIBaseURL(),
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  { maxRetries: 0 }
);

/**
 * Custom baseQuery with error handling for authentication failures
 * and auto-injection of storeId
 */
export const customBaseQuery = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  // Skip storeId injection for auth, stores, and migration endpoints
  const url = typeof args === 'string' ? args : args?.url || '';
  const isAuthEndpoint = url.includes('/auth');
  const isStoresEndpoint = url.includes('/stores');
  const isMigrationEndpoint = url.includes('/migrate');

  // Auto-inject storeId for all other endpoints
  if (!isAuthEndpoint && !isStoresEndpoint && !isMigrationEndpoint) {
    const state = api.getState();
    const selectedStore = getSelectedStore(state);

    if (!selectedStore) {
      return {
        error: {
          status: 400,
          data: {
            success: false,
            message: 'No store selected. Please select a store.',
          },
        },
      };
    }

    // Add storeId to query params
    if (typeof args === 'string') {
      const separator = args.includes('?') ? '&' : '?';
      args = `${args}${separator}storeId=${selectedStore._id}`;
    } else {
      args = {
        ...args,
        url: args.url
          ? `${args.url}${args.url.includes('?') ? '&' : '?'}storeId=${
              selectedStore._id
            }`
          : args.url,
      };
    }
  }

  const result = await baseQuery(args, api, extraOptions);

  // Handle Unauthorized Errors (Token Expired)
  if (result.error && result.error.status === 401) {
    logger('Unauthorized request. Logging out user...');
    api.dispatch(logout());
  }

  return result;
};
