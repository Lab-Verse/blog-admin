'use client';

import React from 'react';
import { Role } from '@/redux/types/role/roles.types';
import { Permission } from '@/redux/types/permission/permissions.types';
import { RolePermission } from '@/redux/types/rolepermission/rolePermissions.types';
import RolePermissionManager from '../ui/RolePermissionManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RolePermissionsPageProps {
    roles: Role[];
    selectedRole: Role | null;
    allPermissions: Permission[];
    rolePermissions: RolePermission[];
    onSelectRole: (role: Role) => void;
    onAttach: (permissionId: string) => Promise<void>;
    onDetach: (rolePermissionId: string) => Promise<void>;
    isLoadingRoles: boolean;
    isLoadingPermissions: boolean;
}

export default function RolePermissionsPage({
    roles,
    selectedRole,
    allPermissions,
    rolePermissions,
    onSelectRole,
    onAttach,
    onDetach,
    isLoadingRoles,
    isLoadingPermissions,
}: RolePermissionsPageProps) {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Role Permissions</h1>
                <p className="text-gray-500 mt-1">Manage permissions assigned to each role.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Roles List Sidebar */}
                <div className="lg:col-span-4 flex flex-col min-h-0">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle>Roles</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-0">
                            {isLoadingRoles ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {roles.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => onSelectRole(role)}
                                            className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors focus:outline-none ${selectedRole?.id === role.id
                                                    ? 'bg-blue-50 border-l-4 border-blue-600'
                                                    : 'border-l-4 border-transparent'
                                                }`}
                                        >
                                            <h3 className={`text-sm font-medium ${selectedRole?.id === role.id ? 'text-blue-900' : 'text-gray-900'
                                                }`}>
                                                {role.name}
                                            </h3>
                                            <p className={`text-xs mt-0.5 ${selectedRole?.id === role.id ? 'text-blue-700' : 'text-gray-500'
                                                }`}>
                                                {role.slug}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions Manager Area */}
                <div className="lg:col-span-8 flex flex-col min-h-0">
                    {selectedRole ? (
                        <RolePermissionManager
                            roleName={selectedRole.name}
                            allPermissions={allPermissions}
                            rolePermissions={rolePermissions}
                            onAttach={onAttach}
                            onDetach={onDetach}
                            isLoading={isLoadingPermissions}
                        />
                    ) : (
                        <Card className="h-full flex items-center justify-center text-center p-8 text-gray-500">
                            <div>
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900">No Role Selected</h3>
                                <p className="mt-1">Select a role from the list to manage its permissions.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
