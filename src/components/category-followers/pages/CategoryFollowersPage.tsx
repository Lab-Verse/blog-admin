'use client';

import { useState } from 'react';
import { useGetCategoryFollowersQuery } from '@/redux/api/categoryfollower/categoryFollowersApi';
import { useAppSelector } from '@/redux/hooks';
import {
  selectCategoryFollowersLoading,
  selectCategoryFollowersError,
} from '@/redux/selectors/categoryfollower/categoryFollowersSelectors';
import CategoryFollowerTable from '../ui/CategoryFollowerTable';
import CategoryFollowerFilters from '../ui/CategoryFollowerFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export default function CategoryFollowersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [categoryId, setCategoryId] = useState<string>('');
  const [followerId, setFollowerId] = useState<string>('');

  const query = {
    page,
    limit,
    ...(categoryId && { categoryId }),
    ...(followerId && { followerId }),
  };

  const { data, isFetching, refetch } = useGetCategoryFollowersQuery(query);
  const isLoading = useAppSelector(selectCategoryFollowersLoading);
  const error = useAppSelector(selectCategoryFollowersError);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Category Followers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view category followers across the platform.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isFetching}
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryFollowerFilters
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            followerId={followerId}
            setFollowerId={setFollowerId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Followers List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {isLoading && !data ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading followers...</span>
            </div>
          ) : data ? (
            <>
              <CategoryFollowerTable followers={data.items} />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {data.items.length} of {data.total} followers
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1 || isFetching}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {Math.ceil(data.total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(data.total / limit) || isFetching}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No followers found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
