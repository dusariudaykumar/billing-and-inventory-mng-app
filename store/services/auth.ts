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
        url: `/auth`,
        method: 'POST',
        body: payload,
      }),
    }),
    verifyUser: builder.query<UserAPIResponse, void>({
      query: () => `/auth`,
    }),
    logout: builder.query<void, void>({
      query: () => {
        return {
          url: `/auth`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const { useLoginMutation, useLazyLogoutQuery, useVerifyUserQuery } =
  authApi;
