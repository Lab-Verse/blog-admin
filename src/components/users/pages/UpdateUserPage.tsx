'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateUserDto, User, UserStatus, CreateUserProfileDto } from '@/redux/types/user/users.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface UpdateUserPageProps {
    user: User | null;
    onSubmit: (data: UpdateUserDto, profileData?: CreateUserProfileDto, profileImage?: File) => Promise<void>;
    isLoading: boolean;
}

export default function UpdateUserPage({ user, onSubmit, isLoading }: UpdateUserPageProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<UpdateUserDto>({
        username: '',
        email: '',
        role: '',
        status: UserStatus.ACTIVE,
    });
    const [profileData, setProfileData] = useState<CreateUserProfileDto>({
        first_name: '',
        last_name: '',
        bio: '',
        phone: '',
        location: '',
        website_url: '',
        company: '',
        job_title: '',
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                display_name: user.display_name,
                role: user.role,
                status: user.status,
            });
            
            if (user.profile) {
                setProfileData({
                    first_name: user.profile.first_name || '',
                    last_name: user.profile.last_name || '',
                    bio: user.profile.bio || '',
                    phone: user.profile.phone || '',
                    location: user.profile.location || '',
                    website_url: user.profile.website_url || '',
                    company: user.profile.company || '',
                    job_title: user.profile.job_title || '',
                });
                
                if (user.profile.profile_picture) {
                    setImagePreview(user.profile.profile_picture);
                }
            }
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage(null);
        setImagePreview('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData, profileData, profileImage || undefined);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                                    Username *
                                </label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="display_name" className="text-sm font-medium text-gray-700">
                                    Display Name
                                </label>
                                <Input
                                    id="display_name"
                                    name="display_name"
                                    value={formData.display_name || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
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
                                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value={UserStatus.ACTIVE}>Active</option>
                                    <option value={UserStatus.INACTIVE}>Inactive</option>
                                    <option value={UserStatus.BANNED}>Banned</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Picture */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            {imagePreview ? (
                                <div className="relative">
                                    <Image
                                        src={imagePreview}
                                        alt="Profile"
                                        width={120}
                                        height={120}
                                        className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <Upload size={40} />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="profile_picture"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="profile_picture"
                                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Photo
                                </label>
                                <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={profileData.first_name}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={profileData.last_name}
                                    onChange={handleProfileChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="location" className="text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={profileData.location}
                                    onChange={handleProfileChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="company" className="text-sm font-medium text-gray-700">
                                    Company
                                </label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={profileData.company}
                                    onChange={handleProfileChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="job_title" className="text-sm font-medium text-gray-700">
                                    Job Title
                                </label>
                                <Input
                                    id="job_title"
                                    name="job_title"
                                    value={profileData.job_title}
                                    onChange={handleProfileChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="website_url" className="text-sm font-medium text-gray-700">
                                Website URL
                            </label>
                            <Input
                                id="website_url"
                                name="website_url"
                                type="url"
                                value={profileData.website_url}
                                onChange={handleProfileChange}
                                placeholder="https://"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleProfileChange}
                                rows={4}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
