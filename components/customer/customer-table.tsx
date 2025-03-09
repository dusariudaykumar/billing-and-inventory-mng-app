'use client';

import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

import logger from '@/lib/logger';

import { getCustomerColumns } from '@/components/customer/columns';
import { CustomerModel } from '@/components/customer/customer-model';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';

import {
  useCreateNewCustomerMutation,
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
  useUpdateCustomerMutation,
} from '@/store/services/customer';

import AlertDialoagModal from '@/components/alert-dailog-modal';
import { useLoading } from '@/context/loader-provider';
import {
  CreateCustomerPayload,
  Customer,
} from '@/interfaces/response.interface';

const CustomerTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllCustomersQuery({});
  const [createCustomer] = useCreateNewCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [openCustomerModel, setOpenCustomerModel] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | undefined>(
    undefined
  );
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();

  const createNewCustomer = async (newCustomer: CreateCustomerPayload) => {
    try {
      showLoader();
      await createCustomer(newCustomer).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const updateExistingCustomer = async (
    updatedCustomer: CreateCustomerPayload
  ) => {
    if (!selectedCustomer) return;

    try {
      showLoader();
      await updateCustomer({
        id: selectedCustomer._id,
        payload: updatedCustomer,
      }).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      showLoader();
      await deleteCustomer(customerToDelete).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
      setDeleteDialogOpen(false);
      setCustomerToDelete(undefined);
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenCustomerModel(true);
  };

  const handleDelete = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
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
        <DataTable
          data={data?.data?.customers || []}
          columns={getCustomerColumns(handleEdit, handleDelete)}
        />
      </div>
      {openCustomerModel && (
        <CustomerModel
          OnClose={() => setOpenCustomerModel(false)}
          isOpen={openCustomerModel}
          customer={selectedCustomer}
          onSubmit={async (customer) => {
            if (selectedCustomer) {
              await updateExistingCustomer(customer);
            } else {
              await createNewCustomer(customer);
            }
            setOpenCustomerModel(false);
            setSelectedCustomer(undefined);
          }}
        />
      )}
      {deleteDialogOpen && (
        <AlertDialoagModal
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title='Are you sure?'
          description='This action cannot be undone. This will permanently delete the customer and remove their data from our database.'
          onConfirm={handleDeleteCustomer}
        />
      )}
    </div>
  );
};

export default CustomerTable;
