import logger from '@/lib/logger';
import { logout } from '@/store/slice/authSlice';
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
 */
export const customBaseQuery = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle Unauthorized Errors (Token Expired)
  if (result.error && result.error.status === 401) {
    logger('Unauthorized request. Logging out user...');
    api.dispatch(logout());
  }

  return result;
};
