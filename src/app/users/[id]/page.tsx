'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserDetailsPage from '@/components/users/pages/UserDetailsPage';
import { useGetUserByIdQuery, useDeleteUserMutation } from '@/redux/api/user/usersApi';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [deleteUser] = useDeleteUserMutation();

  const handleEdit = () => {
    router.push(`/users/${id}/edit`);
  };

  const handleDelete = async () => {
    if (user && confirm(`Are you sure you want to delete ${user.username || user.email}?`)) {
      try {
        await deleteUser(id).unwrap();
        router.push('/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleBack = () => {
    router.push('/users');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-500 mb-6">The user you are looking for does not exist or has been removed.</p>
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <UserDetailsPage
      user={user}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
      isLoading={isLoading}
    />
  );
}
