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

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      const result = await login(data).unwrap();
      console.log('✅ Login successful:', result);
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (error: unknown) {
      // Detailed error logging for debugging
      console.error('❌ Login Error Details:', {
        error,
        errorType: typeof error,
        errorKeys: error ? Object.keys(error) : [],
        errorString: JSON.stringify(error, null, 2)
      });

      let errorMessage = 'Login failed. Please check your credentials.';
      
      // Check if it's a FetchBaseQueryError
      if (error && typeof error === 'object' && 'status' in error) {
        const fetchError = error as FetchBaseQueryError;
        
        console.log('📍 Error Status:', fetchError.status);
        console.log('📍 Error Data:', fetchError.data);
        
        if (fetchError.status === 'FETCH_ERROR') {
          errorMessage = '🔌 Cannot connect to backend!\n\n' +
            'Please make sure:\n' +
            '• Backend is running: cd blog-api && npm run start:dev\n' +
            '• Backend is on port 3000\n' +
            '• Check terminal for backend errors';
        } else if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
          //  Backend error format: { success: false, statusCode: 401, message: "...", timestamp, path }
          const backendError = fetchError.data as { message?: string | string[] };
          
          // Handle both string and array messages
          if (Array.isArray(backendError.message)) {
            errorMessage = backendError.message.join(', ');
          } else if (backendError.message) {
            errorMessage = backendError.message;
          }
        } else if (typeof fetchError.status === 'number' && fetchError.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        // SerializedError format
        const serializedError = error as SerializedError;
        errorMessage = serializedError.message || errorMessage;
      }
      
      toast.error(errorMessage, { duration: 6000 });
    }
  };

  return <LoginPage onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Page;
