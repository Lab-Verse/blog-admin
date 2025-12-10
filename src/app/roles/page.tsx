'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import RolesPage from '@/components/roles/pages/RolesPage';
import { useGetRolesQuery, useDeleteRoleMutation } from '@/redux/api/role/roles.api';
import { Role } from '@/redux/types/role/roles.types';

export default function Page() {
    const router = useRouter();
    const { data: roles, isLoading } = useGetRolesQuery();
    const [deleteRole] = useDeleteRoleMutation();

    const handleAdd = () => {
        router.push('/roles/create');
    };

    const handleEdit = (role: Role) => {
        router.push(`/roles/${role.id}/edit`);
    };

    const handleDelete = async (role: Role) => {
        if (role.is_system) {
            alert('Cannot delete system roles.');
            return;
        }
        if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
            try {
                await deleteRole(role.id).unwrap();
            } catch (error) {
                console.error('Failed to delete role:', error);
                alert('Failed to delete role');
            }
        }
    };

    return (
        <RolesPage
            roles={roles || []}
            isLoading={isLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
}
