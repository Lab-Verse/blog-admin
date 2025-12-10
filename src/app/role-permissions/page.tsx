'use client';

import React, { useState, useEffect } from 'react';
import RolePermissionsPage from '@/components/role-permissions/pages/RolePermissionsPage';
import { useGetRolesQuery } from '@/redux/api/role/roles.api';
import { useGetPermissionsQuery } from '@/redux/api/permission/permissions.api';
import {
    useGetRolePermissionsByRoleQuery,
    useAttachPermissionToRoleMutation,
    useDetachRolePermissionMutation,
} from '@/redux/api/rolepermission/rolePermissions.api';
import { Role } from '@/redux/types/role/roles.types';

export default function Page() {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    // Fetch Roles
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery();

    // Fetch All Permissions
    const { data: allPermissions, isLoading: isLoadingAllPermissions } = useGetPermissionsQuery();

    // Fetch Role Permissions (only if role selected)
    const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useGetRolePermissionsByRoleQuery(
        selectedRole?.id || '',
        { skip: !selectedRole }
    );

    // Mutations
    const [attachPermission] = useAttachPermissionToRoleMutation();
    const [detachPermission] = useDetachRolePermissionMutation();

    // Auto-select first role if none selected and roles loaded
    useEffect(() => {
        if (!selectedRole && roles && roles.length > 0) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);

    const handleAttach = async (permissionId: string) => {
        if (!selectedRole) return;
        try {
            await attachPermission({
                role_id: selectedRole.id,
                permission_id: permissionId,
            }).unwrap();
        } catch (error) {
            console.error('Failed to attach permission:', error);
            // Ideally show toast notification
        }
    };

    const handleDetach = async (rolePermissionId: string) => {
        if (!selectedRole) return;
        try {
            await detachPermission({
                id: rolePermissionId,
                roleId: selectedRole.id,
            }).unwrap();
        } catch (error) {
            console.error('Failed to detach permission:', error);
            // Ideally show toast notification
        }
    };

    return (
        <RolePermissionsPage
            roles={roles || []}
            selectedRole={selectedRole}
            allPermissions={allPermissions || []}
            rolePermissions={rolePermissions || []}
            onSelectRole={setSelectedRole}
            onAttach={handleAttach}
            onDetach={handleDetach}
            isLoadingRoles={isLoadingRoles}
            isLoadingPermissions={isLoadingAllPermissions || (!!selectedRole && isLoadingRolePermissions)}
        />
    );
}
