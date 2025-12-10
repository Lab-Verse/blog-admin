'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '../../../components/auth/pages/LoginPage';
import { useLoginMutation } from '../../../redux/api/auth/authApi';

const Page: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error, e.g., show toast
    }
  };

  return <LoginPage onSubmit={handleSubmit} />;
};

export default Page;
