import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from '@/store/base-query';

import {
  CreateSupplierAPIResponse,
  CreateSupplierPayload,
  GetAllSuppliersAPIResponse,
} from '@/interfaces/response.interface';

export const supplierApi = createApi({
  reducerPath: 'supplier',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<GetAllSuppliersAPIResponse, void>({
      query: () => ({
        url: `/suppliers`,
        method: 'GET',
      }),
    }),
    createNewSupplier: builder.mutation<
      CreateSupplierAPIResponse,
      CreateSupplierPayload
    >({
      query: (payload) => ({
        url: `/suppliers`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data?.data) {
          dispatch(
            supplierApi.util.updateQueryData(
              'getAllSuppliers',
              undefined,
              (draft) => {
                if (draft.data) {
                  draft.data.unshift(data.data!);
                } else {
                  draft.data = [data.data!];
                }
              }
            )
          );
        } else {
          console.error(
            'API response does not contain expected data structure'
          );
        }
      },
    }),
  }),
});

export const { useGetAllSuppliersQuery, useCreateNewSupplierMutation } =
  supplierApi;
