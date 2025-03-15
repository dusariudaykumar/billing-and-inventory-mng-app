'use client';

import AlertDialoagModal from '@/components/alert-dailog-modal';
import { getInventoryColumns } from '@/components/inventory/columns';
import { ItemModal } from '@/components/inventory/inventory-modal';
import { SearchBar } from '@/components/searchbar';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loader-provider';
import { useDebounce } from '@/hooks/use-debounce';
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
import { useEffect, useState } from 'react';

const InventoryTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const [addNewItemToInventory] = useAddNewItemToInventoryMutation();
  const [updateInventoryItem] = useUpdateInventoryItemMutation();
  const [deleteInventoryItem] = useDeleteInventoryItemMutation();

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openInventoryModel, setOpenInventoryModel] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Inventory | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | undefined>();

  const debouncedSearchValue = useDebounce(searchValue);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue]);

  const { data } = useGetAllItemsFromInventoryQuery({
    search: debouncedSearchValue,
    page: currentPage,
  });

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
        <div className=' border border-b-0 p-2'>
          <SearchBar
            onChange={(value) => setSearchValue(value)}
            value={searchValue}
            placeholderText='Search'
            className='w-full p-2'
            containerClass='max-w-[300px] w-full'
          />
        </div>

        <DataTable<Inventory>
          data={data?.data?.items || []}
          columns={getInventoryColumns(handleEdit, handleDelete)}
          containerClassname='rounded-t-none'
          onPaginationChange={(page) => setCurrentPage(page)}
          totalPages={data?.data?.totalPages || 0}
          currentPage={currentPage}
          getRowId={(row) => row._id}
          totalCount={data?.data?.totalResults || 0}
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
