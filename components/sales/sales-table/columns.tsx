'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceStatus, Sale } from '@/interfaces/response.interface';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import Link from 'next/link';

export const getSalesColumns = (
  handleEdit: (id: string) => void,
  handleDelete: (id: string) => void
) => {
  const columns: ColumnDef<Sale>[] = [
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
      accessorKey: 'invoiceNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='# Invoice' />
      ),
      cell: ({ row }) => (
        <Link
          href={`/view-invoice/${row.original._id}`}
          className='text-sm text-blue-600 underline underline-offset-2'
        >
          0{row.getValue('invoiceNumber')}
        </Link>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'customerInfo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Customer' />
      ),
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2'>
            <p className='text-sm'>{row.original?.customerInfo?.name}</p>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'totalAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Total Amount' />
      ),
      cell: ({ row }) => <div>₹{row.getValue('totalAmount')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'customerPaid',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Customer Paid' />
      ),
      cell: ({ row }) => <div>₹{row.getValue('customerPaid')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'dueAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Due Amount' />
      ),
      cell: ({ row }) => <div>₹{row.getValue('dueAmount')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status');
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === InvoiceStatus.PAID
                ? 'bg-green-100 text-green-800'
                : status === InvoiceStatus.PARTIALLY_PAID
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {status as string}
          </span>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'action',
      header: () => <div></div>,
      cell: ({ row }) => {
        const { _id } = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
              >
                <MoreHorizontal />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              {/* <DropdownMenuItem>View</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => handleEdit(_id)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={() => handleDelete(_id)}
              >
                <Trash className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
  ];

  return columns;
};
