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
import { currencyFormat } from '@/helpers/currency-format';
import { useDebounce } from '@/hooks/use-debounce';
import {
  BasicQueryParams,
  CreateInvoicePayload,
  Item,
} from '@/interfaces/payload.interface';
import {
  Inventory,
  InvoiceStatus,
  PaymentMethods,
} from '@/interfaces/response.interface';
import { useGetAllCustomersQuery } from '@/store/services/customer';
import { useGetAllItemsFromInventoryQuery } from '@/store/services/inventory';
import { useCreateInvoiceMutation } from '@/store/services/sales';
import _ from 'lodash';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// Form error types remain unchanged.
interface FormErrors {
  customerId?: string;
  invoiceDate?: string;
  paymentMethod?: string;
  products?: string;
  invoiceNumber?: string;
}

// NOTE:
// - The Inventory response's "quantity" indicates available stock.
// - For the invoice, we use "invoiceQuantity" for the quantity being ordered,
//   and "availableQuantity" to keep track of stock.
interface SelectedItems
  extends Omit<
    Inventory,
    'updatedAt' | 'createdAt' | 'purchasePrice' | 'quantity'
  > {
  // availableQuantity: number;
  invoiceQuantity: number;
  discount: number;
  amount: number;
}

interface FormData {
  customerId: string;
  invoiceDate: Date;
  paymentMethod: string;
  status: string;
  customerPaid: number;
  notes: string;
  vehicleNumber: string;
  invoiceNumber: string;
}
interface Calculation {
  beforeDiscountTotalAmount: number;
  afterDiscountTotalAmount: number;
  discount: number;
}

