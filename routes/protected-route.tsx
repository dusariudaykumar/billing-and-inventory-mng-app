'use client';

import { Loader } from '@/components/loader/loader';
import { useAppSelector } from '@/store/hooks';
import { getUserData } from '@/store/slice/authSlice';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, user } = useAppSelector(getUserData);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router, mounted]);

  if (!mounted || loading) return <Loader />;

  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
