'use client';

import { useState } from 'react';
import { User, UserStatus } from '@/redux/types/user/users.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Trash2, Eye, Mail, Calendar, Shield, Users as UsersIcon, LayoutGrid, List as ListIcon } from 'lucide-react';
import Image from 'next/image';

interface UsersPageComponentProps {
  users: User[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function UsersPageComponent({
  users,
  isLoading,
  onAdd,
  onEdit,
  onView,
  onDelete,
  currentPage,
  onPageChange,
  totalPages,
}: UsersPageComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile?.first_name && user.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.profile?.last_name && user.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: UserStatus) => {
    const styles: Record<UserStatus, string> = {
      [UserStatus.ACTIVE]: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 ring-1 ring-emerald-500/20',
      [UserStatus.INACTIVE]: 'bg-slate-500/10 text-slate-600 border-slate-200 ring-1 ring-slate-500/20',
      [UserStatus.BANNED]: 'bg-rose-500/10 text-rose-600 border-rose-200 ring-1 ring-rose-500/20',
    };
    return styles[status] || styles[UserStatus.INACTIVE];
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-500/10 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
      editor: 'bg-blue-500/10 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
      author: 'bg-emerald-500/10 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
      user: 'bg-slate-500/10 text-slate-700 border-slate-200 ring-1 ring-slate-500/20',
    };
    return styles[role.toLowerCase() as keyof typeof styles] || styles.user;
  };

  const getInitials = (user: User) => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name[0]}${user.profile.last_name[0]}`.toUpperCase();
    }
    if (user.display_name) {
      return user.display_name.slice(0, 2).toUpperCase();
    }
    return user.username?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Users Management
            </h1>
            <p className="text-slate-500">
              Manage user accounts, roles, and permissions.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
            <Button
              onClick={onAdd}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: users.length, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Active', value: users.filter(u => u.status === UserStatus.ACTIVE).length, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Inactive', value: users.filter(u => u.status === UserStatus.INACTIVE).length, icon: Eye, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Banned', value: users.filter(u => u.status === UserStatus.BANNED).length, icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
              className="px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-medium min-w-[160px] cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Status</option>
              <option value={UserStatus.ACTIVE}>Active</option>
              <option value={UserStatus.INACTIVE}>Inactive</option>
              <option value={UserStatus.BANNED}>Banned</option>
            </select>
          </div>
        </div>

        {/* Users Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm animate-pulse h-64">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-100 rounded mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded"></div>
                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <UsersIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1">No users found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => onView(user)}
                className="cursor-pointer"
              >
                <Card
                  className={`border-0 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group ${viewMode === 'list' ? 'flex flex-row items-center p-4' : ''}`}
                >
                  <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between p-0' : ''}`}>
                    <div className={`flex items-center gap-4 ${viewMode === 'list' ? 'w-1/3' : 'mb-6'}`}>
                      {user.profile?.profile_picture ? (
                        <Image
                          src={user.profile?.profile_picture || ''}
                          alt={user.username || 'User'}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                          {getInitials(user)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                          {user.profile?.first_name && user.profile?.last_name ? `${user.profile.first_name} ${user.profile.last_name}` : (user.display_name || user.username)}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                      </div>
                    </div>

                    <div className={`${viewMode === 'list' ? 'flex items-center gap-8' : 'space-y-3 mb-6'}`}>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[180px]">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Joined {new Date(user.created_at || '').toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className={`${viewMode === 'list' ? 'flex items-center gap-4 mx-8' : 'flex gap-2 mb-6'}`}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                      {user.role && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${getRoleBadge(typeof user.role === 'string' ? user.role : 'user')}`}>
                          {typeof user.role === 'string' ? user.role : 'user'}
                        </span>
                      )}
                    </div>

                    <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'pt-4 border-t border-slate-50'}`} onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={() => onView(user)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        View
                      </Button>
                      <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(user)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-slate-600 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                variant={currentPage === page ? "primary" : "outline"}
                className={`w-10 h-10 p-0 rounded-xl transition-all ${currentPage === page
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}