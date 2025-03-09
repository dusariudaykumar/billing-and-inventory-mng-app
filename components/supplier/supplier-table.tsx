'use client';

import AlertDialoagModal from '@/components/alert-dailog-modal';
import { getSupplierCoulmns } from '@/components/supplier/columns';
import { SupplierModel } from '@/components/supplier/supplier-model';
import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/context/loader-provider';
import {
  CreateSupplierPayload,
  Supplier,
} from '@/interfaces/response.interface';
import logger from '@/lib/logger';
import {
  useCreateNewSupplierMutation,
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
  useUpdateSupplierMutation,
} from '@/store/services/supplier';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';

const SupplierTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllSuppliersQuery({ limit: 30, page: 1 });
  const [createSupplier] = useCreateNewSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const [openSupplierModel, setOpenSupplierModel] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<
    Supplier | undefined
  >();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [supplierToDelete, setSupplierToDelete] = useState<
    string | undefined
  >();

  const createNewSupplier = async (newCustomer: CreateSupplierPayload) => {
    try {
      showLoader();
      await createSupplier(newCustomer).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const updateExistingSupplier = async (payload: CreateSupplierPayload) => {
    if (!selectedSupplier) return;

    try {
      showLoader();
      await updateSupplier({
        id: selectedSupplier._id,
        payload,
      }).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;

    try {
      showLoader();
      await deleteSupplier(supplierToDelete).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
      setDeleteDialogOpen(false);
      setSupplierToDelete(undefined);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenSupplierModel(true);
  };

  const handleDelete = (id: string) => {
    setSupplierToDelete(id);
    setDeleteDialogOpen(true);
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
        <DataTable
          data={data?.data?.suppliers || []}
          columns={getSupplierCoulmns(handleEdit, handleDelete)}
        />
      </div>
      {openSupplierModel && (
        <SupplierModel
          OnClose={() => setOpenSupplierModel(false)}
          isOpen={openSupplierModel}
          supplier={selectedSupplier}
          onSubmit={async (supplier) => {
            if (selectedSupplier) {
              await updateExistingSupplier(supplier);
            } else {
              await createNewSupplier(supplier);
            }
            setOpenSupplierModel(false);
            setSelectedSupplier(undefined);
          }}
        />
      )}

      {deleteDialogOpen && (
        <AlertDialoagModal
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title='Are you sure?'
          description='This action cannot be undone. This will permanently delete this supplier from database.'
          onConfirm={handleDeleteSupplier}
        />
      )}
    </div>
  );
};

export default SupplierTable;
