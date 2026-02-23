'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostStatus } from '@/redux/types/post/posts.types';
import { Category } from '@/redux/types/category/categories.types';
import { Tag } from '@/redux/types/tags/types';
import { Media, MediaType } from '@/redux/types/media/media.types';
import { useUploadMediaMutation } from '@/redux/api/media/mediaApi';

interface InlineMediaPlacement {
    id: string;
    mediaId: string;
    afterBlockIndex: number;
}

interface PostFormData {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    description: string;
    category_id: string;
    status: PostStatus;
    featured_image?: File | string;
    tag_ids?: string[];
    media_ids?: string[];
}

interface PostFormProps {
    initialData?: PostFormData;
    categories: Category[];
    tags: Tag[];
    mediaList: Media[];
    onSubmit: (data: PostFormData) => Promise<void>;
    isLoading?: boolean;
    submitLabel?: string;
    onCancel: () => void;
}

export default function PostForm({
    initialData,
    categories,
    tags,
    mediaList,
    onSubmit,
    isLoading = false,
    submitLabel = 'Save',
    onCancel,
}: PostFormProps) {
    const [formData, setFormData] = useState<PostFormData>(
        initialData || {
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            description: '',
            category_id: '',
            status: PostStatus.DRAFT,
            featured_image: '',
            tag_ids: [],
            media_ids: [],
        }
    );
    const [imagePreview, setImagePreview] = useState<string>('');
    const [librarySearch, setLibrarySearch] = useState('');
    const [libraryTypeFilter, setLibraryTypeFilter] = useState<'all' | MediaType>('all');
    const [mediaLibrary, setMediaLibrary] = useState<Media[]>(mediaList);
    const [inlineMediaPlacements, setInlineMediaPlacements] = useState<InlineMediaPlacement[]>([]);
    const [pendingInlineByBlock, setPendingInlineByBlock] = useState<Record<number, string>>({});
    const [uploadMedia, { isLoading: isUploadingMedia }] = useUploadMediaMutation();

    useEffect(() => {
        console.log('MediaList received:', mediaList);
        setMediaLibrary(mediaList);
    }, [mediaList]);

    const filteredMedia = useMemo(() => {
        return mediaLibrary.filter((item) => {
            const url = item.url || (item as any).file_url || '';
            const matchesSearch =
                !librarySearch ||
                item.filename.toLowerCase().includes(librarySearch.toLowerCase()) ||
                url.toLowerCase().includes(librarySearch.toLowerCase()) ||
                (item.title || '').toLowerCase().includes(librarySearch.toLowerCase());
            const matchesType = libraryTypeFilter === 'all' || item.type === libraryTypeFilter;
            return matchesSearch && matchesType;
        });
    }, [mediaLibrary, librarySearch, libraryTypeFilter]);

    const selectedMediaSet = useMemo(() => new Set(formData.media_ids || []), [formData.media_ids]);

    const contentBlocks = useMemo(() => {
        return formData.content
            .split(/\n{2,}/)
            .map((block) => block.trim())
            .filter(Boolean);
    }, [formData.content]);

    const getMediaById = (mediaId: string) => mediaLibrary.find((item) => item.id === mediaId);

    const resolveMediaUrl = (media: Media) => {
        return media.url || (media as any).file_url || (media as any).path || '';
    };

    const toMarkdownForMedia = (media: Media) => {
        const url = resolveMediaUrl(media);
        if (!url) {
            return '';
        }
        if (media.type === 'image') {
            return `![${media.altText || media.filename}](${url})`;
        }
        return `[${media.filename}](${url})`;
    };

    const buildContentWithInlineMedia = () => {
        if (contentBlocks.length === 0 || inlineMediaPlacements.length === 0) {
            return formData.content;
        }

        const groupedPlacements = inlineMediaPlacements.reduce<Record<number, InlineMediaPlacement[]>>((acc, placement) => {
            if (!acc[placement.afterBlockIndex]) {
                acc[placement.afterBlockIndex] = [];
            }
            acc[placement.afterBlockIndex].push(placement);
            return acc;
        }, {});

        const rebuiltParts: string[] = [];
        contentBlocks.forEach((block, blockIndex) => {
            rebuiltParts.push(block);

            const inserts = groupedPlacements[blockIndex] || [];
            inserts.forEach((placement) => {
                const media = getMediaById(placement.mediaId);
                if (media) {
                    const markdown = toMarkdownForMedia(media);
                    if (markdown) {
                        rebuiltParts.push(markdown);
                    }
                }
            });
        });

        return rebuiltParts.join('\n\n');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, featured_image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleMediaSelection = (mediaId: string) => {
        setFormData((prev) => {
            const existing = prev.media_ids || [];
            const next = existing.includes(mediaId)
                ? existing.filter((id) => id !== mediaId)
                : [...existing, mediaId];

            return { ...prev, media_ids: next };
        });
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setFormData((prev) => ({ ...prev, tag_ids: selectedOptions }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const inlineMediaIds = inlineMediaPlacements.map((item) => item.mediaId);
        const mergedMediaIds = Array.from(
            new Set(
                [...(formData.media_ids || []), ...inlineMediaIds]
                    .map((id) => String(id || '').trim())
                    .filter(Boolean)
            )
        );

        await onSubmit({
            ...formData,
            content: buildContentWithInlineMedia(),
            media_ids: mergedMediaIds,
        });
    };

    const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const uploaded: Media[] = [];

        for (const file of Array.from(files)) {
            try {
                const result = await uploadMedia({ file }).unwrap();
                uploaded.push(result);
            } catch (error) {
                console.error('Failed to upload media file:', error);
            }
        }

        if (uploaded.length > 0) {
            setMediaLibrary((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));
                const next = [...prev];
                uploaded.forEach((item) => {
                    if (!existingIds.has(item.id)) {
                        next.unshift(item);
                    }
                });
                return next;
            });

            setFormData((prev) => ({
                ...prev,
                media_ids: Array.from(
                    new Set(
                        [...(prev.media_ids || []), ...uploaded.map((item) => item.id)]
                            .map((id) => String(id || '').trim())
                            .filter(Boolean)
                    )
                ),
            }));
        }

        e.target.value = '';
    };

    const moveSelectedMedia = (index: number, direction: 'up' | 'down') => {
        setFormData((prev) => {
            const ids = [...(prev.media_ids || [])];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= ids.length) {
                return prev;
            }

            [ids[index], ids[targetIndex]] = [ids[targetIndex], ids[index]];
            return { ...prev, media_ids: ids };
        });
    };

    const removeSelectedMedia = (mediaId: string) => {
        setFormData((prev) => ({
            ...prev,
            media_ids: (prev.media_ids || []).filter((id) => id !== mediaId),
        }));
        setInlineMediaPlacements((prev) => prev.filter((item) => item.mediaId !== mediaId));
    };

    const addInlinePlacement = (blockIndex: number) => {
        const mediaId = pendingInlineByBlock[blockIndex];
        if (!mediaId) return;

        setInlineMediaPlacements((prev) => [
            ...prev,
            {
                id: `${blockIndex}-${mediaId}-${Date.now()}`,
                mediaId,
                afterBlockIndex: blockIndex,
            },
        ]);

        setPendingInlineByBlock((prev) => ({ ...prev, [blockIndex]: '' }));
    };

    const moveInlinePlacement = (index: number, direction: 'up' | 'down') => {
        setInlineMediaPlacements((prev) => {
            const items = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            if (targetIndex < 0 || targetIndex >= items.length) {
                return prev;
            }
            [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
            return items;
        });
    };

    const removeInlinePlacement = (placementId: string) => {
        setInlineMediaPlacements((prev) => prev.filter((item) => item.id !== placementId));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Post Title"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                            Slug
                        </label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            placeholder="post-slug"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category_id" className="text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value={PostStatus.DRAFT}>Draft</option>
                            <option value={PostStatus.PUBLISHED}>Published</option>
                            <option value={PostStatus.ARCHIVED}>Archived</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <select
                            id="tags"
                            multiple
                            value={formData.tag_ids}
                            onChange={handleTagChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            size={5}
                        >
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="featured_image" className="text-sm font-medium text-gray-700">
                            Featured Image
                        </label>
                        <input
                            id="featured_image"
                            name="featured_image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {imagePreview && (
                            <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto rounded-md" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="excerpt" className="text-sm font-medium text-gray-700">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Brief summary of the post..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="SEO description..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Media Library</label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                        placeholder="Search media by filename, title, URL"
                        value={librarySearch}
                        onChange={(e) => setLibrarySearch(e.target.value)}
                        className="md:col-span-2"
                    />
                    <select
                        value={libraryTypeFilter}
                        onChange={(e) => setLibraryTypeFilter(e.target.value as 'all' | MediaType)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="all">All types</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                        <option value="document">Document</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="media-upload" className="text-sm font-medium text-gray-700">
                        Upload from PC
                    </label>
                    <input
                        id="media-upload"
                        type="file"
                        multiple
                        onChange={handleUploadMedia}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {isUploadingMedia && <p className="text-xs text-blue-600">Uploading media...</p>}
                </div>

                <div className="border border-gray-200 rounded-md max-h-72 overflow-y-auto">
                    {filteredMedia.length === 0 ? (
                        <p className="p-3 text-sm text-gray-500">No media found for current filters.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredMedia.map((media) => (
                                <label
                                    key={media.id}
                                    className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={selectedMediaSet.has(media.id)}
                                            onChange={() => toggleMediaSelection(media.id)}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {media.filename}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{media.url || (media as any).file_url}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs uppercase text-gray-500">{media.type}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected media for this post</p>
                    {(formData.media_ids || []).length === 0 ? (
                        <p className="text-sm text-gray-500">No media selected yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {(formData.media_ids || []).map((mediaId, index) => {
                                const media = getMediaById(mediaId);
                                console.log('Media for ID', mediaId, ':', media);
                                if (!media) return null;

                                return (
                                    <div
                                        key={mediaId}
                                        className="flex items-center justify-between gap-3 border border-gray-200 rounded-md p-2"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={media.url || (media as any).file_url}
                                                alt={media.filename}
                                                className="h-12 w-12 object-cover rounded-md bg-gray-100"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{media.filename}</p>
                                                <p className="text-xs text-gray-500">{media.type}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => moveSelectedMedia(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                Up
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => moveSelectedMedia(index, 'down')}
                                                disabled={index === (formData.media_ids || []).length - 1}
                                            >
                                                Down
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => removeSelectedMedia(mediaId)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                    placeholder="# Markdown content goes here..."
                />
            </div>

            <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Inline media insertion (after content blocks)</p>
                {contentBlocks.length === 0 ? (
                    <p className="text-sm text-gray-500">Write content first to create insert points after each block.</p>
                ) : (
                    <div className="space-y-3">
                        {contentBlocks.map((block, blockIndex) => (
                            <div key={`${blockIndex}-${block.slice(0, 20)}`} className="border border-gray-200 rounded-md p-3">
                                <p className="text-xs text-gray-500 mb-2">Block {blockIndex + 1}</p>
                                <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">{block}</p>

                                <div className="mt-3 flex items-center gap-2">
                                    <select
                                        value={pendingInlineByBlock[blockIndex] || ''}
                                        onChange={(e) =>
                                            setPendingInlineByBlock((prev) => ({
                                                ...prev,
                                                [blockIndex]: e.target.value,
                                            }))
                                        }
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select media to insert here</option>
                                        {(formData.media_ids || []).map((mediaId) => {
                                            const media = getMediaById(mediaId);
                                            return media ? (
                                                <option key={mediaId} value={mediaId}>
                                                    {media.filename}
                                                </option>
                                            ) : null;
                                        })}
                                    </select>
                                    <Button type="button" variant="outline" onClick={() => addInlinePlacement(blockIndex)}>
                                        Insert
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Inline placement order</p>
                    {inlineMediaPlacements.length === 0 ? (
                        <p className="text-sm text-gray-500">No inline media inserted yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {inlineMediaPlacements.map((placement, index) => {
                                const media = getMediaById(placement.mediaId);
                                if (!media) return null;

                                return (
                                    <div
                                        key={placement.id}
                                        className="flex items-center justify-between gap-3 border border-gray-200 rounded-md p-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                {media.filename}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                After block {placement.afterBlockIndex + 1}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => moveInlinePlacement(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                Up
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => moveInlinePlacement(index, 'down')}
                                                disabled={index === inlineMediaPlacements.length - 1}
                                            >
                                                Down
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => removeInlinePlacement(placement.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
