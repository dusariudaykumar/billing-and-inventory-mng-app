'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import { Inventory } from '@/interfaces/response.interface';
import { Edit, MoreHorizontalIcon, Trash } from 'lucide-react';

type InventoryColumn = Inventory;

export const getInventoryColumns = (
  handleEdit: (item: Inventory) => void,
  handleDelete: (id: string) => void
) => {
  const columns: ColumnDef<InventoryColumn>[] = [
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
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Item' />
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'units',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Units' />
      ),
      cell: ({ row }) => <div>{row.getValue('units')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Quantity' />
      ),
      cell: ({ row }) => {
        return <div>{row.getValue('quantity')}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'purchasePrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Purchase Price' />
      ),
      cell: ({ row }) => <div>₹{row.getValue('purchasePrice')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'sellingPrice',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sales Price' />
      ),
      cell: ({ row }) => <div>₹{row.getValue('sellingPrice')}</div>,
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
