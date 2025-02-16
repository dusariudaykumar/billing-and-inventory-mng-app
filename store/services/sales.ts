import {
  BasicQueryParams,
  CreateInvoicePayload,
} from '@/interfaces/payload.interface';
import { GetAllSalesAPIResponse } from '@/interfaces/response.interface';
import { appendQueryParams } from '@/lib/helper';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const salesApi = createApi({
  reducerPath: 'sales',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllSales: builder.query<GetAllSalesAPIResponse, BasicQueryParams>({
      query: (params) => ({
        url: appendQueryParams(`/sales`, params),
      }),
    }),
    createInvoice: builder.mutation<void, CreateInvoicePayload>({
      query: (payload) => ({
        url: `/sales`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const { useCreateInvoiceMutation, useGetAllSalesQuery } = salesApi;
