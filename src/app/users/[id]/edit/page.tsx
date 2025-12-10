'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import UpdateUserPage from '@/components/users/pages/UpdateUserPage'; 
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/redux/api/user/usersApi';
import { UpdateUserDto } from '@/redux/types/user/users.types';

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [updateUser] = useUpdateUserMutation();

  const handleSubmit = async (data: UpdateUserDto) => {
    try {
      await updateUser({ id, data }).unwrap();
      router.push(`/users/${id}`);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <UpdateUserPage
      user={user || null}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default Page;
