'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserDetailsPage from '@/components/users/pages/UserDetailsPage';
import { useGetUserByIdQuery, useDeleteUserMutation, useVerifyUserMutation, useRejectUserMutation } from '@/redux/api/user/usersApi';

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: user, isLoading } = useGetUserByIdQuery(id);
  const [deleteUser] = useDeleteUserMutation();
  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const [rejectUser, { isLoading: isRejecting }] = useRejectUserMutation();

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

  const handleVerify = async () => {
    if (user && confirm(`Are you sure you want to verify ${user.username || user.email}?`)) {
      try {
        await verifyUser(id).unwrap();
        alert('User verified successfully!');
      } catch (error) {
        console.error('Failed to verify user:', error);
        alert('Failed to verify user');
      }
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason (optional):');
    if (user && confirm(`Are you sure you want to reject ${user.username || user.email}?`)) {
      try {
        await rejectUser({ id, reason: reason || undefined }).unwrap();
        alert('User rejected');
      } catch (error) {
        console.error('Failed to reject user:', error);
        alert('Failed to reject user');
      }
    }
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
      onVerify={handleVerify}
      onReject={handleReject}
      isLoading={isLoading}
      isVerifying={isVerifying}
      isRejecting={isRejecting}
    />
  );
}
