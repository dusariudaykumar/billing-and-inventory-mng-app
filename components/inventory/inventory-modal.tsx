'use client';
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
  AddNewItemToInventoryPayload,
  Inventory,
} from '@/interfaces/response.interface';
import { InventoryFormData, inventorySchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  OnClose: () => void;
  item?: Inventory;
  onSubmit: (item: AddNewItemToInventoryPayload) => void;
}

export const ItemModal: React.FC<Props> = ({
  OnClose,
  isOpen,
  item,
  onSubmit,
}) => {
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: item?.name || '',
      purchasePrice: item?.purchasePrice || 1,
      sellingPrice: item?.sellingPrice || 1,
      quantity: item?.quantity || 1,
      units: item?.units || '',
    },
  });

  const handleSubmit = async (value: InventoryFormData) => {
    const newItem: AddNewItemToInventoryPayload = {
      name: value.name,
      purchasePrice: value.purchasePrice,
      quantity: value.quantity,
      sellingPrice: value.sellingPrice,
      units: value.units,
    };
    onSubmit(newItem);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={OnClose}
      title={item ? 'Add Stock in' : 'Add Item'}
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
                    Item Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Item name'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity Field */}
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quantity <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      type='number'
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selling Price Field */}
            <FormField
              control={form.control}
              name='sellingPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Selling Price (₹) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Company Name'
                      className='w-full'
                      {...field}
                      type='number'
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Price Field */}
            <FormField
              control={form.control}
              name='purchasePrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Purchase Price (₹) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      type='number'
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Units Field */}
            <FormField
              control={form.control}
              name='units'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>
                    Units <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Piece / Kg / etc.'
                      className='w-full'
                      {...field}
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
              {item ? 'Update Stock' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
