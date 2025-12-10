'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditTagPage from '@/components/tags/pages/EditTagPage';
import { useGetTagByIdQuery, useUpdateTagMutation } from '@/redux/api/tags/tagsApi';

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: tag, isLoading, error } = useGetTagByIdQuery(id);
    const [updateTag] = useUpdateTagMutation();

    const handleSubmit = async (data: { name: string; slug: string }) => {
        try {
            await updateTag({ id, data }).unwrap();
            router.push('/tags');
        } catch (error) {
            console.error('Failed to update tag:', error);
            alert('Failed to update tag');
        }
    };

    const handleCancel = () => {
        router.push('/tags');
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !tag) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 mb-4">Failed to load tag</p>
                <button
                    onClick={() => router.push('/tags')}
                    className="text-blue-600 hover:text-blue-800"
                >
                    Back to Tags
                </button>
            </div>
        );
    }

    return <EditTagPage tag={tag} onSubmit={handleSubmit} onCancel={handleCancel} />;
}

