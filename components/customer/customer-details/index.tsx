'use client';

import CustomerRecentSales from '@/components/customer/customer-details/customer-recent-sales';
import CustomerUnpaidInvoices from '@/components/customer/customer-details/customer-unpaid-invoices';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    <div className='flex h-full w-full flex-1 flex-col space-y-8 overflow-auto p-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Customer</h2>
        <Button variant='outline' onClick={() => router.push('/customers')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Customers
        </Button>
      </div>

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
                      {data?.companyName || ''} {data?.name || '---'}
                    </h1>
                    <span className='rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700'>
                      {data?.status || '---'}
                    </span>
                  </div>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
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
                    Total Bills
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
                    Total Paid
                  </p>
                  <h3 className='mt-2 text-2xl font-bold text-gray-900'>
                    {currencyFormat(data?.stats?.totalPaid || 0)}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-50'>
                  <ArrowDownRight className='h-6 w-6 text-green-600' />
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
                    {data?.stats?.totalInvoices || 0}
                  </h3>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-50'>
                  <ArrowUpRight className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unpaid Invoices*/}
        {id && (
          <CustomerUnpaidInvoices
            customerId={id as string}
            customerName={data?.name}
            companyName={data?.companyName}
          />
        )}

        {/* Recent Sales */}
        {data?.recentSales && (
          <CustomerRecentSales recentSales={data.recentSales} />
        )}
      </div>
    </div>
  );
};

export default CustomerDeatils;
