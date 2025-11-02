import {
  BasicQueryParams,
  CreateInvoicePayload,
} from '@/interfaces/payload.interface';
import {
  GetAllSalesAPIResponse,
  GetInvoiceAPIResponse,
  UpdateInvoiceAPIResponse,
} from '@/interfaces/response.interface';
import { appendQueryParams } from '@/lib/helper';
import logger from '@/lib/logger';
import { customBaseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const salesApi = createApi({
  reducerPath: 'sales',
  tagTypes: ['sales', 'invoice'],
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getAllSales: builder.query<GetAllSalesAPIResponse, BasicQueryParams>({
      query: (params) => ({
        url: appendQueryParams(`/sales`, params),
      }),
      providesTags: ['sales'],
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
      providesTags: ['invoice'],
    }),

    updateInvoice: builder.mutation<
      UpdateInvoiceAPIResponse,
      { id: string; payload: Partial<CreateInvoicePayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/sales?id=${id}`,
        method: 'PUT',
        body: payload,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedInvoice } = await queryFulfilled;

          if (!updatedInvoice.data) return;

          salesApi.util
            .selectInvalidatedBy(getState(), [{ type: 'sales' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllSales') return;

              dispatch(
                salesApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.sales) {
                      const customerIndex = draft.data.sales.findIndex(
                        (sale) => sale._id === id
                      );
                      if (customerIndex >= 0) {
                        draft.data.sales[customerIndex] = {
                          ...draft.data.sales[customerIndex],
                          ...updatedInvoice.data,
                        };
                      }
                    }
                  }
                )
              );
            });
        } catch (error) {
          logger(error, 'Error');
        }
      },
      invalidatesTags: (_, error) => (error ? [] : ['invoice']),
    }),
    deleteInvoice: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/sales?id=${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          salesApi.util
            .selectInvalidatedBy(getState(), [{ type: 'sales' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllSales') return;

              dispatch(
                salesApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.sales) {
                      draft.data.sales = draft.data.sales.filter(
                        (sale) => sale._id !== id
                      );
                    }
                  }
                )
              );
            });
        } catch (error) {
          logger(error, 'Error');
        }
      },
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetAllSalesQuery,
  useGetInvoiceQuery,
  useDeleteInvoiceMutation,
  useUpdateInvoiceMutation,
} = salesApi;
