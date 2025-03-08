'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/loader-provider';
import logger from '@/lib/logger';
import { cn } from '@/lib/utils';
import { useSignupMutation } from '@/store/services/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { showLoader, hideLoader } = useLoading();
  const [signup] = useSignupMutation();
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoader();
    try {
      await signup(formData).unwrap();
      router.push('/login');
    } catch (error) {
      logger(error);
    } finally {
      hideLoader();
    }
  };
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  type='name'
                  placeholder='Full Name'
                  required
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value.trim(),
                    }))
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value.trim(),
                    }))
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  required
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value.trim(),
                    }))
                  }
                />
              </div>
              <Button type='submit' className='w-full'>
                Signup
              </Button>
            </div>
            <div className='mt-4 text-center text-sm'>
              Already have an account?{' '}
              <Link href='/login' className='underline underline-offset-4'>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
