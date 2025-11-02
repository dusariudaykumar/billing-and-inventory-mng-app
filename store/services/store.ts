import { customBaseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Store {
  _id: string;
  name: string;
  code: string;
  address?: string;
  contactDetails?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  isActive: boolean;
}

interface GetAllStoresAPIResponse {
  success: boolean;
  data: Store[];
}

interface GetStoreAPIResponse {
  success: boolean;
  data: Store;
}

export const storeApi = createApi({
  reducerPath: 'storeApi',
  baseQuery: customBaseQuery,
  tagTypes: ['stores'],
  endpoints: (builder) => ({
    getAllStores: builder.query<GetAllStoresAPIResponse, void>({
      query: () => ({
        url: `/stores`,
        method: 'GET',
      }),
      providesTags: ['stores'],
    }),
    getStoreById: builder.query<GetStoreAPIResponse, string>({
      query: (id) => ({
        url: `/stores?id=${id}`,
        method: 'GET',
      }),
      providesTags: ['stores'],
    }),
  }),
});

export const { useGetAllStoresQuery, useGetStoreByIdQuery } = storeApi;
