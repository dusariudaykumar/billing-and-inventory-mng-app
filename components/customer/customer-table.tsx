'use client';

import { columns } from '@/components/customer/columns';
import { DataTable } from '@/components/table/data-table';
import logger from '@/lib/logger';
import { useGetAllCustomerQuery } from '@/store/services/customer';
import React, { useEffect } from 'react';

const CustomerTable = () => {
  const { data } = useGetAllCustomerQuery();
  logger(data);
  return (
    <div className='flex h-full flex-1 flex-col space-y-8 p-8 md:flex'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      <DataTable
        data={data?.data || []}
        columns={columns}
        containerClassname='h-fit max-h-80 overflow-y-auto relative'
      />
    </div>
  );
};

export default CustomerTable;
