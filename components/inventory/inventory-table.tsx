'use client';

import { columns } from '@/components/inventory/columns';
import { ItemModal } from '@/components/inventory/inventory-modal';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loader-provider';
import { AddNewItemToInventoryPayload } from '@/interfaces/response.interface';
import logger from '@/lib/logger';
import {
  useAddNewItemToInventoryMutation,
  useGetAllItemsFromInventoryQuery,
} from '@/store/services/inventory';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

const InventoryTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllItemsFromInventoryQuery({});
  const [addNewItemToInventory] = useAddNewItemToInventoryMutation();

  const [openInventoryModel, setOpenInventoryModel] = useState<boolean>(false);

  const addNewItem = async (newItem: AddNewItemToInventoryPayload) => {
    try {
      showLoader();
      const response = await addNewItemToInventory(newItem).unwrap();
      logger(response);
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
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
        <DataTable data={data?.data?.items || []} columns={columns} />
      </div>
      {openInventoryModel && (
        <ItemModal
          OnClose={() => setOpenInventoryModel(false)}
          isOpen={openInventoryModel}
          onSubmit={async (item) => {
            await addNewItem(item);
            setOpenInventoryModel(false);
          }}
        />
      )}
    </div>
  );
};

export default InventoryTable;
