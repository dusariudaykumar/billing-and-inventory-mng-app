import {
  BasicQueryParams,
  CreateInvoicePayload,
} from '@/interfaces/payload.interface';
import {
  GetAllSalesAPIResponse,
  GetInvoiceAPIResponse,
} from '@/interfaces/response.interface';
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
    getInvoice: builder.query<GetInvoiceAPIResponse, string>({
      query: (id) => ({
        url: `/sales?id=${id}`,
      }),
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetAllSalesQuery,
  useGetInvoiceQuery,
} = salesApi;
