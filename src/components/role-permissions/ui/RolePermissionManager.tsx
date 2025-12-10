'use client';

import React, { useState } from 'react';
import { Permission } from '@/redux/types/permission/permissions.types';
import { RolePermission } from '@/redux/types/rolepermission/rolePermissions.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RolePermissionManagerProps {
    roleName: string;
    allPermissions: Permission[];
    rolePermissions: RolePermission[];
    onAttach: (permissionId: string) => Promise<void>;
    onDetach: (rolePermissionId: string) => Promise<void>;
    isLoading?: boolean;
}

export default function RolePermissionManager({
    roleName,
    allPermissions,
    rolePermissions,
    onAttach,
    onDetach,
    isLoading = false,
}: RolePermissionManagerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filteredPermissions = allPermissions.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggle = async (permission: Permission) => {
        if (processingId) return;
        setProcessingId(permission.id);

        try {
            const existingAssignment = rolePermissions.find(
                (rp) => rp.permission_id === permission.id
            );

            if (existingAssignment) {
                await onDetach(existingAssignment.id);
            } else {
                await onAttach(permission.id);
            }
        } catch (error) {
            console.error('Failed to toggle permission:', error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>Permissions for {roleName}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            Assign permissions to this role.
                        </p>
                    </div>
                    <div className="w-full sm:w-64">
                        <Input
                            placeholder="Search permissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredPermissions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No permissions found matching &quot;{searchTerm}&quot;.
                            </div>
                        ) : (
                            filteredPermissions.map((permission) => {
                                const isAssigned = rolePermissions.some(
                                    (rp) => rp.permission_id === permission.id
                                );
                                const isProcessing = processingId === permission.id;

                                return (
                                    <div
                                        key={permission.id}
                                        className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${isAssigned ? 'bg-blue-50/30' : ''
                                            }`}
                                    >
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {permission.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                                {permission.slug}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleToggle(permission)}
                                                disabled={isProcessing}
                                                className={`
                          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${isAssigned ? 'bg-blue-600' : 'bg-gray-200'}
                          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                                                role="switch"
                                                aria-checked={isAssigned}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${isAssigned ? 'translate-x-5' : 'translate-x-0'}
                          `}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
