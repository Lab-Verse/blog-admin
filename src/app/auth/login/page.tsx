'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoginPage from '../../../components/auth/pages/LoginPage';
import { useLoginMutation } from '../../../redux/api/auth/authApi';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const Page: React.FC = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const getErrorMessage = (error: unknown): string => {
    let errorMessage = 'Login failed. Please check your credentials.';

    if (error && typeof error === 'object' && 'status' in error) {
      const fetchError = error as FetchBaseQueryError;

      if (fetchError.status === 'FETCH_ERROR') {
        return 'Cannot connect to backend. Please check if API server is running on port 3000.';
      }

      if (
        fetchError.data &&
        typeof fetchError.data === 'object' &&
        'message' in fetchError.data
      ) {
        const backendError = fetchError.data as { message?: string | string[] };
        if (Array.isArray(backendError.message)) {
          return backendError.message.join(', ');
        }
        if (backendError.message) {
          return backendError.message;
        }
      }

      if (typeof fetchError.status === 'number' && fetchError.status >= 500) {
        return 'Server error. Please try again later.';
      }
    }

    if (error && typeof error === 'object' && 'message' in error) {
      const serializedError = error as SerializedError;
      return serializedError.message || errorMessage;
    }

    return errorMessage;
  };

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await login(data).unwrap();
      console.log('✅ Login successful:', result);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, { duration: 6000 });
    }
  };

  return <LoginPage onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Page;
