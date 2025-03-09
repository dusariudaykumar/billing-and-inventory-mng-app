import { createApi } from '@reduxjs/toolkit/query/react';

import { appendQueryParams } from '@/lib/helper';

import { baseQuery } from '@/store/base-query';

import { BasicQueryParams } from '@/interfaces/payload.interface';
import {
  CreateCustomerPayload,
  CreateCutomerAPIResponse,
  GetAllCustomersAPIResponse,
  UpdateCustomerAPIResponse,
} from '@/interfaces/response.interface';
import logger from '@/lib/logger';

export const customerApi = createApi({
  reducerPath: 'customer',
  baseQuery: baseQuery,
  tagTypes: ['customers'],
  endpoints: (builder) => ({
    getAllCustomers: builder.query<
      GetAllCustomersAPIResponse,
      BasicQueryParams
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
        try {
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
        } catch (error) {
          logger(error, 'Error');
        }
      },
    }),
    updateCustomer: builder.mutation<
      UpdateCustomerAPIResponse,
      { id: string; payload: Partial<CreateCustomerPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/customers?id=${id}`,
        method: 'PUT',
        body: payload,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedCustomer } = await queryFulfilled;

          if (!updatedCustomer.data) return;

          customerApi.util
            .selectInvalidatedBy(getState(), [{ type: 'customers' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllCustomers') return;

              dispatch(
                customerApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.customers) {
                      const customerIndex = draft.data.customers.findIndex(
                        (customer) => customer._id === id
                      );
                      if (customerIndex >= 0) {
                        draft.data.customers[customerIndex] = {
                          ...draft.data.customers[customerIndex],
                          ...updatedCustomer.data,
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
    }),
    deleteCustomer: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/customers?id=${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          customerApi.util
            .selectInvalidatedBy(getState(), [{ type: 'customers' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllCustomers') return;

              dispatch(
                customerApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.customers) {
                      draft.data.customers = draft.data.customers.filter(
                        (customer) => customer._id !== id
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
  useGetAllCustomersQuery,
  useCreateNewCustomerMutation,
  useDeleteCustomerMutation,
  useUpdateCustomerMutation,
} = customerApi;
