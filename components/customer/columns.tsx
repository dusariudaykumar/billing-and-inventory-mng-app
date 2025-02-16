'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

import { ContactDetails } from '@/interfaces/response.interface';

interface CustomerColumn {
  id: string;
  customerID: string;
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
}

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customerID',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='# CustomerID' />
    ),
    cell: ({ row }) => <div>#{row.getValue('customerID')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Name' />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
    cell: ({ row }) => <div>{row.getValue('companyName')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone No.' />
    ),
    cell: ({ row }) => {
      const contactDetails = row.original?.contactDetails;
      return <div>{contactDetails?.phone}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const contactDetails = row.original?.contactDetails;
      return <div>{contactDetails?.email || 'N/A'}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
];
