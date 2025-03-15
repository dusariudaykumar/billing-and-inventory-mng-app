import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';

interface Props {
  className?: string;
  containerClass?: string;
  onChange: (value: string) => void;
  value: string;
  placeholderText?: string;
}

export const SearchBar: React.FC<Props> = ({
  className,
  onChange,
  value,
  containerClass,
  placeholderText,
}) => {
  return (
    <div className={cn('relative', containerClass)}>
      <Input
        type='text'
        placeholder={placeholderText || 'Search'}
        className={cn('pl-4 pr-12', className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className='absolute bottom-0 right-3 top-0 my-auto h-6 w-6 text-gray-500' />
    </div>
  );
};
