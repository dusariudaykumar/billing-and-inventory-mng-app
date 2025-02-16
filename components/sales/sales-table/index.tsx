'use client';

import { DataTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

import { columns } from '@/components/sales/sales-table/columns';
import { useLoading } from '@/context/loader-provider';
import { useGetAllSalesQuery } from '@/store/services/sales';
import Link from 'next/link';

const SalesTable = () => {
  const { hideLoader, showLoader } = useLoading();
  const { data } = useGetAllSalesQuery({});

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 p-8'>
      <div className='flex items-center justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
          <Link href='/create-invoice'>
            <Button>
              <CirclePlus /> Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className='max-h-full w-full overflow-auto'>
        <DataTable data={data?.data?.sales || []} columns={columns} />
      </div>
    </div>
  );
};

export default SalesTable;
