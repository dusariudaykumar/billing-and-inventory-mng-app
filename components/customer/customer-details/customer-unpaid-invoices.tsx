'use client';

import { Button } from '@/components/ui/button';
import { currencyFormat } from '@/helpers/currency-format';
import { useGetCustomerUnpaidInvoicesQuery } from '@/store/services/customer';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface UnpaidInvoicesProps {
  customerId: string;
  customerName?: string;
  companyName?: string;
}

const CustomerUnpaidInvoices: React.FC<UnpaidInvoicesProps> = ({
  customerId,
  customerName = '',
  companyName = '',
}) => {
  const printTableRef = useRef<HTMLDivElement | null>(null);
  const {
    data: unpaidInvoicesData,
    isLoading,
    error,
  } = useGetCustomerUnpaidInvoicesQuery(customerId);

  const handlePrintUnpaidInvoices = useReactToPrint({
    contentRef: printTableRef,
    documentTitle: customerName
      ? `${customerName}_Unpaid_Invoices_${Date.now()}`
      : `Customer_Unpaid_Invoices_${Date.now()}`,
    // Add print styles
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 15mm;
      }
      
      @media print {
        /* Add header with customer name on each page */
        @page {
          @top-center {
            content: "Unpaid Invoices";
            font-size: 10pt;
          }
        }
      @media print {
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table {
          width: 100% !important;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px 8px;
          border-bottom: 1px solid #eaeaea;
        }
        th {
          font-weight: 600;
          background-color: #f9fafb !important;
          border-bottom: 2px solid #e5e7eb;
        }
        .status-paid {
          color: #047857 !important;
          background-color: #d1fae5 !important;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 500;
        }
        .status-partial {
          color: #92400e !important;
          background-color: #fef3c7 !important;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 500;
        }
        .status-unpaid {
          color: #b91c1c !important;
          background-color: #fee2e2 !important;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 500;
        }
        .amount-due {
          color: #b91c1c !important;
          font-weight: 600;
        }
        .print-table-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
        }
        tfoot td {
          font-weight: 600;
        }
      }
    `,
  });

  const { invoices, stats } = useMemo(() => {
    if (!unpaidInvoicesData?.data) {
      return {
        invoices: [],
        stats: { totalInvoiceAmount: 0, totalDueAmount: 0, invoiceCount: 0 },
      };
    }
    return unpaidInvoicesData.data;
  }, [unpaidInvoicesData]);

  if (isLoading) {
    return (
      <div className='mb-8 rounded-xl border border-gray-200 bg-white shadow-sm'>
        <div className='p-6'>
          <h2 className='mb-6 text-2xl font-semibold'>Unpaid Invoices</h2>
          <div className='flex justify-center py-8'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='mb-8 rounded-xl border border-gray-200 bg-white shadow-sm'>
        <div className='p-6'>
          <h2 className='mb-6 text-2xl font-semibold'>Unpaid Invoices</h2>
          <div className='flex items-center justify-center gap-2 py-6 text-red-500'>
            <AlertCircle />
            <span>Failed to load unpaid invoices</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mb-8 rounded-xl border border-gray-200 bg-white shadow-sm'>
      <div className='p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-semibold'>Unpaid Invoices</h2>
          <Button onClick={() => handlePrintUnpaidInvoices()}>Print</Button>
        </div>

        {/* Stats cards - visible only in the app, not in print */}
        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3 print:hidden'>
          <div className='rounded-xl border border-dashed border-gray-200 p-4 text-center'>
            <p className='text-sm text-gray-500'>Total Invoice Amount</p>
            <p className='text-2xl font-bold'>
              {currencyFormat(stats.totalInvoiceAmount)}
            </p>
          </div>
          <div className='rounded-xl border border-dashed border-gray-200 p-4 text-center'>
            <p className='text-sm text-gray-500'>Total Due Amount</p>
            <p className='text-2xl font-bold text-red-600'>
              {currencyFormat(stats.totalDueAmount)}
            </p>
          </div>
          <div className='rounded-xl border border-dashed border-gray-200 p-4 text-center'>
            <p className='text-sm text-gray-500'>Pending Invoices</p>
            <p className='text-2xl font-bold'>{stats.invoiceCount}</p>
          </div>
        </div>

        {/* Table div with ref for printing */}
        <div ref={printTableRef}>
          {/* Print-only header */}
          <div className='print-table-title hidden print:block'>
            {customerName
              ? `${customerName} - Unpaid Invoices`
              : 'Customer Unpaid Invoices'}
          </div>

          {/* Customer details section for print only */}
          {customerName && (
            <div className='mb-4 hidden print:block'>
              <div className='text-left'>
                <p className='mb-2 text-gray-700'>
                  <strong>Customer Name:</strong>{' '}
                  {companyName ? companyName : ''} {customerName || '---'}
                </p>
                <p className='mb-2 text-gray-700'>
                  <strong>Date:</strong>{' '}
                  {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          )}

          {/* Table optimized for both screen and print */}
          <div className='overflow-x-auto print:overflow-visible'>
            <table className='w-full min-w-[800px] print:min-w-full'>
              <thead>
                <tr className='border-b-2 border-gray-200 bg-gray-50 print:bg-gray-50'>
                  <th className='w-1/6 py-3 text-left text-sm font-semibold text-gray-600'>
                    Invoice #
                  </th>
                  <th className='w-1/6 py-3 text-left text-sm font-semibold text-gray-600'>
                    Date
                  </th>
                  <th className='w-1/6 py-3 text-right text-sm font-semibold text-gray-600'>
                    Total Amount
                  </th>
                  <th className='w-1/6 py-3 text-right text-sm font-semibold text-gray-600'>
                    Customer Paid
                  </th>
                  <th className='w-1/6 py-3 text-right text-sm font-semibold text-gray-600'>
                    Due Amount
                  </th>
                  <th className='w-1/6 py-3 text-center text-sm font-semibold text-gray-600'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='py-8 text-center text-gray-500'>
                      No unpaid invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className='border-b border-gray-200 hover:bg-gray-50 print:hover:bg-transparent'
                    >
                      <td className='py-4'>
                        <span className='hidden font-medium print:inline'>
                          #{invoice.invoiceNumber}
                        </span>
                        <Link
                          href={`/view-invoice/${invoice.id}`}
                          className='font-medium text-blue-600 hover:underline print:hidden'
                        >
                          #{invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className='py-4'>
                        {new Date(invoice.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className='py-4 text-right'>
                        {currencyFormat(invoice.totalAmount)}
                      </td>
                      <td className='py-4 text-right'>
                        {currencyFormat(invoice.customerPaid)}
                      </td>
                      <td className='amount-due py-4 text-right font-medium text-red-600'>
                        {currencyFormat(invoice.dueAmount)}
                      </td>
                      <td className='py-4 text-center'>
                        {/* Status badges for screen viewing */}
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium print:hidden
                            ${
                              invoice.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'Partially Paid'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {invoice.status}
                        </span>

                        {/* Print-specific status badges with better styling */}
                        <span
                          className={`hidden print:inline
                            ${
                              invoice.status === 'Paid'
                                ? 'status-paid'
                                : invoice.status === 'Partially Paid'
                                ? 'status-partial'
                                : 'status-unpaid'
                            }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {invoices.length > 0 && (
                <tfoot>
                  <tr className='border-t-2 border-gray-200'>
                    <td colSpan={4} className='py-4 text-right font-semibold'>
                      Total Due:
                    </td>
                    <td className='amount-due py-4 text-right font-bold text-red-600'>
                      {currencyFormat(stats.totalDueAmount)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Print-only footer */}
          <div className='mt-8 hidden text-center text-sm text-gray-500 print:block'>
            <p>
              This document was printed on{' '}
              {new Date().toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerUnpaidInvoices;
