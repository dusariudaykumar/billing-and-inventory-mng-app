import { createApi } from '@reduxjs/toolkit/query/react';

import { customBaseQuery } from '@/store/base-query';

import { BasicQueryParams } from '@/interfaces/payload.interface';
import {
  CreateSupplierAPIResponse,
  CreateSupplierPayload,
  GetAllSuppliersAPIResponse,
  UpdateSupplierAPIResponse,
} from '@/interfaces/response.interface';
import { appendQueryParams } from '@/lib/helper';
import logger from '@/lib/logger';

export const supplierApi = createApi({
  reducerPath: 'supplier',
  baseQuery: customBaseQuery,
  tagTypes: ['suppliers'],
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<
      GetAllSuppliersAPIResponse,
      BasicQueryParams
    >({
      query: (params) => ({
        url: appendQueryParams(`/suppliers`, params),
        method: 'GET',
      }),
      providesTags: ['suppliers'],
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
      async onQueryStarted(payload, { dispatch, queryFulfilled, getState }) {
        const { data: newSupplier } = await queryFulfilled;

        if (!newSupplier?.data) return;

        supplierApi.util
          .selectInvalidatedBy(getState(), [{ type: 'suppliers' }])
          .forEach(({ originalArgs, endpointName }) => {
            if (endpointName !== 'getAllSuppliers') return;

            dispatch(
              supplierApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  if (draft.data) {
                    if (draft.data?.suppliers) {
                      draft.data.suppliers.unshift(newSupplier.data!);
                    } else {
                      draft.data.suppliers = [newSupplier.data!];
                    }
                  }
                }
              )
            );
          });
      },
    }),
    updateSupplier: builder.mutation<
      UpdateSupplierAPIResponse,
      { id: string; payload: Partial<CreateSupplierPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/suppliers?id=${id}`,
        method: 'PUT',
        body: payload,
      }),

      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedSupplier } = await queryFulfilled;

          if (!updatedSupplier.data) return;

          supplierApi.util
            .selectInvalidatedBy(getState(), [{ type: 'suppliers' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllSuppliers') return;

              dispatch(
                supplierApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.suppliers) {
                      const supplierIndex = draft.data.suppliers.findIndex(
                        (supplier) => supplier._id === id
                      );
                      if (supplierIndex >= 0) {
                        draft.data.suppliers[supplierIndex] = {
                          ...draft.data.suppliers[supplierIndex],
                          ...updatedSupplier.data,
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
    deleteSupplier: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/suppliers?id=${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;

          supplierApi.util
            .selectInvalidatedBy(getState(), [{ type: 'suppliers' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllSuppliers') return;

              dispatch(
                supplierApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.suppliers) {
                      draft.data.suppliers = draft.data.suppliers.filter(
                        (supplier) => supplier._id !== id
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
  useGetAllSuppliersQuery,
  useCreateNewSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
} = supplierApi;
