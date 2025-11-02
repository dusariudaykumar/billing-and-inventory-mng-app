import { createApi } from '@reduxjs/toolkit/query/react';

import { appendQueryParams } from '@/lib/helper';

import { customBaseQuery } from '@/store/base-query';

import { BasicQueryParams } from '@/interfaces/payload.interface';
import {
  AddNewItemToInventoryAPIResponse,
  AddNewItemToInventoryPayload,
  GetAllItemsFromInventoryAPIResponse,
  UpdateInventoryItemAPIResponse,
} from '@/interfaces/response.interface';
import logger from '@/lib/logger';

export const inventoryApi = createApi({
  reducerPath: 'inventory',
  baseQuery: customBaseQuery,
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
        try {
          const { data: newItem } = await queryFulfilled;

          if (!newItem.data) return;

          inventoryApi.util
            .selectInvalidatedBy(getState(), [{ type: 'items' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllItemsFromInventory') return;

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
        } catch (error) {
          logger(error, 'Error');
        }
      },
    }),

    updateInventoryItem: builder.mutation<
      UpdateInventoryItemAPIResponse,
      { id: string; payload: Partial<AddNewItemToInventoryPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/inventory?id=${id}`,
        method: 'PUT',
        body: payload,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: updatedInventoryItem } = await queryFulfilled;

          if (!updatedInventoryItem.data) return;

          inventoryApi.util
            .selectInvalidatedBy(getState(), [{ type: 'items' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllItemsFromInventory') return;

              dispatch(
                inventoryApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.items) {
                      const itemIndex = draft.data.items.findIndex(
                        (item) => item._id === id
                      );
                      if (itemIndex >= 0) {
                        draft.data.items[itemIndex] = {
                          ...draft.data.items[itemIndex],
                          ...updatedInventoryItem.data,
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
    deleteInventoryItem: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/inventory?id=${id}`,
        method: 'DELETE',
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          await queryFulfilled;
          inventoryApi.util
            .selectInvalidatedBy(getState(), [{ type: 'items' }])
            .forEach(({ originalArgs, endpointName }) => {
              if (endpointName !== 'getAllItemsFromInventory') return;

              dispatch(
                inventoryApi.util.updateQueryData(
                  endpointName,
                  originalArgs,
                  (draft) => {
                    if (draft.data?.items) {
                      draft.data.items = draft.data.items.filter(
                        (item) => item._id !== id
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
  useGetAllItemsFromInventoryQuery,
  useAddNewItemToInventoryMutation,
  useDeleteInventoryItemMutation,
  useUpdateInventoryItemMutation,
} = inventoryApi;
