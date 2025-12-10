'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionForm from '../ui/PermissionForm';

interface CreatePermissionPageProps {
    onSubmit: (data: { name: string; slug: string }) => Promise<void>;
    onCancel: () => void;
}

export default function CreatePermissionPage({ onSubmit, onCancel }: CreatePermissionPageProps) {
    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Permission</h1>
                <p className="text-gray-500 mt-1">Add a new permission to the system.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Permission Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PermissionForm
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        submitLabel="Create Permission"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
