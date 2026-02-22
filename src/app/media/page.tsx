'use client';

import MediaPageComponent from '@/components/media/pages/MediaPageComponent';
import { useGetMediaQuery, useUploadMediaMutation, useDeleteMediaMutation } from '@/redux/api/media/mediaApi';
import { toast } from 'sonner'; // Assuming sonner is used, or alert fallback

export default function MediaPage() {
  const { data, isLoading } = useGetMediaQuery(undefined, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const mediaItems = Array.isArray(data) ? data : data?.items || [];

  const [uploadMedia] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const handleUpload = async (file: File) => {
    try {
      await uploadMedia({ file }).unwrap();
      // toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      // toast.error('Upload failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteMedia(id);
    }
  };

  return (
    <MediaPageComponent
      media={mediaItems}
      isLoading={isLoading}
      onUpload={handleUpload}
      onDelete={handleDelete}
    />
  );
}