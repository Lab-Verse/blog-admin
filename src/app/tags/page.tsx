'use client';

import TagsPageComponent from '@/components/tags/pages/TagsPageComponent';
import { useGetTagsQuery, useDeleteTagMutation } from '@/redux/api/tags/tagsApi';
import { Tag } from '@/redux/types/tags/types';
import { useRouter } from 'next/navigation';

export default function TagsPage() {
  const router = useRouter();
  const { data: tags, isLoading } = useGetTagsQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const [deleteTag] = useDeleteTagMutation();

  const handleAdd = () => {
    router.push('/tags/create');
  };

  const handleEdit = (tag: Tag) => {
    router.push(`/tags/${tag.id}/edit`);
  };

  const handleDelete = async (tag: Tag) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      await deleteTag(tag.id);
    }
  };

  return (
    <TagsPageComponent
      tags={tags || []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}