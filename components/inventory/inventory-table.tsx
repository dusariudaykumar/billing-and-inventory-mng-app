'use client';

import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import logger from '@/lib/logger';

import { columns } from '@/components/inventory/columns';
import { ItemModal } from '@/components/inventory/inventory-modal';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';

import {
  useAddNewItemToInventoryMutation,
  useGetAllItemsFromInventoryQuery,
} from '@/store/services/inventory';

import { useLoading } from '@/context/loader-provider';
import { AddNewItemToInventoryPayload } from '@/interfaces/response.interface';

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

  const sampleData = {
    invoiceNumber: 'BBN2351D458',
    issueDate: '20/07/2024',
    client: {
      name: 'Michael Reyes',
      social: '@Michael_Reyes|+1 123 456 789',
      billingAddress: {
        street: '854 Ave Folsom',
        city: 'San Francisco',
        state: 'CA',
        zip: '36925',
        phone: '(123) 456-7890',
      },
      shippingAddress: {
        street: '795 Folsom Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107',
        phone: '(123) 456-7890',
      },
    },
    projects: [
      {
        description: 'Project Design',
        details:
          'It is a long established fact that a reader will be distracted.',
        hours: 60,
        rate: 50,
        subtotal: 3000.0,
      },
      {
        description: 'Development',
        details:
          'It is a long established fact that a reader will be distracted.',
        hours: 100,
        rate: 50,
        subtotal: 5000.0,
      },
      {
        description: 'Testing & Bug Fixing',
        details:
          'It is a long established fact that a reader will be distracted.',
        hours: 10,
        rate: 20,
        subtotal: 200.0,
      },
    ],
    subTotal: 82000.0,
    taxRate: 0.0,
    total: 82000.0,
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
