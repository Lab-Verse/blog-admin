'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreatePermissionPage from '@/components/permissions/pages/CreatePermissionPage';
import { useCreatePermissionMutation } from '@/redux/api/permission/permissions.api';

export default function Page() {
    const router = useRouter();
    const [createPermission] = useCreatePermissionMutation();

    const handleSubmit = async (data: { name: string; slug: string }) => {
        try {
            await createPermission(data).unwrap();
            router.push('/permissions');
        } catch (error) {
            console.error('Failed to create permission:', error);
            alert('Failed to create permission');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <CreatePermissionPage
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
