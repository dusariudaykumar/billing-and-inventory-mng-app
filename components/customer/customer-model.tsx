'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { generateCustomerId } from '@/lib/generateCustomerId';
import { CustomerFormData, customerSchema } from '@/lib/schemas';

import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  CreateCustomerPayload,
  Customer,
} from '@/interfaces/response.interface';

interface Props {
  isOpen: boolean;
  OnClose: () => void;
  customer?: Customer;
  onSubmit: (customer: CreateCustomerPayload) => void;
}

export const CustomerModel: React.FC<Props> = ({
  OnClose,
  isOpen,
  customer,
  onSubmit,
}) => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      companyName: customer?.companyName || '',
      contactDetails: {
        phone: customer?.contactDetails.phone || '',
        email: customer?.contactDetails.email || '',
        address: customer?.contactDetails.address || '',
      },
    },
  });

  const handleSubmit = async (value: CustomerFormData) => {
    const newCustomer: CreateCustomerPayload = {
      name: value.name,
      companyName: value.companyName,
      contactDetails: {
        phone: value.contactDetails.phone,
        email: value.contactDetails.email || null,
        address: value.contactDetails.address || null,
      },
      ...(customer
        ? {}
        : {
            customerID: await generateCustomerId(
              value.name,
              value.contactDetails.phone,
              value.companyName
            ),
          }),
    };
    onSubmit(newCustomer);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={OnClose}
      title={customer ? 'Edit Customer' : 'Add Customer'}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-full space-y-4'
        >
          <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
            {/* Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Name' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Name Field */}
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Company Name'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={form.control}
              name='contactDetails.phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Phone' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name='contactDetails.email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email{' '}
                    <span className='text-xs text-gray-400'>(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Email'
                      className='w-full'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address Field */}
            <FormField
              control={form.control}
              name='contactDetails.address'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>
                    Address{' '}
                    <span className='text-xs text-gray-400'>(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Address'
                      className='w-full'
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <Button type='submit' className='w-full sm:w-auto'>
              {customer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
