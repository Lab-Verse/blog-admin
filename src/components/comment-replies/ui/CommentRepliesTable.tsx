'use client';

import { CommentReply } from '@/redux/types/commentreplies/commentReplies.types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CommentRepliesTableProps {
  replies: CommentReply[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function CommentRepliesTable({
  replies,
  onDelete,
  isDeleting,
}: CommentRepliesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Comment ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Author</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Content</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Created At</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {replies.map((reply) => (
            <tr key={reply.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm">{reply.id}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{reply.commentId}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                {reply.author?.name || reply.authorId}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 max-w-xs truncate">
                {reply.content}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reply.status === 'visible'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : reply.status === 'hidden'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}
                >
                  {reply.status}
                </span>
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                {reply.createdAt
                  ? new Date(reply.createdAt).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(reply.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}