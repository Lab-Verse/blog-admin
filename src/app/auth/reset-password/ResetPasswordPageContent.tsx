'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResetPasswordPage from '@/components/auth/pages/ResetPasswordPage';
import { useResetPasswordMutation } from '@/redux/api/auth/authApi';
import { toast } from 'sonner';

interface ErrorWithData {
  data?: { message?: string };
}

const ResetPasswordPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/auth/forgot-password');
    }
  }, [token, router]);

  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ token, password: data.password }).unwrap();
      toast.success('Password reset successfully! You can now log in with your new password.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Reset password failed:', error);
      const errorMessage = (error as ErrorWithData)?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (!token) {
    return null;
  }

  return <ResetPasswordPage onSubmit={handleSubmit} isLoading={isLoading} />;
};

export default ResetPasswordPageContent;
