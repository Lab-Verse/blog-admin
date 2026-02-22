'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RegisterPage from '../../../components/auth/pages/RegisterPage';
import { useRegisterMutation } from '../../../redux/api/auth/authApi';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const Page: React.FC = () => {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const result = await register({ 
        username: data.name,
        email: data.email, 
        password: data.password 
      }).unwrap();
      console.log('✅ Registration successful:', result);
      toast.success('Account created successfully! Welcome aboard!');
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('❌ Registration Error Details:', {
        error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : [],
      });

      let errorMessage = 'Registration failed. Please try again.';
      
      if (error && typeof error === 'object' && 'status' in error) {
        const fetchError = error as FetchBaseQueryError;
        
        if (fetchError.status === 'FETCH_ERROR') {
          errorMessage = '🔌 Cannot connect to backend!\n\n' +
            'Please make sure:\n' +
            '• Backend is running: cd blog-api && npm run start:dev\n' +
            '• Backend is on port 3000';
        } else if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
          const backendError = fetchError.data as { message?: string | string[] };
          
          if (Array.isArray(backendError.message)) {
            errorMessage = backendError.message.join(', ');
          } else if (backendError.message) {
            errorMessage = backendError.message;
          }
        } else if (typeof fetchError.status === 'number' && fetchError.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const serializedError = error as SerializedError;
        errorMessage = serializedError.message || errorMessage;
      }
      
      toast.error(errorMessage, { duration: 6000 });
    }
  };

  return <RegisterPage onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Page;
