'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionForm from '../ui/PermissionForm';
import { Permission } from '@/redux/types/permission/permissions.types';

interface EditPermissionPageProps {
    permission: Permission;
    onSubmit: (data: { name: string; slug: string }) => Promise<void>;
    onCancel: () => void;
}

export default function EditPermissionPage({ permission, onSubmit, onCancel }: EditPermissionPageProps) {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Edit Permission</h1>
                <p className="text-gray-500 mt-1">Update permission details.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permission Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PermissionForm
                        initialData={{
                            name: permission.name,
                            slug: permission.slug,
                        }}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Update Permission"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
