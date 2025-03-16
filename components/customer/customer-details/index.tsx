'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currencyFormat } from '@/helpers/currency-format';
import { useGetCustomerDetailsQuery } from '@/store/services/customer';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BadgeDollarSign,
  Building2,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const CustomerDeatils = () => {
  const router = useRouter();

  const { id } = router.query;
  const { data: customerData, isLoading } = useGetCustomerDetailsQuery(
    id as string,
    {
      skip: !id,
    }
  );
  const { data } = customerData || {};

  if (!data && !isLoading) {
    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-8'>
        <div className='text-xl'>Customer not found</div>
        <Button onClick={() => router.push('/customers')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8'>
        {/* Customer Profile Header */}
        <Card className='mb-8'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
              <div className='flex items-start space-x-6'>
                <div className='relative'>
                  <Avatar>
                    <AvatarFallback className='rounded-md'>
                      {data?.name?.slice(0, 2)?.toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className='absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-green-500'></span>
                </div>
                <div>
                  <div className='flex items-center space-x-3'>
                    <h1 className='text-2xl font-bold text-gray-900'>
                      {data?.name || '---'}
                    </h1>
                    <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
                      {data?.status || '---'}
                    </span>
                  </div>
                  <div className='mt-2 grid grid-cols-2 space-y-2'>
                    <div className='flex items-center text-gray-600'>
                      <Building2 className='mr-2 h-4 w-4' />
                      <span className='text-sm'>
                        {data?.companyName || '---'}
                      </span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <Mail className='mr-2 h-4 w-4' />
                      <span className='text-sm'>{data?.email || '---'}</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <Phone className='mr-2 h-4 w-4' />
                      <span className='text-sm'>{data?.phone || '---'}</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <MapPin className='mr-2 h-4 w-4' />
                      <span className='text-sm'>{data?.address || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-6 text-right md:mt-0'>
                <div className='text-sm text-gray-500'>Customer Since</div>
                <div className='text-lg font-semibold text-gray-900'>
                  {data?.customerSince || '---'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
          <Card className='bg-white transition-shadow hover:shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Business
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                    {currencyFormat(data?.stats.totalBusiness || 0)}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-50'>
                  <BadgeDollarSign className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white transition-shadow hover:shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Due Amount
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                    {currencyFormat(data?.stats?.dueAmount || 0)}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-50'>
                  <AlertCircle className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white transition-shadow hover:shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Total Invoices
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                    {data?.stats?.totalInvoices || '---'}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-50'>
                  <ArrowUpRight className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white transition-shadow hover:shadow-lg'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Avg. Order Value
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                    {currencyFormat(data?.stats?.avgOrderValue || 0)}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-50'>
                  <ArrowDownRight className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card className='bg-white'>
          <CardHeader className='border-b p-6'>
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
                  {/* <div>Due Date</div> */}
                  <div>Amount</div>
                  <div>Customer Paid</div>
                  <div>Due Amount</div>
                  <div>Status</div>
                </div>
                {data?.recentSales?.map((sale) => (
                  <div
                    key={sale.id}
                    className='grid grid-cols-6 border-b px-6 py-4 text-sm hover:bg-gray-50'
                  >
                    <Link
                      href={`/view-invoice/${data.id}`}
                      className='font-medium text-blue-600 underline underline-offset-2'
                    >
                      0{sale.invoiceNumber}
                    </Link>
                    <div className='text-gray-900'>
                      {new Date(sale.date).toLocaleDateString() || 'N/A'}
                    </div>
                    <div className='font-medium text-gray-900'>
                      {currencyFormat(sale.amount)}
                    </div>
                    <div className='font-medium text-gray-900'>
                      {currencyFormat(sale.dueAmount)}
                    </div>
                    <div className='text-gray-600'>
                      {currencyFormat(sale.customerPaid)}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          sale.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : sale.status === 'Partial'
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
      </div>
    </div>
  );
};

export default CustomerDeatils;
