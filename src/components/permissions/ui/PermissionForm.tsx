'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PermissionFormData {
    name: string;
    slug: string;
}

interface PermissionFormProps {
    initialData?: PermissionFormData;
    onSubmit: (data: PermissionFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel: () => void;
}

export default function PermissionForm({
    initialData,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save',
    onCancel,
}: PermissionFormProps) {
    const [formData, setFormData] = useState<PermissionFormData>(
        initialData ?? {
            name: '',
            slug: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    Permission Name
                </label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. View Users"
                />
                <p className="text-xs text-gray-500">
                    A descriptive name for the permission.
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
                    placeholder="e.g. users.view"
                />
                <p className="text-xs text-gray-500">
                    A unique identifier for the permission (e.g. module.action).
                </p>
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
