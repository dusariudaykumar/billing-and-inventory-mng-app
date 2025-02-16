'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import logger from '@/lib/logger';

interface Props {
  onChange: (value: Date) => void;
  selectedDate: Date;
  label?: string;
  placeholder?: string;
  className?: string;
}
export const CalendarForm: React.FC<Props> = ({
  className,
  onChange,
  selectedDate,
  label,
}) => {
  const formMethods = useForm();
  logger({ data: new Date('10/02/2025'), selectedDate });
  return (
    <FormProvider {...formMethods}>
      <form className={className}>
        <FormItem className='flex w-full flex-col'>
          {label && (
            <FormLabel>
              {label} <span className='ml-1 text-red-500'>*</span>
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  className={cn(
                    'pl-3 text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={(date) => onChange(date as Date)}
                required
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      </form>
    </FormProvider>
  );
};
