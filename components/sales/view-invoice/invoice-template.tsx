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
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-8'>
        <div className='text-xl'>Invoice not found</div>
        <Button onClick={() => router.push('/sales')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Sales
        </Button>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 overflow-auto p-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Invoice</h2>
        <div className='flex gap-2'>
          <Button onClick={() => handlePrintInvoice()} className='ml-auto'>
            <Printer className='h-4 w-4' />
            Print Invoice
          </Button>
          <Button variant='outline' onClick={() => router.push('/sales')}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Sales
          </Button>
        </div>
      </div>

      <Card className='mx-auto max-w-4xl bg-white' ref={printContentRef}>
        <CardContent className='p-6'>
          {/* Header Section */}
          <header className='mb-6 flex flex-col items-center justify-center'>
            <h6 className='font-bold underline'>ESTIMATE</h6>
            {/* Logo placeholder */}
            <div className='flex items-center gap-4'>
              <Image src='/logo.png' alt='SRD Logo' width={84} height={20} />
              <h3>SRD</h3>
              <Image
                src='/rockdrills.jpg'
                alt='SRD Logo'
                width={84}
                height={20}
              />
            </div>
            {/* </div> */}
          </header>

          {/* Invoice Details Section */}
          <section className='mb-8 space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span className='pr-2'>No.</span>
                <span>0{data?.invoiceNumber || '---'}</span>
              </div>
              <div>
                <span className='pr-2'>Date:</span>
                <span className='border-b border-gray-300'>
                  {data?.invoiceDate
                    ? new Date(data.invoiceDate).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <span className='pr-2'>M/s.</span>
              <span className='flex-1 border-b border-gray-300'>
                {data?.customerId.name || '---'}
              </span>
            </div>
            <div className='flex justify-between'>
              <div className='flex flex-1'>
                <span className='pr-2'>Vehicle No.</span>
                <span className='flex-1 border-b border-gray-300'>
                  {data?.vehicleNumber || '---'}
                </span>
              </div>
              <div className='ml-8 flex'>
                <span className='pr-2'>Cell No.</span>
                <span className='w-40 border-b border-gray-300'>
                  +91 {data?.customerId?.contactDetails?.phone || '---'}
                </span>
              </div>
            </div>
          </section>

          {/* Invoice Items Table */}
          <section>
            <div className='overflow-x-auto'>
              <table className='w-full border border-gray-300'>
                <thead className='border-b'>
                  <tr className='bg-gray-50'>
                    <th className='w-20 border-r border-gray-300 px-4 py-2 text-center text-sm'>
                      Sl. No
                    </th>
                    <th className='font-sm border-r border-gray-300 px-4 py-2 text-center text-sm'>
                      PARTICULARS
                    </th>
                    <th className='w-24 border-r border-gray-300 px-4 py-2 text-center text-sm'>
                      Qty.
                    </th>
                    <th className='w-32 border-r border-gray-300 px-4 py-2 text-center text-sm'>
                      Rate
                    </th>
                    <th className='w-36 px-4 py-2 text-center text-sm'>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((item, index) => (
                    <tr key={index} className='border-b border-gray-300'>
                      <td className='border-r border-gray-300 px-4 py-2 text-center'>
                        {index + 1}
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2'>
                        {item.name}
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2 text-center'>
                        {item.quantity}
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2 text-right'>
                        {item.sellingPrice
                          ? currencyFormat(item.sellingPrice)
                          : '---'}
                      </td>
                      <td className='px-4 py-2 text-right'>
                        {item.amount ? currencyFormat(item.amount) : '---'}
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows to match original design */}
                  {[...Array(3)].map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className='border-b border-gray-300'
                    >
                      <td className='border-r border-gray-300 px-4 py-2'>
                        &nbsp;
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2'>
                        &nbsp;
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2'>
                        &nbsp;
                      </td>
                      <td className='border-r border-gray-300 px-4 py-2'>
                        &nbsp;
                      </td>
                      <td className='px-4 py-2'>&nbsp;</td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr>
                    <td
                      colSpan={4}
                      className='border-r border-gray-300 px-4 py-2 text-right text-sm font-bold'
                    >
                      SUB TOTAL:
                    </td>
                    <td className='px-4 py-2 text-right font-medium'>
                      {data?.totalAmount && data?.discount
                        ? currencyFormat(data.discount + data.totalAmount)
                        : '---'}
                    </td>
                  </tr>

                  {data?.discount && (
                    <tr>
                      <td
                        colSpan={4}
                        className='border-r border-gray-300 px-4 py-2 pt-0 text-right text-sm font-bold'
                      >
                        DISCOUNT:
                      </td>
                      <td className='flex items-center justify-end px-4 py-2 pt-0 text-right font-medium'>
                        <Minus />{' '}
                        {data.discount ? currencyFormat(data.discount) : '---'}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td
                      colSpan={4}
                      className='border-r border-gray-300 px-4 py-2 pt-0 text-right text-sm font-bold'
                    >
                      TOTAL:
                    </td>
                    <td className='px-4 py-2 pt-0 text-right font-medium '>
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
          <footer className='mt-20 flex justify-between'>
            <div>
              <div className='w-48 border-t border-gray-400 pt-1'>
                <span className='text-sm'>Customer Signature</span>
              </div>
            </div>
            <div>
              <div className='w-48 border-t border-gray-400 pt-1'>
                <span className='text-sm'>Signature</span>
              </div>
            </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceTemplate;
