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

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Schema for custom service validation
const customServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  sellingPrice: z.number().min(0, 'Price must be a positive number'),
  quantity: z.number().optional(),
  units: z.string().optional(),
});

export type CustomServiceFormData = z.infer<typeof customServiceSchema>;

interface CustomServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: CustomServiceFormData) => void;
  initialData?: CustomServiceFormData;
}

export const CustomServiceModal: React.FC<CustomServiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const form = useForm<CustomServiceFormData>({
    resolver: zodResolver(customServiceSchema),
    defaultValues: initialData || {
      name: '',
      sellingPrice: 0,
      quantity: 0,
      units: '',
    },
  });

  const handleSubmit = (data: CustomServiceFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Add Custom Service'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-full space-y-4'
        >
          <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2'>
            {/* Service Name Field */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>
                    Service Name <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Service name or description'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name='sellingPrice'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>
                    Price (₹) <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.00'
                      className='w-full'
                      {...field}
                      value={field.value.toString()}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
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
              Add Service
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
