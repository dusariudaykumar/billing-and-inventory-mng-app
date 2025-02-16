import { useAppSelector } from '@/store/hooks';
import { getUserData } from '@/store/slice/authSlice';
import { LoginForm } from 'components/login-form';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector(getUserData)!;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
