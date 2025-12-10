'use client';

import { useState } from 'react';
import UsersPageComponent from '@/components/users/pages/UsersPageComponent';
import { useGetUsersQuery, useDeleteUserMutation } from '@/redux/api/user/usersApi';
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
    if (confirm(`Are you sure you want to delete user ${user.email || user.name || 'this user'}?`)) {
      await deleteUser(user.id);
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
      currentPage={page}
      onPageChange={setPage}
      totalPages={Math.ceil((usersData?.total || 0) / limit)}
    />
  );
}