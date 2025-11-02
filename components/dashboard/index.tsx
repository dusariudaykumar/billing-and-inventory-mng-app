import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { currencyFormat } from '@/helpers/currency-format';
import { useGetDashboardDataQuery } from '@/store/services/dashboard';
import {
  AlertCircle,
  Building,
  Clock,
  DollarSign,
  Phone,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const { data, isLoading, error } = useGetDashboardDataQuery();

  // Transform API response to match UI expectations
  const stats = data?.data?.stats || null;

  const customersWithDues =
    data?.data?.customersWithDues?.map((c) => ({
      ...c,
      id: String(c.id), // Ensure id is string
    })) || [];

  const recentSales = data?.data?.recentSales || [];
  const lowStockItems = data?.data?.lowStockItems || [];

  // Show loading state
  if (isLoading) {
    return (
      <div className='flex h-full w-full flex-1 flex-col space-y-4 p-4 md:space-y-6 md:p-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
          <Skeleton className='h-7 w-32 md:h-8' />
          <Skeleton className='h-9 w-32' />
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className='p-4 md:p-6'>
                <Skeleton className='h-20 w-full md:h-24' />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48 md:w-64' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-48 w-full md:h-64' />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error || !data?.data) {
    return (
      <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-8'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle className='text-red-600'>
              Error Loading Dashboard
            </CardTitle>
            <CardDescription>
              {error && 'data' in error
                ? (error.data as { message?: string })?.message ||
                  'Failed to load dashboard data'
                : 'Failed to load dashboard data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => window.location.reload()}
              variant='outline'
              className='w-full'
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have stats data
  if (!stats) {
    return (
      <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-8'>
        <p className='text-muted-foreground'>No data available</p>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-4 p-4 md:space-y-6 md:p-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xl font-bold tracking-tight md:text-2xl'>
          Dashboard
        </h2>
        <Button
          variant='link'
          onClick={() => router.push('/create-invoice')}
          className='self-start sm:self-auto'
        >
          Create Invoice
        </Button>
      </div>

      {/* Stats Overview */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center justify-between'>
              <div className='min-w-0 flex-1'>
                <p className='text-muted-foreground text-xs font-medium md:text-sm'>
                  Total Revenue
                </p>
                <h3 className='mt-1 text-xl font-bold md:mt-2 md:text-2xl'>
                  {currencyFormat(stats.totalRevenue)}
                </h3>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 md:h-12 md:w-12'>
                <DollarSign className='h-5 w-5 text-blue-600 md:h-6 md:w-6' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center justify-between'>
              <div className='min-w-0 flex-1'>
                <p className='text-muted-foreground text-xs font-medium md:text-sm'>
                  Outstanding Dues
                </p>
                <h3 className='mt-1 text-xl font-bold md:mt-2 md:text-2xl'>
                  {currencyFormat(stats.totalDue)}
                </h3>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 md:h-12 md:w-12'>
                <AlertCircle className='h-5 w-5 text-red-600 md:h-6 md:w-6' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center justify-between'>
              <div className='min-w-0 flex-1'>
                <p className='text-muted-foreground text-xs font-medium md:text-sm'>
                  Total Customers
                </p>
                <h3 className='mt-1 text-xl font-bold md:mt-2 md:text-2xl'>
                  {stats.totalCustomers}
                </h3>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 md:h-12 md:w-12'>
                <Users className='h-5 w-5 text-green-600 md:h-6 md:w-6' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4 md:p-6'>
            <div className='flex items-center justify-between'>
              <div className='min-w-0 flex-1'>
                <p className='text-muted-foreground text-xs font-medium md:text-sm'>
                  Inventory Items
                </p>
                <h3 className='mt-1 text-xl font-bold md:mt-2 md:text-2xl'>
                  {stats.totalItems}
                </h3>
              </div>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 md:h-12 md:w-12'>
                <ShoppingBag className='h-5 w-5 text-purple-600 md:h-6 md:w-6' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers with Due Amounts Section */}
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle className='text-lg md:text-xl'>
                Customers with Outstanding Payments
              </CardTitle>
              <CardDescription className='text-xs md:text-sm'>
                Customers with pending due amounts
              </CardDescription>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/customers')}
              className='self-start sm:self-auto'
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-0 md:p-6'>
          <div className='overflow-x-auto rounded-md border'>
            {/* Custom Table Header */}
            <div className='bg-muted/50 grid min-w-[600px] grid-cols-6 border-b px-3 py-2 text-xs font-medium md:px-4 md:py-3 md:text-sm'>
              <div className='col-span-1'>Customer</div>
              <div className='col-span-1'>Company</div>
              <div className='col-span-1'>Contact</div>
              <div className='col-span-1'>Invoices</div>
              <div className='col-span-1'>Last Invoice</div>
              <div className='col-span-1 text-right'>Due Amount</div>
            </div>

            {/* Table Body */}
            <div className='divide-y'>
              {customersWithDues.length === 0 ? (
                <div className='text-muted-foreground px-4 py-8 text-center text-sm'>
                  No customers with outstanding payments
                </div>
              ) : (
                customersWithDues.map((customer) => (
                  <div
                    key={customer.id}
                    className='hover:bg-muted/10 grid min-w-[600px] cursor-pointer grid-cols-6 px-3 py-2 md:px-4 md:py-3'
                    onClick={() =>
                      router.push(`/customer-details/${customer.id}`)
                    }
                  >
                    <div className='col-span-1'>
                      <div className='flex items-center gap-1.5 md:gap-2'>
                        <Avatar className='h-7 w-7 md:h-8 md:w-8'>
                          <AvatarFallback className='bg-blue-100 text-xs text-blue-600 md:text-sm'>
                            {customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='truncate text-xs font-medium md:text-sm'>
                          {customer.name}
                        </div>
                      </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-1.5 md:gap-2'>
                      <Building className='text-muted-foreground h-3 w-3 shrink-0 md:h-4 md:w-4' />
                      <span className='truncate text-xs md:text-sm'>
                        {customer.companyName}
                      </span>
                    </div>
                    <div className='col-span-1 flex items-center gap-1.5 md:gap-2'>
                      <Phone className='text-muted-foreground h-3 w-3 shrink-0 md:h-4 md:w-4' />
                      <span className='truncate text-xs md:text-sm'>
                        {customer.contactInfo.phone}
                      </span>
                    </div>
                    <div className='col-span-1 flex items-center'>
                      <Badge variant='outline' className='text-xs'>
                        {customer.invoiceCount} invoices
                      </Badge>
                    </div>
                    <div className='col-span-1 flex items-center text-xs md:text-sm'>
                      {new Date(customer.lastInvoiceDate).toLocaleDateString()}
                    </div>
                    <div className='col-span-1 flex items-center justify-end text-xs font-medium text-red-500 md:text-sm'>
                      {currencyFormat(customer.dueAmount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Sales revenue across months</CardDescription>
          </CardHeader>
          <CardContent className='px-2'>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={monthlySalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                  <Tooltip
                    formatter={(value) => currencyFormat(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '8px',
                    }}
                  />
                  <Bar
                    dataKey='revenue'
                    fill='#0ea5e9'
                    radius={[4, 4, 0, 0]}
                    name='Revenue'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* <Card className='col-span-1'>
          <CardHeader>
            <CardTitle>Revenue Status</CardTitle>
            <CardDescription>Distribution of payment statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={revenueStatus}
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={100}
                    fill='#8884d8'
                    paddingAngle={5}
                    dataKey='value'
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={true}
                  >
                    {revenueStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => currencyFormat(value)}
                    contentStyle={{
                      borderRadius: '8px',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '8px',
                    }}
                  />
                  <Legend
                    verticalAlign='bottom'
                    height={36}
                    formatter={(value, entry, index) => {
                      const color = COLORS[index % COLORS.length];
                      return <span style={{ color }}>{value}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Additional Sections Row */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* Recent Sales */}
        <Card className='col-span-1'>
          <CardHeader>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='flex items-center text-lg md:text-xl'>
                  <Clock className='mr-2 h-4 w-4 text-blue-500 md:h-5 md:w-5' />
                  Recent Sales
                </CardTitle>
                <CardDescription className='text-xs md:text-sm'>
                  Latest transactions
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/sales')}
                className='self-start sm:self-auto'
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-2 md:space-y-4'>
              {recentSales.length === 0 ? (
                <div className='text-muted-foreground py-8 text-center text-sm'>
                  No recent sales
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div
                    key={sale._id}
                    className='hover:bg-muted/5 cursor-pointer rounded-lg border-b px-3 py-3 transition-colors sm:flex sm:items-center sm:justify-between sm:px-4'
                    onClick={() => router.push(`/view-invoice/${sale._id}`)}
                  >
                    <div className='flex min-w-0 flex-1 items-start gap-3 sm:items-center'>
                      <Avatar className='h-10 w-10 shrink-0 sm:h-9 sm:w-9'>
                        <AvatarFallback className='bg-green-100 text-sm text-green-600'>
                          {sale.customerInfo?.name
                            .substring(0, 2)
                            .toUpperCase() || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-semibold sm:font-medium md:text-base'>
                          {sale.customerInfo?.name || 'Unknown'}
                        </p>
                        <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:mt-0'>
                          <span>#{sale.invoiceNumber}</span>
                          <span className='hidden sm:inline'>•</span>
                          <span className='text-xs'>
                            {new Date(sale.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='mt-3 flex items-center justify-between gap-3 border-t pt-3 sm:mt-0 sm:flex-col sm:items-end sm:border-0 sm:pt-0'>
                      <p className='text-base font-semibold sm:text-sm sm:font-medium md:text-base'>
                        {currencyFormat(sale.totalAmount)}
                      </p>
                      <Badge
                        className={`shrink-0 text-xs ${
                          sale.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : sale.status === 'Partially Paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sale.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className='col-span-1'>
          <CardHeader>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='flex items-center text-lg md:text-xl'>
                  <ShoppingBag className='mr-2 h-4 w-4 text-yellow-500 md:h-5 md:w-5' />
                  Low Stock Items
                </CardTitle>
                <CardDescription className='text-xs md:text-sm'>
                  Items requiring restocking
                </CardDescription>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => router.push('/inventory')}
                className='self-start sm:self-auto'
              >
                View Inventory
              </Button>
            </div>
          </CardHeader>
          <CardContent className='p-0 md:p-6'>
            {/* Mobile Card Layout */}
            <div className='space-y-2 md:hidden'>
              {lowStockItems.length === 0 ? (
                <div className='text-muted-foreground px-4 py-8 text-center text-sm'>
                  No low stock items
                </div>
              ) : (
                lowStockItems.map((item) => (
                  <div
                    key={item._id}
                    className='bg-muted/20 rounded-lg border-b px-4 py-3'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-semibold'>{item.name}</p>
                        <div className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
                          <span>{item.units}</span>
                          <span>•</span>
                          <span>{currencyFormat(item.sellingPrice)}</span>
                        </div>
                      </div>
                      <Badge
                        variant='outline'
                        className={`shrink-0 text-xs ${
                          item.quantity < 3
                            ? 'border-red-200 bg-red-100 text-red-800'
                            : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.quantity} in stock
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table Layout */}
            <div className='hidden overflow-x-auto rounded-md border md:block'>
              {/* Custom Table Header */}
              <div className='bg-muted/50 grid grid-cols-4 border-b px-4 py-3 text-sm font-medium'>
                <div className='col-span-1'>Item</div>
                <div className='col-span-1'>Unit</div>
                <div className='col-span-1 text-right'>Quantity</div>
                <div className='col-span-1 text-right'>Price</div>
              </div>

              {/* Table Body */}
              <div className='divide-y'>
                {lowStockItems.length === 0 ? (
                  <div className='text-muted-foreground px-4 py-8 text-center text-sm'>
                    No low stock items
                  </div>
                ) : (
                  lowStockItems.map((item) => (
                    <div
                      key={item._id}
                      className='hover:bg-muted/10 grid grid-cols-4 px-4 py-3'
                    >
                      <div className='col-span-1 truncate text-sm font-medium'>
                        {item.name}
                      </div>
                      <div className='col-span-1 truncate text-sm'>
                        {item.units}
                      </div>
                      <div className='col-span-1 flex justify-end'>
                        <Badge
                          variant='outline'
                          className={`text-sm ${
                            item.quantity < 3
                              ? 'border-red-200 bg-red-100 text-red-800'
                              : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {item.quantity} in stock
                        </Badge>
                      </div>
                      <div className='col-span-1 text-right text-sm'>
                        {currencyFormat(item.sellingPrice)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
