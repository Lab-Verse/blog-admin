'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  useGetEMagazineBySlugQuery,
} from '@/redux/api/e-magazine/eMagazineApi';
import { useGetCategoriesQuery } from '@/redux/api/category/categoriesApi';
import { useGetTagsQuery } from '@/redux/api/tags/tagsApi';
import { useUploadWithProgress } from '@/lib/useUploadWithProgress';
import UploadProgressBar from '@/components/common/UploadProgressBar';
import { baseApi } from '@/redux/api/baseApi';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

export default function EditEMagazinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Fetch by ID — the backend findBySlug also works with UUID since we'll
  // add a findOne route; for now, we query by slug or ID
  const { data: magazine, isLoading: isLoadingMag } = useGetEMagazineBySlugQuery(id);
  const dispatch = useDispatch();
  const { upload, progress, status: uploadStatus, error: uploadError, reset: resetUpload, abort: abortUpload } = useUploadWithProgress();
  const isUpdating = uploadStatus === 'uploading' || uploadStatus === 'success';
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: tagsData } = useGetTagsQuery();

  const categories = categoriesData?.items || [];
  const tags = Array.isArray(tagsData) ? tagsData : [];

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueNumber, setIssueNumber] = useState(1);
  const [publishedDate, setPublishedDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [pageCount, setPageCount] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Populate form when data loads
  useEffect(() => {
    if (magazine) {
      setTitle(magazine.title);
      setDescription(magazine.description || '');
      setIssueNumber(magazine.issue_number);
      setPublishedDate(
        magazine.published_date
          ? new Date(magazine.published_date).toISOString().split('T')[0]
          : '',
      );
      setStatus(magazine.status);
      setPageCount(magazine.page_count || '');
      setCategoryId(magazine.category_id || '');
      setSelectedTagIds(magazine.tags?.map((t) => t.id) || []);
      if (magazine.cover_image_url) setCoverPreview(magazine.cover_image_url);
    }
  }, [magazine]);

  const handleCoverChange = (file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) formData.append('description', description.trim());
      formData.append('issue_number', String(issueNumber));
      if (publishedDate) formData.append('published_date', publishedDate);
      if (status) formData.append('status', status);
      if (pageCount) formData.append('page_count', String(pageCount));
      if (categoryId) formData.append('category_id', categoryId);
      selectedTagIds.forEach((tagId) => formData.append('tag_ids[]', tagId));
      if (pdfFile) formData.append('pdf_file', pdfFile);
      if (coverFile) formData.append('cover_image', coverFile);

      await upload(`/e-magazines/${id}`, formData, 'PATCH');
      // Invalidate RTK cache so the list refreshes
      dispatch(baseApi.util.invalidateTags([
        { type: 'EMagazine', id },
        { type: 'EMagazine', id: 'LIST' },
      ]));
      router.push('/e-magazine');
    } catch (error: any) {
      // Error is already shown in the progress bar
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  if (isLoadingMag) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500">Loading magazine...</p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500">Magazine not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit: {magazine.title}
          </h1>
          <p className="text-sm text-gray-500">
            Update issue details or replace the PDF
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Progress */}
        <UploadProgressBar
          progress={progress}
          status={uploadStatus}
          error={uploadError}
          onAbort={abortUpload}
        />

        {/* PDF Upload / Replace */}
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            PDF File
          </h3>
          {pdfFile ? (
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {pdfFile.name} (new)
                </p>
                <p className="text-xs text-gray-500">
                  {(pdfFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Current PDF
                  </p>
                  <a
                    href={magazine.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View current file
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Replace PDF
              </button>
            </div>
          )}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPdfFile(file);
            }}
          />
        </div>

        {/* Cover Image */}
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-gray-600 dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Cover Image
          </h3>
          {coverPreview ? (
            <div className="flex items-center gap-4">
              <img
                src={coverPreview}
                alt="Cover"
                className="h-32 w-24 rounded object-cover"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 py-4"
            >
              <ImageIcon className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-500">
                Click to upload cover image
              </span>
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCoverChange(file);
            }}
          />
        </div>

        {/* Title + Issue Number */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Issue #
            </label>
            <input
              type="number"
              value={issueNumber}
              onChange={(e) => setIssueNumber(Number(e.target.value))}
              min={1}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Published Date, Status, Page Count */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Published Date
            </label>
            <input
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Page Count
            </label>
            <input
              type="number"
              value={pageCount}
              onChange={(e) =>
                setPageCount(e.target.value ? Number(e.target.value) : '')
              }
              min={1}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">No category</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploadStatus === 'uploading'
              ? 'Uploading...'
              : uploadStatus === 'success'
                ? 'Processing...'
                : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
