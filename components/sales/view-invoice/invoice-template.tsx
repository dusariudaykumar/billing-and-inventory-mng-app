'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { currencyFormat } from '@/helpers/currency-format';
import { useGetInvoiceQuery } from '@/store/services/sales';
import { ArrowLeft, Minus, Printer } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';

import { useReactToPrint } from 'react-to-print';

const InvoiceTemplate: React.FC = () => {
  const router = useRouter();
  const printContentRef = useRef<HTMLDivElement | null>(null);
  const { id } = router.query;
  const { data: invoiceData, isLoading } = useGetInvoiceQuery(id as string, {
    skip: !id,
  });
  const { data } = invoiceData || {};

  const handlePrintInvoice = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: `SRD_INVOICE_${data?.invoiceNumber}`,
  });

  if (!data && !isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8'>
        <div className='text-xl'>Invoice not found</div>
        <Button onClick={() => router.push('/sales')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Sales
        </Button>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-4 overflow-auto p-4 sm:space-y-8 sm:p-8'>
      <div className='flex flex-col justify-between gap-4  sm:flex-row sm:items-start'>
        <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
          Invoice
        </h2>
        <div className='xs:flex-row flex flex-col gap-2'>
          <Button
            variant='outline'
            onClick={() => router.push('/sales')}
            className='xs:w-auto w-full'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Sales
          </Button>
          <Button
            onClick={() => handlePrintInvoice()}
            className='xs:w-auto w-full sm:ml-auto'
          >
            <Printer className='mr-2 h-4 w-4' />
            Print Invoice
          </Button>
        </div>
      </div>

      <Card className='mx-auto w-full max-w-4xl bg-white' ref={printContentRef}>
        <CardContent className='p-4 sm:p-6'>
          {/* Header Section */}
          <header className='mb-4 flex flex-col items-center justify-center sm:mb-6'>
            <h6 className='font-bold underline'>ESTIMATE</h6>
            {/* Logo placeholder */}
            <div className='my-2 flex items-center gap-3 sm:gap-6'>
              <Image
                src='/logo.png'
                alt='SRD Logo'
                width={84}
                height={20}
                className='h-auto w-16 sm:w-auto'
              />
              <h2 className='font-serif text-3xl sm:text-5xl'>SRD</h2>
              <Image
                src='/rockdrills.jpg'
                alt='SRD Logo'
                width={74}
                height={20}
                className='h-auto w-14 sm:w-auto'
              />
            </div>
          </header>

          {/* Invoice Details Section */}
          <section className='mb-6 space-y-3 sm:mb-8 sm:space-y-4'>
            <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-0'>
              <div className='flex items-center'>
                <span className='pr-2'>No.</span>
                <span className='text-sm font-semibold text-blue-600'>
                  0{data?.invoiceNumber || '---'}
                </span>
              </div>
              <div>
                <span className='pr-2'>Date:</span>
                <span className='border-b border-gray-300'>
                  {data?.invoiceDate
                    ? new Date(data.invoiceDate).toLocaleDateString('en-GB')
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <span className='pr-2'>M/s.</span>
              <span className='flex-1 truncate border-b border-gray-300 font-semibold'>
                {data?.customerId.companyName
                  ? data?.customerId.companyName
                  : ''}{' '}
                {data?.customerId.name || '---'}
              </span>
            </div>
            <div className='flex flex-col justify-between gap-2 sm:flex-row sm:gap-0'>
              <div className='flex flex-1'>
                <span className='whitespace-nowrap pr-2'>Vehicle No.</span>
                <span className='flex-1 truncate border-b border-gray-300'>
                  {data?.vehicleNumber || '---'}
                </span>
              </div>
              <div className='flex sm:ml-8'>
                <span className='pr-2'>Cell No.</span>
                <span className='w-40 border-b border-gray-300'>
                  +91 {data?.customerId?.contactDetails?.phone || '---'}
                </span>
              </div>
            </div>
          </section>

          {/* Invoice Items Table */}
          <section>
            <div className='-mx-4 overflow-x-auto sm:mx-0'>
              <table className='w-full min-w-[640px] border border-gray-300 [&>tr]:last:border-b-0'>
                <thead className='border-b'>
                  <tr className='bg-gray-50'>
                    <th className='w-16 border-r border-gray-300 px-2 py-2 text-center text-xs sm:w-20 sm:px-4 sm:text-sm'>
                      Sl. No
                    </th>
                    <th className='font-sm border-r border-gray-300 px-2 py-2 text-center text-xs sm:px-4 sm:text-sm'>
                      PARTICULARS
                    </th>
                    <th className='w-16 border-r border-gray-300 px-2 py-2 text-center text-xs sm:w-24 sm:px-4 sm:text-sm'>
                      Qty.
                    </th>
                    <th className='w-24 border-r border-gray-300 px-2 py-2 text-center text-xs sm:w-32 sm:px-4 sm:text-sm'>
                      Rate
                    </th>
                    <th className='w-24 px-2 py-2 text-center text-xs sm:w-36 sm:px-4 sm:text-sm'>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((item, index) => (
                    <tr key={index} className='border-gray-300'>
                      <td className='border-r border-gray-300 px-2 py-2 text-center text-sm sm:px-4'>
                        {index + 1}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 text-sm sm:px-4'>
                        {item.name}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 text-center text-sm sm:px-4'>
                        {item.isCustomService ? <></> : item.quantity}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 text-right text-sm sm:px-4'>
                        {item.sellingPrice
                          ? currencyFormat(item.sellingPrice)
                          : '---'}
                      </td>
                      <td className='px-2 py-2 text-right text-sm sm:px-4'>
                        {item.amount ? currencyFormat(item.amount) : '---'}
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to match original design */}
                  {[...Array(Math.max(0, 3 - (data?.items.length || 0)))].map(
                    (_, index) => (
                      <tr
                        key={`empty-${index}`}
                        className='border-b border-gray-300'
                      >
                        <td className='border-r border-gray-300 px-2 py-2 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='px-2 py-2 sm:px-4'>&nbsp;</td>
                      </tr>
                    )
                  )}
                  {/* Total row */}
                  <tr className='border-t'>
                    <td
                      colSpan={4}
                      className='border-r border-t border-gray-300 px-2 py-2 text-right text-xs font-bold sm:px-4 sm:text-sm'
                    >
                      SUB TOTAL:
                    </td>
                    <td className='px-2 py-2 text-right text-sm font-medium sm:px-4'>
                      {data?.totalAmount && data?.discount
                        ? currencyFormat(data.discount + data.totalAmount)
                        : data?.totalAmount
                        ? currencyFormat(data.totalAmount)
                        : '---'}
                    </td>
                  </tr>

                  {data?.discount ? (
                    <tr>
                      <td
                        colSpan={4}
                        className='border-r border-gray-300 px-2 py-2 pt-0 text-right text-xs font-bold sm:px-4 sm:text-sm'
                      >
                        DISCOUNT:
                      </td>
                      <td className='flex items-center justify-end px-2 py-2 pt-0 text-right text-sm font-medium sm:px-4'>
                        <Minus className='h-3 w-3 sm:h-4 sm:w-4' />{' '}
                        {data.discount ? currencyFormat(data.discount) : '---'}
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}

                  <tr>
                    <td
                      colSpan={4}
                      className='border-r border-gray-300 px-2 py-2 pt-0 text-right text-xs font-bold sm:px-4 sm:text-sm'
                    >
                      TOTAL:
                    </td>
                    <td className='px-2 py-2 pt-0 text-right text-sm font-medium sm:px-4 '>
                      {data?.totalAmount
                        ? currencyFormat(data.totalAmount)
                        : '---'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Signature Section */}
          <footer className='mt-12 flex justify-between sm:mt-20'>
            <div>
              <div className='w-32 border-t border-gray-400 pt-1 sm:w-48'>
                <span className='text-xs sm:text-sm'>Customer Signature</span>
              </div>
            </div>
            <div>
              <div className='w-32 border-t border-gray-400 pt-1 sm:w-48'>
                <span className='text-xs sm:text-sm'>Signature</span>
              </div>
            </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceTemplate;
