'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TagFormData {
    name: string;
    slug: string;
}

interface TagFormProps {
    initialData?: TagFormData;
    onSubmit: (data: TagFormData) => Promise<void>;
    onCancel: () => void;
    isEdit?: boolean;
}

export default function TagForm({ initialData, onSubmit, onCancel, isEdit = false }: TagFormProps) {
    const [formData, setFormData] = useState<TagFormData>(
        initialData || { name: '', slug: '' }
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<TagFormData>>({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setFormData({
            name,
            slug: name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
        });
        if (errors.name) {
            setErrors({ ...errors, name: undefined });
        }
    };

    const handleSlugChange = (slug: string) => {
        setFormData({ ...formData, slug });
        if (errors.slug) {
            setErrors({ ...errors, slug: undefined });
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<TagFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Failed to submit tag:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="Enter tag name"
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="tag-slug"
                        className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        URL-friendly version of the name. Auto-generated from name.
                    </p>
                </div>

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Saving...' : isEdit ? 'Update Tag' : 'Create Tag'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
}
