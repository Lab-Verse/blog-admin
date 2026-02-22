'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateUserPage from '../../../components/users/pages/CreateUserPage';
import { useCreateUserMutation } from '../../../redux/api/user/usersApi';
import { CreateUserDto } from '@/redux/types/user/users.types';

const Page: React.FC = () => {
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      console.log('Creating user with data:', data);
      const result = await createUser(data).unwrap();
      console.log('User created successfully:', result);
      alert('User created successfully!');
      router.push('/users');
    } catch (error: any) {
      console.error('Failed to create user:', {
        error,
        message: error?.message || 'Unknown error',
        data: error?.data || 'No error data',
        status: error?.status || 'No status'
      });
      alert('Failed to create user: ' + (error?.data?.message || error?.message || 'Unknown error'));
    }
  };

  return <CreateUserPage onSubmit={handleSubmit} />;
};

export default Page;
