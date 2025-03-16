'use client';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

import AlertDialoagModal from '@/components/alert-dailog-modal';
import { getSalesColumns } from '@/components/sales/sales-table/columns';
import { SearchBar } from '@/components/searchbar';
import { useLoading } from '@/context/loader-provider';
import { useDebounce } from '@/hooks/use-debounce';
import { Sale } from '@/interfaces/response.interface';
import logger from '@/lib/logger';
import {
  useDeleteInvoiceMutation,
  useGetAllSalesQuery,
} from '@/store/services/sales';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SalesTable = () => {
  const router = useRouter();

  const { hideLoader, showLoader } = useLoading();
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | undefined>();

  const debouncedSearchValue = useDebounce(searchValue);
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchValue]);

  const { data } = useGetAllSalesQuery({
    search: debouncedSearchValue,
    page: currentPage,
  });

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;

    try {
      showLoader();
      await deleteInvoice(invoiceToDelete).unwrap();
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
      setDeleteDialogOpen(false);
      setInvoiceToDelete(undefined);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-invoice/${id}`);
  };

  const handleDelete = (id: string) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };
  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 p-8 '>
      <div className='flex items-center justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Sales</h2>
          <Link href='/create-invoice'>
            <Button>
              <CirclePlus /> Create Invoice
            </Button>
          </Link>
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
        <DataTable<Sale>
          data={data?.data?.sales || []}
          columns={getSalesColumns(handleEdit, handleDelete)}
          containerClassname='rounded-t-none'
          onPaginationChange={(page) => setCurrentPage(page)}
          totalPages={data?.data?.totalPages || 0}
          currentPage={currentPage}
          getRowId={(row) => row._id}
          totalCount={data?.data?.totalResults || 0}
        />
      </div>

      {deleteDialogOpen && (
        <AlertDialoagModal
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title='Are you sure?'
          description='This action cannot be undone. This will permanently delete the Invoice and remove this data from our database.'
          onConfirm={handleDeleteInvoice}
        />
      )}
    </div>
  );
};

export default SalesTable;
