'use client';

// import { Spinner } from '@/components/ui/';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronDown, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props<T> = {
  /** SelectedValue should provided as form of one item inside options like options[0]
   */
  selectedValue: T;

  /** This function return selected option as form of one item inside options like options[0]
   */
  onSelectedValueChange: (value: T) => void;

  /** This is the value that is typed in the input field. It is used to filter the options.
   */

  searchValue?: string;

  /**
   * This function is called when the user types in the input field. It is used to filter the options.
   * It is useful when you want to fetch the options from the server based on the search query.
   */
  onSearchValueChange?: (value: string) => void;

  /**
   * Any array is acceptable but make sure to provide getOptionLabel for retuning label from array item
   * and getOptionValue for equality check of two option getOptionValue should return unique string across array
   */
  options: T[];

  /**
   * This function is called to get the label of the option. It is used to display the options in the dropdown.
   */
  getOptionLabel: (value: T) => string;

  /**
   * This function is called to get the value of the option. It is used to compare the selected value with the options.
   * Make sure that the value is unique for each option. "id" is a good candidate for this.
   */
  getOptionValue: (value: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;

  /**
   * This function is called when the user scrolls to the bottom of the list.
   */
  loadMore?: () => void;

  /**
   * If you set it to true, it will show the loading spinner at the bottom of the list. it is usefull for paginated lists.
   */
  isLoadingMore?: boolean;

  /**
   * If you set it to false, you must conditionally render valid options based on the search query yourself.
   */
  shouldFilter?: boolean;
  filterFunction?: (value: T, searchValue: string) => boolean;
  className?: string;
};

export function AutoComplete<T>({
  selectedValue,
  onSelectedValueChange,
  options,
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...',
  loadMore,
  isLoadingMore,
  getOptionLabel,
  getOptionValue,
  shouldFilter = true,
  filterFunction,
  className,
  onSearchValueChange,
  searchValue,
}: Props<T>) {
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    onSearchValueChange?.('');
    onSelectedValueChange('' as T);
  }

  const onSelectItem = (inputValue: string) => {
    const newSelectedValue = options.find(
      (option) => getOptionValue(option) === inputValue
    );
    if (newSelectedValue) {
      onSelectedValueChange(newSelectedValue);
      onSearchValueChange?.(getOptionLabel(newSelectedValue));
    }
    setOpen(false);
  };

  //this function is called when the user scrolls to the bottom of the list
  function onScroll(event: React.SyntheticEvent) {
    const listboxNode = event.currentTarget as HTMLElement;
    if (
      Math.round(listboxNode.scrollTop + listboxNode.clientHeight) ===
      listboxNode.scrollHeight
    ) {
      loadMore?.();
    }
  }

  function handleOpenChange(open: boolean) {
    setOpen(open);

    if (!open) {
      onSearchValueChange?.(getOptionLabel(selectedValue) ?? ''); //in here even if options is empty, it making request via changing the searchValue which triggers the fetch
    }
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <Command
          shouldFilter={shouldFilter}
          onKeyDown={onScroll}
          {...(filterFunction && { filterFunction })}
        >
          <PopoverPrimitive.Anchor>
            <div className='relative'>
              <PopoverTrigger asChild onClick={() => setOpen(true)}>
                <CommandPrimitive.Input
                  asChild
                  value={searchValue}
                  onKeyDown={(e) => setOpen(e.key !== 'Escape')}
                  onValueChange={onSearchValueChange}
                >
                  <Input
                    placeholder={placeholder}
                    className='pr-20'
                    ref={inputRef}
                  />
                </CommandPrimitive.Input>
              </PopoverTrigger>
              <div className='absolute bottom-0 right-2 top-0 flex h-full max-w-20 items-center gap-2 overflow-hidden'>
                {selectedValue && searchValue && (
                  <Button
                    className='h-6 w-6 rounded-full'
                    variant='ghost'
                    size='icon'
                    onClick={reset}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        reset();
                      }
                    }}
                  >
                    <X />
                  </Button>
                )}
                <PopoverTrigger asChild>
                  <Button
                    className='h-6 w-6 rounded-full'
                    variant='ghost'
                    size='icon'
                    onClick={() => inputRef.current?.focus()}
                    onKeyDown={(e) => {
                      inputRef.current?.focus();
                      setOpen(e.key !== 'Escape');
                    }}
                  >
                    <ChevronDown
                      className={cn(
                        'h-4 w-4',
                        open ? 'rotate-180 transform' : ''
                      )}
                    />
                  </Button>
                </PopoverTrigger>
              </div>
            </div>
          </PopoverPrimitive.Anchor>
          {!open && <CommandList aria-hidden='true' className='hidden' />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute('cmdk-input')
              ) {
                e.preventDefault();
              }
            }}
            className='w-[--radix-popover-trigger-width] p-0'
          >
            {open && (
              <CommandList onScroll={onScroll}>
                {isLoading && (
                  <CommandPrimitive.Loading>
                    <div className='flex justify-center p-4'>
                      Loading...
                      {/* <Spinner size={32} /> */}
                    </div>
                  </CommandPrimitive.Loading>
                )}

                <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={getOptionValue(option)}
                      value={getOptionValue(option)}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                      className='flex items-center justify-between'
                    >
                      <span>{getOptionLabel(option)}</span>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          getOptionValue(selectedValue) ===
                            getOptionLabel(option)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                  {isLoadingMore && (
                    <CommandItem className='flex justify-center' disabled>
                      Loading...
                      {/* <Spinner size={32} /> */}
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            )}
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
