import { createApi } from '@reduxjs/toolkit/query/react';

import { appendQueryParams } from '@/lib/helper';

import { baseQuery } from '@/store/base-query';

import {
  CreateCustomerPayload,
  CreateCutomerAPIResponse,
  GetAllCustomersAPIResponse,
} from '@/interfaces/response.interface';

export const customerApi = createApi({
  reducerPath: 'customer',
  baseQuery: baseQuery,
  tagTypes: ['customers'],
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
      GetAllCustomersAPIResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: appendQueryParams(`/customers`, params),
        method: 'GET',
      }),
      providesTags: ['customers'],
    }),
    createNewCustomer: builder.mutation<
      CreateCutomerAPIResponse,
      CreateCustomerPayload
    >({
      query: (payload) => ({
        url: `/customers`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled, getState }) {
        const { data: updatedCustomer } = await queryFulfilled;

        if (!updatedCustomer.data) return;

        customerApi.util
          .selectInvalidatedBy(getState(), [{ type: 'customers' }])
          .forEach(({ originalArgs, endpointName }) => {
            if (endpointName !== 'getAllCustomers') return;
            // Safely update the `getAllCustomer` cache by adding the new customer at the top
            dispatch(
              customerApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  if (draft.data) {
                    if (draft.data?.customers) {
                      draft.data.customers.unshift(updatedCustomer.data!);
                    } else {
                      draft.data.customers = [updatedCustomer.data!];
                    }
                  }
                }
              )
            );
          });
      },
    }),
  }),
});

export const { useGetAllCustomersQuery, useCreateNewCustomerMutation } =
  customerApi;
