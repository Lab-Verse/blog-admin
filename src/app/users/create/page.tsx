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
      
      // Temporary mock implementation until API is working
      const mockUser = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('Mock user created:', mockUser);
      alert('User created successfully! (Mock implementation)');
      router.push('/users');
      
      // Uncomment when API is working:
      // const result = await createUser(data).unwrap();
      // console.log('User created successfully:', result);
      
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
