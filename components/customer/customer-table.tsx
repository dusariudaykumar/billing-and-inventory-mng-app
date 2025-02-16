'use client';

import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import logger from '@/lib/logger';

import { columns } from '@/components/customer/columns';
import { CustomerModel } from '@/components/customer/customer-model';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';

import {
  useCreateNewCustomerMutation,
  useGetAllCustomersQuery,
} from '@/store/services/customer';

import { useLoading } from '@/context/loader-provider';
import { CreateCustomerPayload } from '@/interfaces/response.interface';

const CustomerTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllCustomersQuery({});
  const [createCustomer] = useCreateNewCustomerMutation();
  logger(data);

  const [openCustomerModel, setOpenCustomerModel] = useState<boolean>(false);

  const createNewCustomer = async (newCustomer: CreateCustomerPayload) => {
    try {
      showLoader();
      const response = await createCustomer(newCustomer).unwrap();
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
          <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
          <Button onClick={() => setOpenCustomerModel(true)}>
            <CirclePlus /> Add Customer
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className='max-h-full w-full overflow-auto'>
        <DataTable data={data?.data?.customers || []} columns={columns} />
      </div>
      {openCustomerModel && (
        <CustomerModel
          OnClose={() => setOpenCustomerModel(false)}
          isOpen={openCustomerModel}
          onSubmit={async (customer) => {
            await createNewCustomer(customer);
            setOpenCustomerModel(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomerTable;
