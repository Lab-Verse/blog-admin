'use client';

import { useState } from 'react';
import CategoriesPageComponent from '@/components/categories/pages/CategoriesPageComponent';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '@/redux/api/category/categoriesApi';
import { Category } from '@/redux/types/category/categories.types';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: categoriesData, isLoading } = useGetCategoriesQuery({ page, limit }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleAdd = () => {
    router.push('/categories/create');
  };

  const handleEdit = (category: Category) => {
    router.push(`/categories/${category.id}/edit`);
  };

  const handleDelete = async (category: Category) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(category.id);
    }
  };

  const totalPages = categoriesData
    ? Math.ceil(categoriesData.total / categoriesData.limit)
    : 1;

  return (
    <CategoriesPageComponent
      categories={categoriesData?.items || []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      currentPage={page}
      onPageChange={setPage}
      totalPages={totalPages}
    />
  );
}