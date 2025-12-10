'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoleForm from '../ui/RoleForm';

interface CreateRolePageProps {
    onSubmit: (data: { name: string; slug: string; description: string }) => Promise<void>;
    onCancel: () => void;
}

export default function CreateRolePage({ onSubmit, onCancel }: CreateRolePageProps) {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Role</h1>
                <p className="text-gray-500 mt-1">Add a new role to the system.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Role Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <RoleForm
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Create Role"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
