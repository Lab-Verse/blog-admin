'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleForm from '../ui/RoleForm';
import { Role } from '@/redux/types/role/roles.types';

interface EditRolePageProps {
    role: Role;
    onSubmit: (data: { name: string; slug: string; description: string }) => Promise<void>;
    onCancel: () => void;
}

export default function EditRolePage({ role, onSubmit, onCancel }: EditRolePageProps) {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
                <p className="text-gray-500 mt-1">Update role details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoleForm
                        initialData={{
                            name: role.name,
                            slug: role.slug,
                            description: role.description || '',
                        }}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Update Role"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
