'use client';

export const Loader = () => {
  return (
    <div className='z-1000 fixed inset-0 flex items-center justify-center overflow-hidden bg-gray-200/70'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent'></div>
    </div>
  );
};
