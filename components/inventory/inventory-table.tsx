'use client';

import AlertDialoagModal from '@/components/alert-dailog-modal';
import { getInventoryColumns } from '@/components/inventory/columns';
import { ItemModal } from '@/components/inventory/inventory-modal';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loader-provider';
import {
  AddNewItemToInventoryPayload,
  Inventory,
} from '@/interfaces/response.interface';
import logger from '@/lib/logger';
import {
  useAddNewItemToInventoryMutation,
  useDeleteInventoryItemMutation,
  useGetAllItemsFromInventoryQuery,
  useUpdateInventoryItemMutation,
} from '@/store/services/inventory';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

const InventoryTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllItemsFromInventoryQuery({});
  const [addNewItemToInventory] = useAddNewItemToInventoryMutation();
  const [updateInventoryItem] = useUpdateInventoryItemMutation();
  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  const [openInventoryModel, setOpenInventoryModel] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | undefined>();

  const addNewItem = async (newItem: AddNewItemToInventoryPayload) => {
    try {
      showLoader();
      await addNewItemToInventory(newItem).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const updateItem = async (item: AddNewItemToInventoryPayload) => {
    if (!selectedItem) return;

    try {
      showLoader();
      await updateInventoryItem({
        id: selectedItem._id,
        payload: item,
      }).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      showLoader();
      await deleteInventoryItem(itemToDelete).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
      setDeleteDialogOpen(false);
      setItemToDelete(undefined);
    }
  };

  const handleEdit = (item: Inventory) => {
    setSelectedItem(item);
    setOpenInventoryModel(true);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 overflow-auto p-8'>
      {/* <InvoiceTemplate /> */}
      {/* <InvoiceTemplate
        client={sampleData.client}
        invoiceNumber={sampleData.invoiceNumber}
        issueDate={sampleData.issueDate}
        projects={sampleData.projects}
        subTotal={sampleData.subTotal}
        taxRate={sampleData.taxRate}
        total={sampleData.total}
      /> */}
      <div className='flex items-center justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Inventory</h2>
          <Button onClick={() => setOpenInventoryModel(true)}>
            <CirclePlus /> Add New Item
          </Button>
        </div>
      </div>
      {/* Table Container */}
      <div className='max-h-full w-full overflow-auto'>
        <DataTable
          data={data?.data?.items || []}
          columns={getInventoryColumns(handleEdit, handleDelete)}
        />
      </div>
      {openInventoryModel && (
        <ItemModal
          OnClose={() => setOpenInventoryModel(false)}
          isOpen={openInventoryModel}
          item={selectedItem}
          onSubmit={async (item) => {
            if (selectedItem) {
              await updateItem(item);
            } else {
              await addNewItem(item);
            }
            setOpenInventoryModel(false);
            setSelectedItem(undefined);
          }}
        />
      )}

      {deleteDialogOpen && (
        <AlertDialoagModal
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title='Are you sure?'
          description='This action cannot be undone. This will permanently delete this item from inventory.'
          onConfirm={handleDeleteItem}
        />
      )}
    </div>
  );
};

export default InventoryTable;
