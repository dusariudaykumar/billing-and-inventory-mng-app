import {
  CreateCustomerPayload,
  CreateCutomerAPIResponse,
  GetAllCustomersAPIResponse,
} from '@/interfaces/response.interface';
import { baseQuery } from '@/store/base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customer',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllCustomer: builder.query<GetAllCustomersAPIResponse, void>({
      query: () => ({
        url: `/customers`,
        method: 'GET',
      }),
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
    }),
  }),
});

export const { useGetAllCustomerQuery, useCreateNewCustomerMutation } =
  customerApi;
