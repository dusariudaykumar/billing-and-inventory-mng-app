'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import { Paginator } from '@/components/table/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  /** Total pages count from the server (for pagination) */
  totalPages: number;
  /** Total record count from the server (for pagination) */
  totalCount?: number;
  /** Current page number (1-indexed) */
  currentPage?: number;
  /** Container class to modify the styles for table*/
  containerClassname?: string;
  /** Callback when the pagination changes.*/
  onPaginationChange: (page: number) => void;
  /**
   * Callback when the sort state changes.
   * Receives the new sorting state.
   */
  onSortChange?: (sorting: SortingState) => void;
  /**
   * Whether to enable row selection.
   * When true, a checkbox column is added.
   */
  enableRowSelection?: boolean;
  /** Function to extract a unique row id. */
  getRowId?: (row: T) => string;

  className?: string;

  getRowClassName?: (row: T) => string;

  emptyState?: React.ReactNode;
}

export const DataTable = <T extends object>({
  columns,
  data,
  containerClassname,
  onPaginationChange,
  currentPage = 0,
  totalPages,
  totalCount = 0,
  enableRowSelection = true,
  getRowId,
  className,
}: Props<T>) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: enableRowSelection,
    // state: {
    //   rowSelection, // Optional: for row selection
    // },
  });

  return (
    <div className={cn('relative rounded-md border', containerClassname)}>
      <div className='relative max-h-[63vh] min-h-[63vh] overflow-auto'>
        <Table
          className={cn('h-full', className)}
          // className={cn('w-full caption-bottom text-sm', className)}
        >
          <TableHeader className='sticky top-0 bg-white'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='sticky top-0 bg-white'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='hover:bg-white'>
                <TableCell colSpan={columns.length}>
                  <div className='flex h-[50vh] w-full flex-col items-center justify-center'>
                    No results.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 px-4 py-2'>
        <div className='text-muted-foreground flex-1 text-sm'>
          Showing: {data.length} of {totalCount}
        </div>
        <div className='flex justify-end'>
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPaginationChange}
            showPreviousNext
          />
        </div>
      </div>
    </div>
  );
};
