import { UserAPIResponse } from '@/interfaces/response.interface';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<
      UserAPIResponse,
      { email: string; password: string }
    >({
      query: (payload) => ({
        url: `/auth/login`,
        method: 'POST',
        body: payload,
      }),
    }),
    verifyUser: builder.query<UserAPIResponse, void>({
      query: () => `/auth/verify`,
    }),
    logout: builder.query<void, void>({
      query: () => `/auth/logout`,
    }),
  }),
});

export const { useLoginMutation, useLazyLogoutQuery, useVerifyUserQuery } =
  authApi;
