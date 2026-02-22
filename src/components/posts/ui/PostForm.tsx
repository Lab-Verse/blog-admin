'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostStatus } from '@/redux/types/post/posts.types';
import { Category } from '@/redux/types/category/categories.types';
import { Tag } from '@/redux/types/tags/types';
import { Media } from '@/redux/types/media/media.types';

interface PostFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    description: string;
    category_id: string;
    status: PostStatus;
    featured_image?: File | string;
    tag_ids?: string[];
    media_ids?: string[];
}

interface PostFormProps {
    initialData?: PostFormData;
    categories: Category[];
    tags: Tag[];
    mediaList: Media[];
    onSubmit: (data: PostFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel: () => void;
}

export default function PostForm({
    initialData,
    categories,
    tags,
    mediaList,
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
            description: '',
            category_id: '',
            status: PostStatus.DRAFT,
            featured_image: '',
            tag_ids: [],
            media_ids: [],
        }
    );
    const [imagePreview, setImagePreview] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, featured_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prev) => ({ ...prev, media_ids: selectedOptions }));
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prev) => ({ ...prev, tag_ids: selectedOptions }));
    };

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

                    <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <select
                            id="tags"
                            multiple
                            value={formData.tag_ids}
                            onChange={handleTagChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            size={5}
                        >
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="featured_image" className="text-sm font-medium text-gray-700">
                            Featured Image
                        </label>
                        <input
                            id="featured_image"
                            name="featured_image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded-md" />
                        )}
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

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="SEO description..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="media" className="text-sm font-medium text-gray-700">
                    Media
                </label>
                <select
                    id="media"
                    multiple
                    value={formData.media_ids}
                    onChange={handleMediaChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    size={6}
                >
                    {mediaList.map((media) => (
                        <option key={media.id} value={media.id}>
                            {media.filename} ({media.type})
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple media files</p>
                {formData.media_ids && formData.media_ids.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-3">
                        {formData.media_ids.map((mediaId) => {
                            const media = mediaList.find(m => m.id === mediaId);
                            return media ? (
                                <div key={mediaId} className="relative">
                                    <img
                                        src={media.url}
                                        alt={media.filename}
                                        className="h-24 w-full object-cover rounded-md"
                                    />
                                    <p className="text-xs text-gray-600 mt-1 truncate">{media.filename}</p>
                                </div>
                            ) : null;
                        })}
                    </div>
                )}
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
