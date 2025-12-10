'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateRolePage from '@/components/roles/pages/CreateRolePage';
import { useCreateRoleMutation } from '@/redux/api/role/roles.api';

export default function Page() {
    const router = useRouter();
    const [createRole] = useCreateRoleMutation();

    const handleSubmit = async (data: { name: string; slug: string; description: string }) => {
        try {
            await createRole(data).unwrap();
            router.push('/roles');
        } catch (error) {
            console.error('Failed to create role:', error);
            alert('Failed to create role');
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <CreateRolePage
            onSubmit={handleSubmit}
            onCancel={handleCancel}
        />
    );
}
