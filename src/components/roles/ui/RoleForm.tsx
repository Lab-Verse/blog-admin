'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RoleFormData {
    name: string;
    slug: string;
    description: string;
}

interface RoleFormProps {
    initialData?: RoleFormData;
    onSubmit: (data: RoleFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel: () => void;
}

export default function RoleForm({
    initialData,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save',
    onCancel,
}: RoleFormProps) {
    const [formData, setFormData] = useState<RoleFormData>(
        initialData ?? {
            name: '',
            slug: '',
            description: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Role Name
                </label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Content Editor"
                />
                <p className="text-xs text-gray-500">
                    A descriptive name for the role.
                </p>
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
                    placeholder="e.g. editor"
                />
                <p className="text-xs text-gray-500">
                    A unique identifier for the role (e.g. admin, user).
                </p>
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
                    placeholder="Brief description of what this role can do."
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
