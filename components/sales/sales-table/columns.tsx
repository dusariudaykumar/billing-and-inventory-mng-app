'use client';

import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceStatus, Sale } from '@/interfaces/response.interface';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<Sale>[] = [
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
    accessorKey: 'customerInfo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const {
        customerInfo: { name },
      } = row.original;
      return (
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarFallback>
              {name?.slice(0, 2)?.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className='text-sm'>{name}</p>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => <div>₹{row.getValue('totalAmount')}</div>,
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
      const color =
        status === InvoiceStatus.PAID
          ? 'bg-green-500 hover:bg-green-500'
          : status === InvoiceStatus.PARTIALLY_PAID
          ? 'bg-blue-500 hover:bg-blue-500'
          : 'bg-red-500 hover:bg-red-500';
      return (
        <Badge className={cn(color, 'font-medium')}>{status as string}</Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'action',
    header: () => <div></div>,
    cell: () => {
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
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
];
