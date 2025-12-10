'use client';

import { CategoryFollower } from '@/redux/types/categoryfollower/categoryFollowers.types';

interface CategoryFollowerTableProps {
  followers: CategoryFollower[];
}

export default function CategoryFollowerTable({
  followers,
}: CategoryFollowerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Category ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Follower ID</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Category Name</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Follower Name</th>
            <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {followers.map((follower) => (
            <tr key={follower.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 font-mono text-sm">{follower.id}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{follower.categoryId}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{follower.followerId}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{follower.categoryName || 'N/A'}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">{follower.followerName || 'N/A'}</td>
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                {follower.createdAt
                  ? new Date(follower.createdAt).toLocaleDateString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
