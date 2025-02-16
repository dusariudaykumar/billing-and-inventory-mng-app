'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';

import { Inventory } from '@/interfaces/response.interface';

type InventoryColumn = Inventory;

export const columns: ColumnDef<InventoryColumn>[] = [
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
];
