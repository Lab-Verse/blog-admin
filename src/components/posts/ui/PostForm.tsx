'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostStatus } from '@/redux/types/post/posts.types';
import { Category } from '@/redux/types/category/categories.types';

interface PostFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category_id: string;
    status: PostStatus;
    featured_image: string;
}

interface PostFormProps {
    initialData?: PostFormData;
    categories: Category[];
    onSubmit: (data: PostFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel: () => void;
}

export default function PostForm({
    initialData,
    categories,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save',
    onCancel,
}: PostFormProps) {
    const [formData, setFormData] = useState<PostFormData>(
        initialData || {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            category_id: '',
            status: PostStatus.DRAFT,
            featured_image: '',
        }
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Post Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                            Slug
                        </label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            placeholder="post-slug"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category_id" className="text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value={PostStatus.DRAFT}>Draft</option>
                            <option value={PostStatus.PUBLISHED}>Published</option>
                            <option value={PostStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="featured_image" className="text-sm font-medium text-gray-700">
                            Featured Image URL
                        </label>
                        <Input
                            id="featured_image"
                            name="featured_image"
                            value={formData.featured_image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Brief summary of the post..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="# Markdown content goes here..."
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
