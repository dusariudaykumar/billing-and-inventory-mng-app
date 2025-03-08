import { UserAPIResponse } from '@/interfaces/response.interface';
import { customBaseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: customBaseQuery,
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
    signup: builder.mutation<
      UserAPIResponse,
      { name: string; email: string; password: string }
    >({
      query: (payload) => ({
        url: `/auth`,
        method: 'PUT',
        body: payload,
      }),
    }),
    verifyUser: builder.query<UserAPIResponse, void>({
      query: () => `/auth`,
    }),
    logout: builder.mutation<undefined, void>({
      query: () => ({ url: `/auth`, method: 'DELETE' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyUserQuery,
  useLazyVerifyUserQuery,
  useSignupMutation,
} = authApi;
