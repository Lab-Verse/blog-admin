'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordPage from '@/components/auth/pages/ForgotPasswordPage';
import { useForgotPasswordMutation } from '@/redux/api/auth/authApi';
import { toast } from 'sonner';

interface ErrorWithData {
  data?: { message?: string };
}

const Page: React.FC = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (data: { email: string }) => {
    try {
      const result = await forgotPassword(data).unwrap();
      
      if (result.resetUrl) {
        toast.success('Reset token generated!', { duration: 10000 });
        toast.info(
          `Click to reset: ${result.resetUrl}`,
          { duration: 30000 }
        );
        setTimeout(() => {
          if (result.resetUrl) {
            window.location.href = result.resetUrl;
          }
        }, 2000);
      } else {
        toast.success('Password reset link sent to your email!');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('Forgot password failed:', error);
      const errorMessage = (error as ErrorWithData)?.data?.message || 'Failed to send reset link. Please try again.';
      toast.error(errorMessage);
    }
  };

  return <ForgotPasswordPage onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default Page;
