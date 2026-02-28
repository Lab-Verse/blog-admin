'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreateCategoryDto, UpdateCategoryDto, Category } from '@/redux/types/category/categories.types';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface CategoryFormProps {
    /** Optional data for editing an existing category */
    initialData?: UpdateCategoryDto & { image_url?: string | null };
    /** List of categories for parent selection */
    categories?: Category[];
    /** Current category ID (to exclude from parent selection) */
    currentCategoryId?: string;
    /** Called with the form data when the user submits */
    onSubmit: (data: CreateCategoryDto, image?: File) => Promise<void>;
    /** Called when the user clicks the Cancel button */
    onCancel: () => void;
    /** Loading state while the mutation is in progress */
    isLoading?: boolean;
}

export default function CategoryForm({
    initialData,
    categories = [],
    currentCategoryId,
    onSubmit,
    onCancel,
    isLoading = false,
}: CategoryFormProps) {
    // Initialise form state from initialData when present
    const [formData, setFormData] = useState<CreateCategoryDto>({
        name: initialData?.name ?? '',
        slug: initialData?.slug ?? '',
        parent_id: initialData?.parent_id ?? null,
        is_active: initialData?.is_active ?? true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || '');

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
            await onSubmit(formData, imageFile || undefined);
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
    };

    // Get available parent categories (exclude current category and its children)
    const availableParents = categories.filter(c => c.id !== currentCategoryId);

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

            {/* Parent Category */}
            <div>
                <Label htmlFor="parent_id">Parent Category</Label>
                <select
                    id="parent_id"
                    value={formData.parent_id || ''}
                    onChange={e => setFormData({ ...formData, parent_id: e.target.value || null })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">None (Top-level Category)</option>
                    {availableParents.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select a parent to create a subcategory</p>
            </div>

            {/* Category Image */}
            <div>
                <Label>Category Image</Label>
                <div className="mt-2 flex items-center gap-4">
                    {imagePreview ? (
                        <div className="relative">
                            <Image
                                src={imagePreview}
                                alt="Category"
                                width={120}
                                height={80}
                                className="rounded-lg object-cover border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-30 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                            <Upload size={24} />
                        </div>
                    )}
                    <div>
                        <input
                            type="file"
                            id="category_image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="category_image"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 800x400px, Max 5MB</p>
                    </div>
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Label htmlFor="is_active" className="cursor-pointer">
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
