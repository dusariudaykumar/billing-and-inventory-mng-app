import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface InvoiceItem {
  description: string;
  hours: number;
  rate: number;
  amount: number;
  color?: string;
}

interface InvoiceProps {
  invoiceNumber?: string;
  billTo?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shipTo?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  issueDate?: string;
  dueDate?: string;
  items?: InvoiceItem[];
}

const InvoiceTemplate: React.FC<InvoiceProps> = ({
  invoiceNumber = '2ex3n9babczGFeVFPXgFZ',
  billTo = {
    name: 'Pixy Krovasky',
    address: '8692 Wild Rose Drive',
    city: 'Livonia',
    postalCode: 'MI 48150',
  },
  shipTo = {
    address: '45 Roker Terrace',
    city: 'Latheronwheel',
    postalCode: 'KW5 8NW',
    country: 'United Kingdom',
  },
  issueDate = '03/10/2018',
  dueDate = '05/10/2018',
  items = [
    {
      description: 'Minimal Design',
      hours: 80,
      rate: 40,
      amount: 3200,
      color: 'blue',
    },
    {
      description: 'Logo Design',
      hours: 32,
      rate: 50,
      amount: 2200,
      color: 'green',
    },
    {
      description: 'Web Development',
      hours: 120,
      rate: 80,
      amount: 12200,
      color: 'yellow',
    },
  ],
}) => {
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const subtotal = calculateSubtotal();
  const vat = 0;

  return (
    <Card className='mx-auto w-full max-w-4xl bg-white p-8'>
      <div className='mb-8 flex justify-between'>
        <div>
          <div className='mb-6 text-2xl font-bold'>
            <span className='text-blue-600'>Sri Ranganatha </span>
            <span className='text-orange-500'>Rock Drills</span>
            {/* <div className='mt-1 text-sm text-gray-600'>Express</div> */}
          </div>
          <div className='space-y-1'>
            <div className='font-semibold'>Bill to:</div>
            <div>{billTo.name}</div>
            <div>{billTo.address}</div>
            <div>
              {billTo.city}, {billTo.postalCode}
            </div>
          </div>
        </div>
        <div className='text-right'>
          <div className='mb-6'>
            <div className='mb-1 text-gray-600'>Invoice #</div>
            <div>{invoiceNumber}</div>
          </div>
          <div className='space-y-1'>
            <div className='flex flex-col text-gray-600'>
              <div>Date: {issueDate}</div>
              <div>Due date: {dueDate}</div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className='p-0'>
        <table className='w-full'>
          <thead>
            <tr className='text-gray-600'>
              <th className='pb-4 text-left'>Description</th>
              <th className='pb-4 text-right'>Hours</th>
              <th className='pb-4 text-right'>Rate</th>
              <th className='pb-4 text-right'>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className='border-t'>
                <td className='py-4'>
                  <div className='flex items-center'>
                    <div
                      className={`mr-2 h-2 w-2 rounded-full bg-${item.color}-500`}
                    ></div>
                    {item.description}
                  </div>
                </td>
                <td className='py-4 text-right'>{item.hours}</td>
                <td className='py-4 text-right'>${item.rate}</td>
                <td className='py-4 text-right'>${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-8 space-y-2'>
          <div className='flex justify-between'>
            <span>Subtotal:</span>
            <span>$ {subtotal.toLocaleString()}.00</span>
          </div>
          <div className='flex justify-between'>
            <span>Discount:</span>
            <span>- $ {vat.toFixed(2)}</span>
          </div>
          <div className='flex justify-between font-bold'>
            <span>Total:</span>
            <span>$ {subtotal.toLocaleString()}.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceTemplate;
