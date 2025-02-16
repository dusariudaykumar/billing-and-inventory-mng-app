import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query';

export const getAPIBaseURL = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000/api';
  } else {
    return process.env.NEXT_PUBLIC_API_BASEURL;
  }
};

export const baseQuery = retry(
  fetchBaseQuery({
    baseUrl: getAPIBaseURL(),
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  { maxRetries: 0 }
);
