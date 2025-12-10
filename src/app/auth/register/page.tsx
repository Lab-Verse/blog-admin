'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RegisterPage from '../../../components/auth/pages/RegisterPage';
import { useRegisterMutation } from '../../../redux/api/auth/authApi';

const Page: React.FC = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const handleSubmit = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      await register({ name: data.name, email: data.email, password: data.password }).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error
    }
  };

  return <RegisterPage onSubmit={handleSubmit} />;
};

export default Page;
