'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreateCategoryDto, UpdateCategoryDto } from '@/redux/types/category/categories.types';

interface CategoryFormProps {
    /** Optional data for editing an existing category */
    initialData?: UpdateCategoryDto;
    /** Called with the form data when the user submits */
    onSubmit: (data: CreateCategoryDto) => Promise<void>;
    /** Called when the user clicks the Cancel button */
    onCancel: () => void;
    /** Loading state while the mutation is in progress */
    isLoading?: boolean;
}

export default function CategoryForm({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
}: CategoryFormProps) {
    // Initialise form state from initialData when present
    const [formData, setFormData] = useState<CreateCategoryDto>({
        name: initialData?.name ?? '',
        slug: initialData?.slug ?? '',
        description: initialData?.description ?? '',
        color: initialData?.color ?? '#3B82F6',
        iconUrl: initialData?.iconUrl ?? '',
        isActive: initialData?.isActive ?? true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';
        else if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug))
            newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={e => {
                        const name = e.target.value;
                        const updates: Partial<CreateCategoryDto> = { name };
                        // Auto-generate slug only if we're creating a new category (no initial slug)
                        if (!initialData?.slug) {
                            updates.slug = generateSlug(name);
                        }
                        setFormData({ ...formData, ...updates });
                    }}
                    placeholder="Technology"
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Slug */}
            <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="technology"
                    className={`font-mono ${errors.slug ? 'border-red-500' : ''}`}
                />
                {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug}</p>}
                <p className="text-xs text-gray-500 mt-1">Auto‑generated from name, or customise it</p>
            </div>

            {/* Description */}
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of this category..."
                    rows={3}
                />
            </div>

            {/* Color */}
            <div>
                <Label>Category Color</Label>
                <Input
                    type="color"
                    value={formData.color}
                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                />
            </div>

            {/* Icon URL */}
            <div>
                <Label htmlFor="iconUrl">Icon URL (optional)</Label>
                <Input
                    id="iconUrl"
                    type="url"
                    value={formData.iconUrl}
                    onChange={e => setFormData({ ...formData, iconUrl: e.target.value })}
                    placeholder="https://example.com/icon.svg"
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                    Active (visible to users)
                </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
