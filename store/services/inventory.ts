import { createApi } from '@reduxjs/toolkit/query/react';

import { appendQueryParams } from '@/lib/helper';

import { baseQuery } from '@/store/base-query';

import { BasicQueryParams } from '@/interfaces/payload.interface';
import {
  AddNewItemToInventoryAPIResponse,
  AddNewItemToInventoryPayload,
  GetAllItemsFromInventoryAPIResponse,
} from '@/interfaces/response.interface';

export const inventoryApi = createApi({
  reducerPath: 'inventory',
  baseQuery: baseQuery,
  tagTypes: ['items'],
  endpoints: (builder) => ({
    getAllItemsFromInventory: builder.query<
      GetAllItemsFromInventoryAPIResponse,
      BasicQueryParams
    >({
      query: (params) => ({
        url: appendQueryParams(`/inventory`, params),
        method: 'GET',
      }),
      providesTags: ['items'],
    }),
    AddNewItemToInventory: builder.mutation<
      AddNewItemToInventoryAPIResponse,
      AddNewItemToInventoryPayload
    >({
      query: (payload) => ({
        url: `/inventory`,
        method: 'POST',
        body: payload,
      }),
      async onQueryStarted(payload, { dispatch, queryFulfilled, getState }) {
        const { data: newItem } = await queryFulfilled;

        if (!newItem.data) return;

        inventoryApi.util
          .selectInvalidatedBy(getState(), [{ type: 'items' }])
          .forEach(({ originalArgs, endpointName }) => {
            if (endpointName !== 'getAllItemsFromInventory') return;
            // Safely update the `getAllCustomer` cache by adding the new customer at the top
            dispatch(
              inventoryApi.util.updateQueryData(
                endpointName,
                originalArgs,
                (draft) => {
                  if (draft.data) {
                    if (draft.data?.items) {
                      draft.data.items.unshift(newItem.data!);
                    } else {
                      draft.data.items = [newItem.data!];
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

export const {
  useGetAllItemsFromInventoryQuery,
  useAddNewItemToInventoryMutation,
} = inventoryApi;
