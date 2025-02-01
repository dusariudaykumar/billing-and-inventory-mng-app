import { Loader } from '@/components/loader/loader';
import { useAppSelector } from '@/store/hooks';
import { getUserData } from '@/store/slice/authSlice';
import React from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAppSelector(getUserData);

  if (loading) {
    return <Loader />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
