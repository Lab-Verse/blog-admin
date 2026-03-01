'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetLeadershipMembersQuery,
  useDeleteLeadershipMemberMutation,
  useReorderLeadershipMembersMutation,
} from '@/redux/api/leadership/leadershipApi';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
  ExternalLink,
} from 'lucide-react';

export default function LeadershipPage() {
  const router = useRouter();
  const { data: members = [], isLoading } = useGetLeadershipMembersQuery();
  const [deleteMember] = useDeleteLeadershipMemberMutation();
  const [reorder] = useReorderLeadershipMembersMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteMember(id).unwrap();
    } catch {
      alert('Failed to delete member');
    }
    setDeletingId(null);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const ids = members.map((m) => m.id);
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[index], ids[swapIdx]] = [ids[swapIdx], ids[index]];
    try {
      await reorder(ids).unwrap();
    } catch {
      alert('Failed to reorder');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leadership Team
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage leadership team members displayed on the website
          </p>
        </div>
        <button
          onClick={() => router.push('/leadership/create')}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      {/* Members list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 dark:border-gray-600">
          <User className="mb-3 h-12 w-12 text-gray-400" />
          <p className="text-gray-500">No leadership members yet</p>
          <button
            onClick={() => router.push('/leadership/create')}
            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
          >
            Add the first member
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                member.is_active
                  ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  : 'border-gray-200 bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-800/50'
              }`}
            >
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === members.length - 1}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-gray-700"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Photo */}
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-400">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  {!member.is_active && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Inactive
                    </span>
                  )}
                  {member.user && (
                    <span className="text-xs text-blue-500">
                      @{member.user.username}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{member.designation}</p>
                {member.bio && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Order */}
              <span className="shrink-0 text-xs text-gray-400">
                #{member.display_order}
              </span>

              {/* Social indicators */}
              <div className="hidden shrink-0 items-center gap-1 sm:flex">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() =>
                    router.push(`/leadership/${member.id}/edit`)
                  }
                  className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  disabled={deletingId === member.id}
                  className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-gray-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
