'use client';

import { AutoComplete } from '@/components/auto-complete';
import { CalendarForm } from '@/components/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLoading } from '@/context/loader-provider';
import { currencyFormat } from '@/helpers/currency-format';
import { useDebounce } from '@/hooks/use-debounce';
import {
  BasicQueryParams,
  CreateInvoicePayload,
  Item,
} from '@/interfaces/payload.interface';
import { InvoiceStatus, PaymentMethods } from '@/interfaces/response.interface';
import logger from '@/lib/logger';
import { useGetAllCustomersQuery } from '@/store/services/customer';
import { useGetAllItemsFromInventoryQuery } from '@/store/services/inventory';
import {
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
} from '@/store/services/sales';
import { ArrowLeft, Minus, Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const EditInvoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const { showLoader, hideLoader } = useLoading();

  const [inventoryItemsParams, setInventoryItemsParams] =
    useState<BasicQueryParams>({
      limit: 10,
      page: 1,
    });

  const debouncedInventoryItemSearch = useDebounce(inventoryItemsParams.search);
  // Queries
  const { data: invoiceData, isLoading: isInvoiceLoading } = useGetInvoiceQuery(
    id as string,
    {
      skip: !id,
    }
  );
  const { data: customersData } = useGetAllCustomersQuery({});
  const { data: inventoryData } = useGetAllItemsFromInventoryQuery({
    limit: inventoryItemsParams.limit,
    page: inventoryItemsParams.page,
    search: debouncedInventoryItemSearch,
  });
  const [updateInvoice] = useUpdateInvoiceMutation();

  // Form state
  const [formData, setFormData] = useState<{
    customerId: string;
    invoiceDate: Date;
    paymentMethod: string;
    status: string;
    customerPaid: number;
    notes: string;
    vehicleNumber: string;
    invoiceNumber: string;
  }>({
    customerId: '',
    invoiceDate: new Date(),
    paymentMethod: '',
    vehicleNumber: '',
    status: InvoiceStatus.UNPAID,
    notes: '',
    customerPaid: 0,
    invoiceNumber: '',
  });

  // Products state
  const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);

  // Calculations state
  const [calculations, setCalculations] = useState<{
    beforeDiscountTotalAmount: number;
    afterDiscountTotalAmount: number;
    discount: number;
  }>({
    beforeDiscountTotalAmount: 0,
    afterDiscountTotalAmount: 0,
    discount: 0,
  });

  // Populate form with existing invoice data
  useEffect(() => {
    if (invoiceData?.data) {
      const invoice = invoiceData.data;
      setFormData({
        customerId: invoice.customerId._id,
        invoiceDate: new Date(invoice.invoiceDate),
        paymentMethod: invoice.paymentMethod,
        vehicleNumber: invoice.vehicleNumber,
        status: invoice.status,
        notes: invoice.notes,
        customerPaid: invoice.customerPaid,
        invoiceNumber: invoice.invoiceNumber,
      });

      setSelectedProducts(
        invoice.items.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          amount: item.amount,
          discount: item.discount || 0,
          units: item.units,
        }))
      );

      setCalculations({
        beforeDiscountTotalAmount:
          invoice.totalAmount + (invoice.discount || 0),
        afterDiscountTotalAmount: invoice.totalAmount,
        discount: invoice.discount || 0,
      });
    }
  }, [invoiceData]);

  // Update form data
  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string | number | Date) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Recalculate totals when products or discount changes
  useEffect(() => {
    let beforeDiscountTotalAmount = 0;

    selectedProducts.forEach((product) => {
      beforeDiscountTotalAmount += product.sellingPrice * product.quantity;
    });

    setCalculations((prev) => ({
      ...prev,
      beforeDiscountTotalAmount,
      afterDiscountTotalAmount: beforeDiscountTotalAmount - prev.discount,
    }));
  }, [selectedProducts, calculations.discount]);

  useEffect(() => {
    if (formData.status === InvoiceStatus.PAID) {
      setFormData((prev) => ({
        ...prev,
        customerPaid: calculations.afterDiscountTotalAmount,
      }));
    }
  }, [formData.status, calculations.afterDiscountTotalAmount]);

  // Handle product quantity change
  const handleProductQuantityChange = useCallback(
    (index: number, quantity: number) => {
      setSelectedProducts((prev) => {
        const updatedProducts = [...prev];
        const product = updatedProducts[index];
        product.quantity = quantity;
        product.amount = product.sellingPrice * quantity - product.discount;
        return updatedProducts;
      });
    },
    []
  );

  // Remove a product
  const handleDeleteProduct = useCallback((index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Add a new product
  const handleAddProduct = useCallback((inventoryItem: any) => {
    if (!inventoryItem) return;

    setSelectedProducts((prev) => [
      ...prev,
      {
        itemId: inventoryItem._id,
        name: inventoryItem.name,
        quantity: 1,
        sellingPrice: inventoryItem.sellingPrice,
        amount: inventoryItem.sellingPrice,
        discount: 0,
        units: inventoryItem.units,
      },
    ]);
  }, []);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!formData.customerId) {
        toast.error('Please select a customer');
        return;
      }

      if (selectedProducts.length === 0) {
        toast.error('Please add at least one product');
        return;
      }

      if (!formData.invoiceNumber) {
        toast.error('Please enter an invoice number');
        return;
      }

      try {
        showLoader();

        // Create the update payload
        const invoicePayload: CreateInvoicePayload = {
          ...formData,
          dueAmount:
            calculations.afterDiscountTotalAmount - formData.customerPaid,
          items: selectedProducts,
          totalAmount: calculations.afterDiscountTotalAmount,
          discount: calculations.discount,
        };

        // Update the invoice
        await updateInvoice({
          id: id as string,
          payload: invoicePayload,
        }).unwrap();

        toast.success('Invoice updated successfully');
        router.push('/sales');
      } catch (error) {
        logger(error, 'Failed to update invoice');
        toast.error('Failed to update invoice');
      } finally {
        hideLoader();
      }
    },
    [
      formData,
      selectedProducts,
      calculations,
      id,
      updateInvoice,
      showLoader,
      hideLoader,
      router,
    ]
  );

  // Loading state
  if (isInvoiceLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center p-8'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent'></div>
      </div>
    );
  }

  // If invoice not found
  if (!invoiceData?.data && !isInvoiceLoading) {
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
        <h2 className='text-2xl font-bold tracking-tight'>Edit Invoice</h2>
        <Button variant='outline' onClick={() => router.push('/sales')}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Sales
        </Button>
      </div>

      <form onSubmit={async (e) => await handleSubmit(e)}>
        <div className='mb-6 grid grid-cols-1 items-end gap-6 md:grid-cols-3'>
          {/* Invoice Number */}
          <div className='relative space-y-2'>
            <Label>
              Invoice Number <span className='ml-1 text-red-500'>*</span>
            </Label>
            <Input
              onChange={(e) =>
                handleInputChange('invoiceNumber', e.target.value)
              }
              value={formData.invoiceNumber}
              placeholder=''
              disabled
            />
          </div>

          {/* Customer Name */}
          <div className='relative space-y-2'>
            <Label>
              Customer Name <span className='ml-1 text-red-500'>*</span>
            </Label>
            <div className='flex gap-2'>
              <AutoComplete
                options={customersData?.data?.customers || []}
                getOptionLabel={(option) => option?.name || ''}
                getOptionValue={(option) => option?._id || ''}
                selectedValue={customersData?.data?.customers.find(
                  (c) => c._id === formData.customerId
                )}
                onSelectedValueChange={(value) =>
                  handleInputChange('customerId', value?._id || '')
                }
                placeholder='Search Customer'
                className='w-full'
                disable={true}
                searchValue={
                  customersData?.data?.customers.find(
                    (c) => c._id === formData.customerId
                  )?.name || ''
                }
              />
            </div>
          </div>

          {/* Invoice Date */}
          <div className='relative space-y-2'>
            <CalendarForm
              onChange={(date) => handleInputChange('invoiceDate', date)}
              selectedDate={formData.invoiceDate}
              label='Invoice Date'
              className='w-full'
            />
          </div>

          {/* Vehicle Number */}
          <div className='relative space-y-2'>
            <Label>Vehicle Number</Label>
            <Input
              onChange={(e) =>
                handleInputChange('vehicleNumber', e.target.value)
              }
              value={formData.vehicleNumber}
              placeholder='TG 08 M 0000'
            />
          </div>

          {/* Invoice Status */}
          <div className='relative space-y-2'>
            <Label>
              Invoice Status <span className='ml-1 text-red-500'>*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Invoice Status' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(InvoiceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className='relative space-y-2'>
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange('paymentMethod', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Payment Method' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PaymentMethods).map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>
              Products <span className='ml-1 text-red-500'>*</span>
            </Label>
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => setSelectedProducts([])}
              className='mr-2'
            >
              Clear Items
            </Button>
          </div>

          <div className='flex w-full gap-2'>
            <AutoComplete
              options={
                inventoryData?.data?.items.filter(
                  (item) => !selectedProducts.some((p) => p.itemId === item._id)
                ) || []
              }
              getOptionLabel={(option) => option?.name || ''}
              getOptionValue={(option) => option?._id || ''}
              selectedValue={null}
              searchValue={inventoryItemsParams.search}
              onSearchValueChange={(value) =>
                setInventoryItemsParams((prev) => ({ ...prev, search: value }))
              }
              onSelectedValueChange={handleAddProduct}
              placeholder='Search items...'
              className='w-full'
              isLoadingMore={false}
              shouldFilter={false}
            />
            <Button type='button' size='icon' disabled>
              <Plus />
            </Button>
          </div>

          {/* Products Table */}
          <div className='overflow-x-auto rounded-lg border'>
            <table className='min-h-[200px] w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Product / Service
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Unit
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Quantity
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Rate
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Amount
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className='py-4 text-center text-gray-500'>
                      No products added. Search and select products above.
                    </td>
                  </tr>
                ) : (
                  selectedProducts.map((product, index) => (
                    <tr key={index} className='border-t'>
                      <td className='px-4 py-3'>{product.name}</td>
                      <td className='px-4 py-3'>{product.units}</td>
                      <td className='px-4 py-3'>
                        <Input
                          type='number'
                          value={product.quantity}
                          onChange={(e) =>
                            handleProductQuantityChange(
                              index,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className='w-20'
                          min={1}
                        />
                      </td>
                      <td className='px-4 py-3'>
                        ₹{product.sellingPrice.toFixed(2)}
                      </td>
                      <td className='px-4 py-3'>
                        ₹{(product.quantity * product.sellingPrice).toFixed(2)}
                      </td>
                      <td className='px-4 py-3'>
                        <Button
                          type='button'
                          size='icon'
                          variant='ghost'
                          className='text-red-500'
                          onClick={() => handleDeleteProduct(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='mt-6 flex w-full gap-6'>
          {/* Notes Section */}
          <div className='flex w-full flex-col flex-wrap gap-2'>
            <Label htmlFor='notes'>Notes</Label>
            <Textarea
              placeholder='Enter Notes'
              id='notes'
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          {/* Billing Info */}
          <div className='flex w-full flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <span>Total Amount Before Discount</span>
              <span>
                {currencyFormat(calculations.beforeDiscountTotalAmount)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Discount</span>
              <div className='flex items-center justify-center gap-1'>
                <Minus className='h-4 w-4' />
                ₹
                <Input
                  className='max-w-[150px]'
                  type='number'
                  value={calculations.discount.toString()}
                  max={calculations.beforeDiscountTotalAmount}
                  onChange={(e) => {
                    const discountAmount = Number(e.target.value);
                    setCalculations((prev) => ({
                      ...prev,
                      discount: discountAmount,
                      afterDiscountTotalAmount:
                        prev.beforeDiscountTotalAmount - discountAmount,
                    }));
                  }}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span>Total Amount After Discount</span>
              <span>
                {currencyFormat(calculations.afterDiscountTotalAmount)}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span>Amount Paid</span>
              <div className='flex items-center justify-center gap-1'>
                <Minus className='h-4 w-4' />
                ₹
                <Input
                  className='max-w-[150px]'
                  type='number'
                  // Enable input only when status is PARTIALLY_PAID or PAID
                  disabled={formData.status === InvoiceStatus.UNPAID}
                  value={formData.customerPaid.toString()}
                  max={calculations.afterDiscountTotalAmount}
                  onChange={(e) => {
                    const amountPaid = Number(e.target.value);
                    // If the entered amount meets/exceeds the total, mark as PAID
                    if (amountPaid >= calculations.afterDiscountTotalAmount) {
                      handleInputChange('status', InvoiceStatus.PAID);
                      handleInputChange(
                        'customerPaid',
                        calculations.afterDiscountTotalAmount
                      );
                    } else if (amountPaid > 0) {
                      handleInputChange('status', InvoiceStatus.PARTIALLY_PAID);
                      handleInputChange('customerPaid', amountPaid);
                    } else {
                      handleInputChange('status', InvoiceStatus.UNPAID);
                      handleInputChange('customerPaid', 0);
                    }
                  }}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span>Due Amount</span>
              <span
                className={
                  calculations.afterDiscountTotalAmount -
                    formData.customerPaid >
                  0
                    ? 'text-destructive font-bold'
                    : 'font-bold text-green-600'
                }
              >
                {currencyFormat(
                  calculations.afterDiscountTotalAmount - formData.customerPaid
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-6 flex w-full items-end justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/sales')}
          >
            Cancel
          </Button>
          <Button type='submit'>
            <Save className='mr-2 h-4 w-4' />
            Update Invoice
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoice;
