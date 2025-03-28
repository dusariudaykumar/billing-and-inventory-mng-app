'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Customer } from '@/interfaces/response.interface';
import { Edit, MoreHorizontalIcon, Trash } from 'lucide-react';
import Link from 'next/link';

export const getCustomerColumns = (
  handleEdit: (customer: Customer) => void,
  handleDelete: (id: string) => void
) => {
  const columns: ColumnDef<Customer>[] = [
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
        <DataTableColumnHeader column={column} title='# Customer' />
      ),
      cell: ({ row }) => (
        <Link
          href={`/customer-details/${row.original._id}`}
          className='text-sm text-blue-600 underline underline-offset-2'
        >
          #{row.getValue('customerID')}
        </Link>
      ),
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

    {
      id: 'actions',
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <div className='flex justify-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => handleEdit(customer)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(customer._id)}
                  className='text-destructive focus:text-destructive'
                >
                  <Trash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  return columns;
};
