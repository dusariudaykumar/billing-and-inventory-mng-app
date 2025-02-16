'use client';

import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import logger from '@/lib/logger';

import { CustomerModel } from '@/components/customer/customer-model';
import { columns } from '@/components/supplier/columns';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';

import {
  useCreateNewSupplierMutation,
  useGetAllSuppliersQuery,
} from '@/store/services/supplier';

import { useLoading } from '@/context/loader-provider';
import { CreateSupplierPayload } from '@/interfaces/response.interface';

const SupplierTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllSuppliersQuery();
  const [createSupplier] = useCreateNewSupplierMutation();
  logger(data);

  const [openSupplierModel, setOpenSupplierModel] = useState<boolean>(false);

  const createNewSupplier = async (newCustomer: CreateSupplierPayload) => {
    try {
      showLoader();
      const response = await createSupplier(newCustomer).unwrap();
      logger(response);
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };
  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Suppliers</h2>
          <Button onClick={() => setOpenSupplierModel(true)}>
            <CirclePlus /> Add Supplier
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className='max-h-full w-full overflow-auto'>
        <DataTable data={data?.data || []} columns={columns} />
      </div>
      {openSupplierModel && (
        <CustomerModel
          OnClose={() => setOpenSupplierModel(false)}
          isOpen={openSupplierModel}
          onSubmit={async (customer) => {
            await createNewSupplier(customer);
            setOpenSupplierModel(false);
          }}
        />
      )}
    </div>
  );
};

export default SupplierTable;
