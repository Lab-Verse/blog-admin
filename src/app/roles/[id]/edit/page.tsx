'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditRolePage from '@/components/roles/pages/EditRolePage';
import { useGetRoleByIdQuery, useUpdateRoleMutation } from '@/redux/api/role/roles.api';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: role, isLoading, error } = useGetRoleByIdQuery(id);
    const [updateRole] = useUpdateRoleMutation();

    const handleSubmit = async (data: { name: string; slug: string; description: string }) => {
        try {
            await updateRole({ id, body: data }).unwrap();
            router.push('/roles');
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Failed to update role');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !role) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <p className="text-lg font-medium">Role not found</p>
                <button
                    onClick={() => router.push('/roles')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go back to roles
                </button>
            </div>
        );
    }

    return (
        <EditRolePage
            role={role}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}

