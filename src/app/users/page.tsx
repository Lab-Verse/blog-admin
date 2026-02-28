'use client';

import { useState } from 'react';
import UsersPageComponent from '@/components/users/pages/UsersPageComponent';
import { useGetUsersQuery, useDeleteUserMutation, useVerifyUserMutation, useRejectUserMutation } from '@/redux/api/user/usersApi';
import { User } from '@/redux/types/user/users.types';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data: usersData, isLoading } = useGetUsersQuery({ page, limit }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const [deleteUser] = useDeleteUserMutation();
  const [verifyUser] = useVerifyUserMutation();
  const [rejectUser] = useRejectUserMutation();

  const handleAdd = () => {
    router.push('/users/create');
  };

  const handleEdit = (user: User) => {
    router.push(`/users/${user.id}/edit`);
  };

  const handleView = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete user ${user.email || user.username || 'this user'}?`)) {
      await deleteUser(user.id);
    }
  };

  const handleApprove = async (user: User) => {
    try {
      await verifyUser(user.id).unwrap();
    } catch (error: any) {
      alert('Failed to approve user: ' + (error?.data?.message || error.message));
    }
  };

  const handleReject = async (user: User) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      await rejectUser({ id: user.id, reason: reason || undefined }).unwrap();
    } catch (error: any) {
      alert('Failed to reject user: ' + (error?.data?.message || error.message));
    }
  };

  return (
    <UsersPageComponent
      users={usersData?.items || []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onApprove={handleApprove}
      onReject={handleReject}
      currentPage={page}
      onPageChange={setPage}
      totalPages={Math.ceil((usersData?.total || 0) / limit)}
    />
  );
}