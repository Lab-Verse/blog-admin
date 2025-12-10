'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Tag, Plus, Edit, Trash2, Search } from 'lucide-react';

const tags = [
  { id: 1, name: 'React', slug: 'react', postsCount: 25, color: 'bg-blue-100 text-blue-800' },
  { id: 2, name: 'JavaScript', slug: 'javascript', postsCount: 18, color: 'bg-yellow-100 text-yellow-800' },
  { id: 3, name: 'Next.js', slug: 'nextjs', postsCount: 12, color: 'bg-gray-100 text-gray-800' },
  { id: 4, name: 'Tutorial', slug: 'tutorial', postsCount: 8, color: 'bg-green-100 text-green-800' },
  { id: 5, name: 'Web Development', slug: 'web-development', postsCount: 15, color: 'bg-purple-100 text-purple-800' },
];

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="text-gray-600 mt-2">Manage your blog tags</p>
          </div>
          <button
            // onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTags.map((tag) => (
            <Card key={tag.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>
                    <Tag className="inline h-4 w-4 mr-1" />
                    {tag.name}
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Slug:</span> {tag.slug}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Posts:</span> {tag.postsCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first tag.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  // onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
