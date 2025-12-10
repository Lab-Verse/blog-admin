'use client';

import React from 'react';
import Image from 'next/image';
import type { User } from '@/redux/types/user/users.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserStatusBadge } from '../ui/UserStatusBadge';

interface UserDetailsPageProps {
    user: User;
    onEdit: () => void;
    onDelete: () => void;
    onBack: () => void;
    isLoading?: boolean;
}

export default function UserDetailsPage({
    user,
    onEdit,
    onDelete,
    onBack,
    isLoading = false,
}: UserDetailsPageProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Button variant="outline" onClick={onBack} className="group">
                    <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Users
                </Button>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onEdit}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </Button>
                    <Button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Card */}
                <Card className="lg:col-span-1 border-0 shadow-lg ring-1 ring-gray-200/50">
                    <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={user.name || 'User avatar'}
                                    width={128}
                                    height={128}
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white shadow-lg">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0">
                                <UserStatusBadge status={user.status} className="shadow-sm" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-gray-500 font-medium mt-1">{user.role || 'User'}</p>

                        <div className="mt-6 w-full border-t border-gray-100 pt-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Joined</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Last Active</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <Card className="border-0 shadow-md ring-1 ring-gray-200/50">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="text-lg font-semibold text-gray-800">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {user.email}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {user.phone || 'Not provided'}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900 flex items-start">
                                        <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {user.profile?.address ? (
                                            <span>
                                                {user.profile.address}
                                                <br />
                                                {user.profile.city}, {user.profile.country}
                                            </span>
                                        ) : (
                                            'No address provided'
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Bio Section */}
                    <Card className="border-0 shadow-md ring-1 ring-gray-200/50">
                        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                            <CardTitle className="text-lg font-semibold text-gray-800">About</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-gray-600 leading-relaxed">
                                {user.profile?.bio || 'No bio available for this user.'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
