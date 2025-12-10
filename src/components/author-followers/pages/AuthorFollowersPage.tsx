'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define AuthorFollower type if not imported
interface AuthorFollower {
    id: string;
    author?: {
        name?: string;
        email?: string;
        avatarUrl?: string;
    };
    follower?: {
        name?: string;
        email?: string;
        avatarUrl?: string;
    };
    createdAt?: string;
}

interface AuthorFollowersPageProps {
    followers: AuthorFollower[];
    isLoading: boolean;
    total: number;
    page: number;
    limit: number;
    onUnfollow: (id: string) => void;
    onPageChange: (page: number) => void;
}

export default function AuthorFollowersPage({
    followers,
    isLoading,
    total,
    page,
    limit,
    onUnfollow,
    onPageChange,
}: AuthorFollowersPageProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFollowers = followers.filter((follow) => {
        const searchLower = searchTerm.toLowerCase();
        const authorName = follow.author?.name?.toLowerCase() || '';
        const followerName = follow.follower?.name?.toLowerCase() || '';
        const authorEmail = follow.author?.email?.toLowerCase() || '';
        const followerEmail = follow.follower?.email?.toLowerCase() || '';

        const matchesSearch =
            authorName.includes(searchLower) ||
            followerName.includes(searchLower) ||
            authorEmail.includes(searchLower) ||
            followerEmail.includes(searchLower);

        return matchesSearch;
    });

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Author Followers</h1>
                    <p className="text-gray-500 mt-1">View and manage follower relationships.</p>
                </div>
            </div>

            <Card className="border-0 shadow-xl ring-1 ring-gray-200/50">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-lg font-semibold text-gray-800">
                            All Followers ({total})
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <Input
                                    placeholder="Search followers or authors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredFollowers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {searchTerm ? `No followers found matching "${searchTerm}"` : 'No follower relationships yet.'}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Follower
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Following
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Since
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredFollowers.map((follow) => (
                                            <tr key={follow.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="shrink-0 h-10 w-10">
                                                            {follow.follower?.avatarUrl ? (
                                                                <Image
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={follow.follower.avatarUrl}
                                                                    alt={follow.follower.name || 'Follower Avatar'}
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <span className="text-blue-600 font-medium text-sm">
                                                                        {follow.follower?.name?.charAt(0).toUpperCase() || 'U'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {follow.follower?.name || 'Unknown User'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {follow.follower?.email || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="shrink-0 h-10 w-10">
                                                            {follow.author?.avatarUrl ? (
                                                                <Image
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={follow.author.avatarUrl}
                                                                    alt={follow.author?.name || 'Author Avatar'}
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                                    <span className="text-purple-600 font-medium text-sm">
                                                                        {follow.author?.name?.charAt(0).toUpperCase() || 'A'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {follow.author?.name || 'Unknown Author'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {follow.author?.email || ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {follow.createdAt ? new Date(follow.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to remove this follower relationship?')) {
                                                                onUnfollow(follow.id);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Unfollow"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing page {page} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(page - 1)}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
