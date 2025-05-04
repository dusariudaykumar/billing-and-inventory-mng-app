'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyFormat } from '@/helpers/currency-format';
import { InvoiceStatus } from '@/interfaces/response.interface';
import Link from 'next/link';

interface RecentSale {
  id: string;
  invoiceNumber: number;
  date: Date;
  amount: number;
  customerPaid: number;
  dueAmount: number;
  status: InvoiceStatus;
}

interface CustomerRecentSalesProps {
  recentSales: RecentSale[];
}

const CustomerRecentSales: React.FC<CustomerRecentSalesProps> = ({
  recentSales = [],
}) => {
  if (!recentSales || recentSales.length === 0) {
    return (
      <Card className='bg-white'>
        <CardHeader className='border-b p-6'>
          <CardTitle className='text-xl font-semibold text-gray-900'>
            Recent Sales History
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center py-8 text-gray-500'>
            No recent sales found for this customer
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-white'>
      <CardHeader className=' p-6'>
        <CardTitle className='text-xl font-semibold text-gray-900'>
          Recent Sales History
        </CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <div className='min-w-full'>
            <div className='grid grid-cols-6 border-b bg-gray-50 px-6 py-4 text-sm font-medium text-gray-500'>
              <div>Invoice ID</div>
              <div>Date</div>
              <div>Amount</div>
              <div>Customer Paid</div>
              <div>Due Amount</div>
              <div>Status</div>
            </div>
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className='grid grid-cols-6 rounded-b-xl border-b px-6 py-4 text-sm'
              >
                <Link
                  href={`/view-invoice/${sale.id}`}
                  className='font-medium text-blue-600 underline underline-offset-2'
                >
                  #{sale.invoiceNumber}
                </Link>
                <div className='text-gray-900'>
                  {new Date(sale.date).toLocaleDateString('en-GB') || 'N/A'}
                </div>
                <div className='font-medium text-gray-900'>
                  {currencyFormat(sale.amount)}
                </div>
                <div className='text-gray-600'>
                  {currencyFormat(sale.customerPaid)}
                </div>
                <div className='font-medium text-gray-900'>
                  {currencyFormat(sale.dueAmount)}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sale.status === InvoiceStatus.PAID
                        ? 'bg-green-100 text-green-800'
                        : sale.status === InvoiceStatus.PARTIALLY_PAID
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerRecentSales;
