'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFollowerFiltersProps {
  categoryId: string;
  setCategoryId: (value: string) => void;
  followerId: string;
  setFollowerId: (value: string) => void;
}

export default function CategoryFollowerFilters({
  categoryId,
  setCategoryId,
  followerId,
  setFollowerId,
}: CategoryFollowerFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="categoryId">Category ID</Label>
        <Input
          id="categoryId"
          type="text"
          placeholder="Enter category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="followerId">Follower ID</Label>
        <Input
          id="followerId"
          type="text"
          placeholder="Enter follower ID"
          value={followerId}
          onChange={(e) => setFollowerId(e.target.value)}
        />
      </div>
    </div>
  );
}
