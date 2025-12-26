'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { currencyFormat } from '@/helpers/currency-format';
import { generateWhatsAppLink } from '@/helpers/whatsapp-share';
import { useGetInvoiceQuery } from '@/store/services/sales';
import axios from 'axios';
import { toPng } from 'html-to-image';
import { ArrowLeft, MessageCircle, Printer } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

import logger from '@/lib/logger';
import { useReactToPrint } from 'react-to-print';

const InvoiceTemplate: React.FC = () => {
  const router = useRouter();
  const printContentRef = useRef<HTMLDivElement | null>(null);
  const { id } = router.query;
  const { data: invoiceData, isLoading } = useGetInvoiceQuery(id as string, {
    skip: !id,
  });
  const { data } = invoiceData || {};
  const [isSharing, setIsSharing] = useState(false);

  const handlePrintInvoice = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: `SRD_INVOICE_${data?.invoiceNumber}`,
  });

  const handleShareViaWhatsApp = async () => {
    if (!printContentRef.current || !data) {
      toast.error('Invoice data not available');
      return;
    }

    setIsSharing(true);
    try {
      // Create a clone of the invoices to render for PDF
      // Create a clone of the invoices to render for PDF
      const originalElement = printContentRef.current;
      const clone = originalElement.cloneNode(true) as HTMLElement;

      // Create a container for the clone that is off-screen but "visible" to the browser rendering engine
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-2000px';
      container.style.top = '0';
      container.style.width = '1000px';
      container.style.height = 'auto';
      container.style.overflow = 'visible'; // Important!
      container.style.zIndex = '-1000';
      document.body.appendChild(container);

      // Set styles for the clone
      clone.style.width = '1000px';
      clone.style.minWidth = '1000px';
      clone.style.position = 'absolute'; // Relative to container
      clone.style.left = '0';
      clone.style.top = '0';
      clone.style.backgroundColor = '#ffffff';
      clone.setAttribute('data-print', 'true');

      // Append clone to container instead of body
      container.appendChild(clone);

      // FORCE DESKTOP LAYOUT (Clean Snapshot Method)
      // We rely on html2canvas windowWidth: 1200 to enforce the desktop media queries.
      // No manual style overrides are applied to ensure "What You See Is What You Get".

      // Append to body so html2canvas can render it

      try {
        // Add a small delay to ensure fonts and layout are fully stable
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Generate High-Quality Image using html-to-image
        // Using PNG for better text clarity and to avoid JPEG artifacts
        const imgData = await toPng(clone, {
          quality: 1.0,
          width: 1000,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
          style: {
            width: '1000px',
            background: 'white',
            margin: '0',
          },
        });

        const cleanBase64 = imgData.split(',')[1];

        // Upload to backend
        const response = await axios.post('/api/invoice/share-link', {
          invoiceId: id,
          fileBase64: cleanBase64,
          fileType: 'png',
          invoiceNumber: data.invoiceNumber,
        });

        if (response.data.success) {
          const shareableLink = response.data.data.shareableLink;

          const customerName = data.customerId?.name || 'Customer';
          const invoiceNumber = data.invoiceNumber || 'N/A';
          const totalAmount = data.dueAmount || data.totalAmount || 0;

          const message = `Hello ${customerName},\n\nPlease find your invoice #${invoiceNumber} below:\n\nTotal Amount: ${currencyFormat(
            totalAmount
          )}\n\nView Invoice: ${shareableLink}\n\nThank you for your business!`;

          const phoneNumber = data.customerId?.contactDetails?.phone;

          const whatsappLink = generateWhatsAppLink(
            message,
            phoneNumber ? `91${phoneNumber}` : undefined
          );

          window.open(whatsappLink, '_blank');
          toast.success('Opening WhatsApp...');
        } else {
          throw new Error(response.data.message || 'Failed to share invoice');
        }
      } finally {
        document.body.removeChild(container);
      }
    } catch (error: any) {
      logger(error, 'Error sharing invoice:');
    } finally {
      setIsSharing(false);
    }
  };

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
            variant='outline'
            className='xs:w-auto w-full'
          >
            <Printer className='mr-2 h-4 w-4' />
            Print Invoice
          </Button>
          <Button
            onClick={handleShareViaWhatsApp}
            disabled={isSharing}
            className='xs:w-auto w-full bg-green-600 hover:bg-green-700 sm:ml-auto'
          >
            <MessageCircle className='mr-2 h-4 w-4' />
            {isSharing ? 'Sharing...' : 'Share via WhatsApp'}
          </Button>
        </div>
      </div>

      <Card
        className='group mx-auto w-full max-w-4xl bg-white group-data-[print=true]:w-[1000px] group-data-[print=true]:min-w-[1000px]'
        ref={printContentRef}
      >
        <CardContent className='p-4 font-sans text-gray-900 sm:p-6'>
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
            <div className='flex flex-col justify-between gap-2 group-data-[print=true]:!flex-row group-data-[print=true]:!items-center group-data-[print=true]:!gap-0 sm:flex-row sm:items-center sm:gap-0'>
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
            <div className='flex flex-col justify-between gap-2 group-data-[print=true]:!flex-row group-data-[print=true]:!gap-0 sm:flex-row sm:gap-0'>
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
              <table className='w-full min-w-[640px] table-fixed border border-gray-300 text-xs group-data-[print=true]:!text-sm sm:text-sm [&>tr]:last:border-b-0'>
                <thead className='border-b'>
                  <tr className='bg-gray-50'>
                    <th className='w-16 border-r border-gray-300 px-2 py-2 text-center group-data-[print=true]:!w-20 group-data-[print=true]:!px-4 sm:w-20 sm:px-4'>
                      Sl. No
                    </th>
                    <th className='border-r border-gray-300 px-2 py-2 text-left group-data-[print=true]:!px-4 sm:px-4'>
                      PARTICULARS
                    </th>
                    <th className='w-16 border-r border-gray-300 px-2 py-2 text-center group-data-[print=true]:!w-24 group-data-[print=true]:!px-4 sm:w-24 sm:px-4'>
                      Qty.
                    </th>
                    <th className='w-24 border-r border-gray-300 px-2 py-2 text-right group-data-[print=true]:!w-32 group-data-[print=true]:!px-4 sm:w-32 sm:px-4'>
                      Rate
                    </th>
                    <th className='w-24 px-2 py-2 text-right group-data-[print=true]:!w-36 group-data-[print=true]:!px-4 sm:w-36 sm:px-4'>
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((item, index) => (
                    <tr key={index} className='border-gray-300'>
                      <td className='border-r border-gray-300 px-2 py-2 text-center group-data-[print=true]:!px-4 sm:px-4'>
                        {index + 1}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                        {item.name}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 text-center group-data-[print=true]:!px-4 sm:px-4'>
                        {item.isCustomService && item.quantity === 0 ? (
                          <></>
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className='border-r border-gray-300 px-2 py-2 text-right group-data-[print=true]:!px-4 sm:px-4'>
                        {item.sellingPrice
                          ? currencyFormat(item.sellingPrice)
                          : '---'}
                      </td>
                      <td className='px-2 py-2 text-right group-data-[print=true]:!px-4 sm:px-4'>
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
                        <td className='border-r border-gray-300 px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='border-r border-gray-300 px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                          &nbsp;
                        </td>
                        <td className='px-2 py-2 group-data-[print=true]:!px-4 sm:px-4'>
                          &nbsp;
                        </td>
                      </tr>
                    )
                  )}
                  {/* Total row */}
                  <tr className='border-t'>
                    <td
                      colSpan={4}
                      className='border-r border-t border-gray-300 px-2 py-2 text-right text-xs font-bold group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'
                    >
                      SUB TOTAL:
                    </td>
                    <td className='theme-text-invoice px-2 py-2 text-right text-xs font-medium group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'>
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
                        className='border-r border-gray-300 px-2 py-2 pt-0 text-right text-xs font-bold group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'
                      >
                        DISCOUNT:
                      </td>
                      <td className='justify-end px-2 py-2 pt-0 text-right text-xs font-medium group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'>
                        <div className='flex items-center justify-end'>
                          <span className='mr-1 text-xl font-bold'>-</span>
                          {data.discount
                            ? currencyFormat(data.discount)
                            : '---'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}
                  {data?.customerPaid ? (
                    <tr>
                      <td
                        colSpan={4}
                        className='border-r border-gray-300 px-2 py-2 pt-0 text-right text-xs font-bold group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'
                      ></td>
                      <td className='justify-end px-2 py-2 pt-0 text-right text-xs font-medium group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'>
                        <div className='flex items-center justify-end'>
                          <span className='mr-1 text-xl font-bold'>-</span>
                          {data.customerPaid
                            ? currencyFormat(data.customerPaid)
                            : '---'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <></>
                  )}

                  <tr>
                    <td
                      colSpan={4}
                      className='border-r border-gray-300 px-2 py-2 pt-0 text-right text-xs font-bold group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'
                    >
                      TOTAL:
                    </td>
                    <td className='px-2 py-2 pt-0 text-right text-xs font-medium group-data-[print=true]:!px-4 group-data-[print=true]:!text-sm sm:px-4 sm:text-sm'>
                      {data?.dueAmount ? currencyFormat(data.dueAmount) : '---'}
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
