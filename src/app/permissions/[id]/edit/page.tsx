'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditPermissionPage from '@/components/permissions/pages/EditPermissionPage';
import { useGetPermissionByIdQuery, useUpdatePermissionMutation } from '@/redux/api/permission/permissions.api';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: permission, isLoading, error } = useGetPermissionByIdQuery(id);
    const [updatePermission] = useUpdatePermissionMutation();

    const handleSubmit = async (data: { name: string; slug: string }) => {
        try {
            await updatePermission({ id, body: data }).unwrap();
            router.push('/permissions');
        } catch (error) {
            console.error('Failed to update permission:', error);
            alert('Failed to update permission');
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

    if (error || !permission) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <p className="text-lg font-medium">Permission not found</p>
                <button
                    onClick={() => router.push('/permissions')}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go back to permissions
                </button>
            </div>
        );
    }

    return (
        <EditPermissionPage
            permission={permission}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}

