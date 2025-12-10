'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CreateTagPage from '@/components/tags/pages/CreateTagPage';
import { useCreateTagMutation } from '@/redux/api/tags/tagsApi';

export default function Page() {
    const router = useRouter();
    const [createTag] = useCreateTagMutation();

    const handleSubmit = async (data: { name: string; slug: string }) => {
        try {
            await createTag(data).unwrap();
            router.push('/tags');
        } catch (error) {
            console.error('Failed to create tag:', error);
            alert('Failed to create tag');
        }
    };

    const handleCancel = () => {
        router.push('/tags');
    };

    return <CreateTagPage onSubmit={handleSubmit} onCancel={handleCancel} />;
}
