'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PermissionsPage from '@/components/permissions/pages/PermissionsPage';
import { useGetPermissionsQuery, useDeletePermissionMutation } from '@/redux/api/permission/permissions.api';
import { Permission } from '@/redux/types/permission/permissions.types';

export default function Page() {
    const router = useRouter();
    const { data: permissions, isLoading } = useGetPermissionsQuery();
    const [deletePermission] = useDeletePermissionMutation();

    const handleAdd = () => {
        router.push('/permissions/create');
    };

    const handleEdit = (permission: Permission) => {
        router.push(`/permissions/${permission.id}/edit`);
    };

    const handleDelete = async (permission: Permission) => {
        if (confirm(`Are you sure you want to delete permission "${permission.name}"?`)) {
            try {
                await deletePermission(permission.id).unwrap();
            } catch (error) {
                console.error('Failed to delete permission:', error);
                alert('Failed to delete permission');
            }
        }
    };

    return (
        <PermissionsPage
            permissions={permissions || []}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
