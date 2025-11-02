import { createApi } from '@reduxjs/toolkit/query/react';

import { customBaseQuery } from '@/store/base-query';

import { GetDashboardAPIResponse } from '@/interfaces/response.interface';

export const dashboardApi = createApi({
  reducerPath: 'dashboard',
  baseQuery: customBaseQuery,
  tagTypes: ['dashboard'],
  endpoints: (builder) => ({
    getDashboardData: builder.query<GetDashboardAPIResponse, void>({
      query: () => ({
        url: `/dashboard`,
        method: 'GET',
      }),
      providesTags: ['dashboard'],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