const CreateInvoice = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    customerId: '',
    invoiceDate: new Date(),
    paymentMethod: '',
    vehicleNumber: '',
    status: InvoiceStatus.UNPAID,
    notes: '',
    customerPaid: 0,
    invoiceNumber: '',
  });

  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedProducts, setSelectedProducts] = useState<SelectedItems[]>([]);
  const [calculations, setCalculations] = useState<Calculation>({
    afterDiscountTotalAmount: 0,
    beforeDiscountTotalAmount: 0,
    discount: 0,
  });
  const [customerParams, setCustomerParams] = useState<BasicQueryParams>({
    limit: 10,
    page: 1,
  });

  const [
    inventoryItemsParams,
    // setInventoryItemsParams
  ] = useState<BasicQueryParams>({
    limit: 10,
    page: 1,
  });

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

  // Debounce search inputs.
  const debouncedCustomerSearch = useDebounce(customerParams.search);
  const debouncedInventoryItemSearch = useDebounce(inventoryItemsParams.search);

  // Fetch customers and inventory items.
  const {
    data: customers,
    error: customersError,
    // isLoading: isLoadingCustomers,
  } = useGetAllCustomersQuery({
    limit: customerParams.limit,
    page: customerParams.page,
    search: debouncedCustomerSearch,
  });

  const {
    data: inventory,
    error: inventoryError,
    // isLoading: isLoadingInventory,
  } = useGetAllItemsFromInventoryQuery({
    limit: inventoryItemsParams.limit,
    page: inventoryItemsParams.page,
    search: debouncedInventoryItemSearch,
  });

  // Validate required fields and at least one product.
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = 'Choose any Customer';
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Choose Invoice Date';
    }

    if (selectedProducts.length === 0) {
      newErrors.products = 'At least one product is required';
    }

    if (!formData.invoiceNumber) {
      newErrors.invoiceNumber = 'Please enter invoice number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedProducts]);

  // Update form data and clear errors for that field.
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | number | Date) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  // When submitting, merge selected products into form data.
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        const items: Item[] = selectedProducts.map(
          ({ _id, invoiceQuantity, __v, ...rest }) => ({
            ...rest,
            itemId: _id,
            quantity: invoiceQuantity,
          })
        );

        const invoiceData: CreateInvoicePayload = {
          ...formData,
          dueAmount:
            calculations.afterDiscountTotalAmount - formData.customerPaid,
          items,
          totalAmount: calculations.afterDiscountTotalAmount,
          discount: calculations.discount,
          notes: formData.notes,
        };
        await createInvoice(invoiceData).unwrap();
        router.push('/sales');
      }
    },
    [
      calculations.afterDiscountTotalAmount,
      calculations.discount,
      createInvoice,
      formData,
      selectedProducts,
      validateForm,
      router,
    ]
  );

  // Update the invoice quantity while capping it to the available stock.
  const handleProductQuantityChange = useCallback(
    (index: number, quantity: number) => {
      setSelectedProducts((prev) => {
        const updatedProducts = [...prev];
        const product = updatedProducts[index];
        // Cap the invoice quantity to the available quantity.
        // const invoiceQuantity =
        //   quantity > product.availableQuantity
        //     ? product.availableQuantity
        //     : quantity;
        product.invoiceQuantity = quantity;
        product.amount = product.sellingPrice * quantity - product.discount;
        return updatedProducts;
      });
    },
    []
  );

  // Remove a product from the selected list.
  const handleDeleteProduct = useCallback((index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Filter inventory items that haven't already been selected.
  const inventoryItems = useMemo(() => {
    const items = inventory?.data?.items ?? [];
    if (selectedProducts.length === 0) return items;
    return items.filter(
      (item) => !selectedProducts.some((product) => product._id === item._id)
    );
  }, [selectedProducts, inventory?.data?.items]);

  useEffect(() => {
    let beforeDiscountTotalAmount = 0;

    selectedProducts.forEach((product) => {
      beforeDiscountTotalAmount +=
        product.sellingPrice * product.invoiceQuantity;
    });

    setCalculations((prev) => ({
      ...prev,
      beforeDiscountTotalAmount,
      afterDiscountTotalAmount: beforeDiscountTotalAmount - prev.discount,
    }));
  }, [calculations.discount, selectedProducts]);

  useEffect(() => {
    if (formData.status === InvoiceStatus.PAID) {
      setFormData((prev) => ({
        ...prev,
        customerPaid: calculations.afterDiscountTotalAmount,
      }));
    }
  }, [formData.status, calculations.afterDiscountTotalAmount]);

  return (
    <div className='flex h-full w-full flex-1 flex-col space-y-8 overflow-auto p-8'>
      <h2 className='text-2xl font-bold tracking-tight'>Create Invoice</h2>

      {(customersError || inventoryError) && (
        <div className='mb-4 rounded-md bg-red-100 p-2 text-red-700'>
          {customersError && <p>Error loading customers.</p>}
          {inventoryError && <p>Error loading inventory items.</p>}
        </div>
      )}

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
            />
            {errors.invoiceNumber && (
              <p className='absolute bottom-[-20px] text-sm text-red-500'>
                {errors.invoiceNumber}
              </p>
            )}
          </div>
          {/* Customer Name */}
          <div className='relative space-y-2'>
            <Label>
              Customer Name <span className='ml-1 text-red-500'>*</span>
            </Label>
            <div className='flex gap-2'>
              <AutoComplete
                options={customers?.data?.customers || []}
                getOptionLabel={(option) => option?.name || ''}
                getOptionValue={(option) => option?._id || ''}
                selectedValue={undefined}
                onSelectedValueChange={(value) =>
                  handleInputChange('customerId', value?._id || '')
                }
                placeholder='Search Customer'
                className='w-full'
                isLoadingMore={false}
                shouldFilter={false}
                searchValue={customerParams?.search}
                onSearchValueChange={(value) =>
                  setCustomerParams((prev) => ({ ...prev, search: value }))
                }
              />
              {/* TODO: Implement functionality to add a new customer */}
              <Button type='button' size='icon'>
                <Plus />
              </Button>
            </div>
            {errors.customerId && (
              <p className='absolute bottom-[-20px] text-sm text-red-500'>
                {errors.customerId}
              </p>
            )}
          </div>

          {/* Invoice Date */}
          <div className='relative space-y-2'>
            <CalendarForm
              onChange={(date) => handleInputChange('invoiceDate', date)}
              selectedDate={formData.invoiceDate}
              label='Invoice Date'
              className='w-full'
            />
            {errors.invoiceDate && (
              <p className='absolute bottom-[-20px] text-sm text-red-500'>
                {errors.invoiceDate}
              </p>
            )}
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
          <Label>
            Products <span className='ml-1 text-red-500'>*</span>
          </Label>
          <div className='flex w-full gap-2'>
            <AutoComplete
              options={inventoryItems}
              getOptionLabel={(option) => option?.name || ''}
              getOptionValue={(option) => option?._id || ''}
              selectedValue={selectedItem}
              onSelectedValueChange={(option) => {
                if (!option) return;

                const rest = _.omit(option, [
                  'createdAt',
                  'updatedAt',
                  'purchasePrice',
                  'quantity',
                ]);

                setSelectedProducts((prev) => [
                  ...prev,
                  {
                    ...rest,
                    // availableQuantity: quantity, // available stock from inventory
                    invoiceQuantity: 1, // default invoice quantity
                    discount: 0,
                    amount: rest.sellingPrice, // initial amount = sellingPrice * 1
                  },
                ]);
                // Reset selected item to clear the AutoComplete input.
                setSelectedItem(null);
              }}
              placeholder='Search items...'
              className='w-full'
              isLoadingMore={false}
              shouldFilter={false}
            />
            {/* TODO: Implement functionality to add a new product manually */}
            <Button type='button' size='icon'>
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
                  {/* <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Discount
                  </th> */}
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Amount
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-semibold'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={product._id} className='border-t'>
                    <td className='px-4 py-3'>{product.name}</td>
                    <td className='px-4 py-3'>{product.units}</td>
                    <td className='px-4 py-3'>
                      <Input
                        type='number'
                        value={product.invoiceQuantity.toString()}
                        onChange={(e) =>
                          handleProductQuantityChange(
                            index,
                            Number(e.target.value)
                          )
                        }
                        className='w-20'
                        min={1}
                        // max={product.availableQuantity}
                      />
                    </td>
                    <td className='px-4 py-3'>
                      ₹{product.sellingPrice.toFixed(2)}
                    </td>
                    {/* <td className='px-4 py-3'>
                      ₹{product.discount.toFixed(2)}
                    </td> */}
                    <td className='px-4 py-3'>₹{product.amount.toFixed(2)}</td>
                    <td className='px-4 py-3'>
                      <div className='flex gap-2'>
                        {/* Edit functionality not implemented */}
                        {/* <Button type='button' size='icon' variant='ghost'>
                          <Pencil className='h-4 w-4' />
                        </Button> */}
                        <Button
                          type='button'
                          size='icon'
                          variant='ghost'
                          className='text-red-500'
                          onClick={() => {
                            const indexToDelete = selectedProducts.findIndex(
                              (p) => p._id === product._id
                            );
                            if (indexToDelete !== -1) {
                              handleDeleteProduct(indexToDelete);
                            }
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.products && (
            <p className='text-sm text-red-500'>{errors.products}</p>
          )}
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
                <Minus />
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
                <Minus />
                ₹
                <Input
                  className='max-w-[150px]'
                  type='number'
                  // Enable input only when status is PARTIALLY_PAID.
                  disabled={formData.status !== InvoiceStatus.PARTIALLY_PAID}
                  value={formData.customerPaid.toString()}
                  max={calculations.afterDiscountTotalAmount}
                  onChange={(e) => {
                    const amountPaid = Number(e.target.value);
                    // If the entered amount meets/exceeds the total, mark as PAID.
                    if (amountPaid >= calculations.afterDiscountTotalAmount) {
                      handleInputChange('status', InvoiceStatus.PAID);
                      handleInputChange(
                        'customerPaid',
                        calculations.afterDiscountTotalAmount
                      );
                    } else {
                      handleInputChange('customerPaid', amountPaid);
                    }
                  }}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <span>Total Amount</span>
              <span>
                {currencyFormat(
                  calculations.afterDiscountTotalAmount - formData.customerPaid
                )}
              </span>
            </div>
          </div>
        </div>

        <div className='mt-6 flex w-full items-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='animate-spin' />
              </>
            ) : (
              'Create Invoice'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
