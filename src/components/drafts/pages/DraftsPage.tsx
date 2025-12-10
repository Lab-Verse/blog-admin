'use client';

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetDraftsQuery,
    useCreateDraftMutation,
    useUpdateDraftMutation,
    useDeleteDraftMutation,
} from '@/redux/api/draft/draftsApi';
import {
    selectDraftsList,
    selectDraftsTotal,
    selectDraftsLoading,
    selectDraftsError,
} from '@/redux/selectors/draft/draftsSelectors';
import { Draft, DraftStatus, CreateDraftDto, UpdateDraftDto } from '@/redux/types/draft/drafts.types';
import { DraftsHeader } from '../DraftsHeader';
import { DraftsGrid } from '../DraftsGrid';
import { EmptyDraftsState } from '../EmptyDraftsState';
import { DraftsLoadingSkeleton } from '../DraftsLoadingSkeleton';
import { DraftDetailModal } from '../DraftDetailModal';
import { DraftFormModal } from '../DraftFormModal';
import { PaginationControls } from '../PaginationControls';
import { AlertCircle } from 'lucide-react';

export const DraftsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<DraftStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [draftToEdit, setDraftToEdit] = useState<Draft | null>(null);

    const limit = 9; // 9 items per page for 3x3 grid

    // Fetch drafts with filters
    const { isLoading: isFetching } = useGetDraftsQuery({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
        page: currentPage,
        limit,
    });

    const drafts = useSelector(selectDraftsList);
    const total = useSelector(selectDraftsTotal);
    const isLoading = useSelector(selectDraftsLoading);
    const error = useSelector(selectDraftsError);

    // Mutations
    const [createDraft, { isLoading: isCreating }] = useCreateDraftMutation();
    const [updateDraft, { isLoading: isUpdating }] = useUpdateDraftMutation();
    const [deleteDraft, { isLoading: isDeleting }] = useDeleteDraftMutation();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Filter drafts locally for instant feedback
    const filteredDrafts = useMemo(() => {
        let result = [...drafts];

        // Client-side search (in case backend doesn't support it)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((draft) => {
                const title = draft.title?.toLowerCase() || '';
                const content = draft.content?.toLowerCase() || '';
                const excerpt = draft.excerpt?.toLowerCase() || '';
                return title.includes(query) || content.includes(query) || excerpt.includes(query);
            });
        }

        return result;
    }, [drafts, searchQuery]);

    // Handlers
    const handleCreateDraft = () => {
        setDraftToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleEditDraft = (draft: Draft) => {
        setDraftToEdit(draft);
        setIsFormModalOpen(true);
    };

    const handleViewDraft = (draft: Draft) => {
        setSelectedDraft(draft);
        setIsDetailModalOpen(true);
    };

    const handleDeleteDraft = async (id: string) => {
        try {
            await deleteDraft(id).unwrap();
            // Success - RTK Query will automatically update the cache
        } catch (err) {
            console.error('Failed to delete draft:', err);
            alert('Failed to delete draft. Please try again.');
        }
    };

    const handleFormSubmit = async (data: CreateDraftDto | UpdateDraftDto) => {
        try {
            if (draftToEdit) {
                // Update existing draft
                await updateDraft({ id: draftToEdit.id, data: data as UpdateDraftDto }).unwrap();
            } else {
                // Create new draft
                await createDraft(data as CreateDraftDto).unwrap();
            }
            setIsFormModalOpen(false);
            setDraftToEdit(null);
        } catch (err) {
            console.error('Failed to save draft:', err);
            throw err; // Let the form handle the error
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleStatusFilterChange = (status: DraftStatus | 'all') => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Loading state
    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="h-12 w-64 bg-secondary-200 rounded shimmer mb-4" />
                        <div className="h-10 w-full max-w-2xl bg-secondary-200 rounded shimmer" />
                    </div>
                    <DraftsLoadingSkeleton count={9} />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="inline-flex p-4 bg-danger-100 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-danger-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                        Error Loading Drafts
                    </h2>
                    <p className="text-secondary-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <DraftsHeader
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusFilterChange={handleStatusFilterChange}
                    totalCount={total}
                    onCreateDraft={handleCreateDraft}
                />

                {/* Content */}
                {filteredDrafts.length === 0 ? (
                    drafts.length === 0 && statusFilter === 'all' && !searchQuery ? (
                        <EmptyDraftsState onCreateDraft={handleCreateDraft} />
                    ) : (
                        <div className="text-center py-16 fade-in">
                            <p className="text-secondary-600 text-lg mb-4">
                                No drafts match your search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setStatusFilter('all');
                                }}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    )
                ) : (
                    <>
                        <DraftsGrid
                            drafts={filteredDrafts}
                            onEdit={handleEditDraft}
                            onDelete={handleDeleteDraft}
                            onView={handleViewDraft}
                        />

                        {/* Pagination */}
                        <PaginationControls
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={isLoading}
                        />
                    </>
                )}

                {/* Detail Modal */}
                <DraftDetailModal
                    draft={selectedDraft}
                    isOpen={isDetailModalOpen}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedDraft(null);
                    }}
                    onEdit={handleEditDraft}
                    onDelete={handleDeleteDraft}
                />

                {/* Form Modal */}
                <DraftFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setDraftToEdit(null);
                    }}
                    onSubmit={handleFormSubmit}
                    draft={draftToEdit}
                    isLoading={isCreating || isUpdating}
                />

                {/* Deleting Overlay */}
                {isDeleting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4">
                            <div className="w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-secondary-900 font-medium">Deleting draft...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
