'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function CrudStatus() {
  const operations = [
    { name: 'Users', create: true, read: true, update: true, delete: false },
    { name: 'Posts', create: true, read: true, update: true, delete: true },
    { name: 'Categories', create: true, read: true, update: true, delete: true },
    { name: 'Tags', create: true, read: true, update: true, delete: true },
    { name: 'Comments', create: true, read: true, update: true, delete: true },
    { name: 'Media', create: true, read: true, update: true, delete: true }
  ];

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };


  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          CRUD Operations Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {operations.map((op) => (
            <div key={op.name} className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">{op.name}</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Create</span>
                  {getStatusIcon(op.create)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Read</span>
                  {getStatusIcon(op.read)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Update</span>
                  {getStatusIcon(op.update)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete</span>
                  {getStatusIcon(op.delete)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}