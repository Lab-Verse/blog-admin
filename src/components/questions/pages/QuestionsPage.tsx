'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetQuestionsQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} from '@/redux/api/question/questions.api';
import {
    selectFilteredQuestions,
    selectQuestionsLoading,
    selectQuestionsError,
    selectQuestionsSearch,
    selectQuestionsStatusFilter,
    selectAllQuestions,
} from '@/redux/selectors/question/questions.selectors';
import {
    setQuestionsSearch,
    setQuestionsStatusFilter,
    setSelectedQuestionId,
} from '@/redux/slices/question/questions.slice';
import { Question, QuestionStatus, CreateQuestionRequest, UpdateQuestionRequest } from '@/redux/types/question/questions.types';
import { QuestionsHeader } from '../QuestionsHeader';
import { QuestionsGrid } from '../QuestionsGrid';
import { EmptyQuestionsState } from '../EmptyQuestionsState';
import { QuestionsLoadingSkeleton } from '../QuestionsLoadingSkeleton';
import { QuestionDetailModal } from '../QuestionDetailModal';
import { QuestionFormModal } from '../QuestionFormModal';
import { AlertCircle } from 'lucide-react';

interface QuestionsPageProps {
    userId: string; // Current user ID for creating questions
}

export const QuestionsPage: React.FC<QuestionsPageProps> = ({ userId }) => {
    const dispatch = useDispatch();
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

    // Fetch questions
    const { isLoading: isFetching } = useGetQuestionsQuery();
    const filteredQuestions = useSelector(selectFilteredQuestions);
    const allQuestions = useSelector(selectAllQuestions);
    const isLoading = useSelector(selectQuestionsLoading);
    const error = useSelector(selectQuestionsError);
    const searchQuery = useSelector(selectQuestionsSearch);
    const statusFilter = useSelector(selectQuestionsStatusFilter);

    // Mutations
    const [createQuestion, { isLoading: isCreating }] = useCreateQuestionMutation();
    const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
    const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

    // Handlers
    const handleCreateQuestion = () => {
        setQuestionToEdit(null);
        setIsFormModalOpen(true);
    };

    const handleEditQuestion = (question: Question) => {
        setQuestionToEdit(question);
        setIsFormModalOpen(true);
    };

    const handleViewQuestion = (question: Question) => {
        setSelectedQuestion(question);
        setIsDetailModalOpen(true);
        dispatch(setSelectedQuestionId(question.id));
    };

    const handleDeleteQuestion = async (id: string) => {
        try {
            await deleteQuestion(id).unwrap();
        } catch (err) {
            console.error('Failed to delete question:', err);
            alert('Failed to delete question. Please try again.');
        }
    };

    const handleFormSubmit = async (data: CreateQuestionRequest | UpdateQuestionRequest) => {
        try {
            if (questionToEdit) {
                await updateQuestion({ id: questionToEdit.id, body: data as UpdateQuestionRequest }).unwrap();
            } else {
                await createQuestion(data as CreateQuestionRequest).unwrap();
            }
            setIsFormModalOpen(false);
            setQuestionToEdit(null);
        } catch (err) {
            console.error('Failed to save question:', err);
            throw err;
        }
    };

    const handleSearchChange = (query: string) => {
        dispatch(setQuestionsSearch(query));
    };

    const handleStatusFilterChange = (status: QuestionStatus | 'all') => {
        dispatch(setQuestionsStatusFilter(status));
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
                    <QuestionsLoadingSkeleton count={6} />
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
                        Error Loading Questions
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
                <QuestionsHeader
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusFilterChange={handleStatusFilterChange}
                    totalCount={allQuestions.length}
                    onCreateQuestion={handleCreateQuestion}
                />

                {/* Content */}
                {filteredQuestions.length === 0 ? (
                    allQuestions.length === 0 && statusFilter === 'all' && !searchQuery ? (
                        <EmptyQuestionsState onCreateQuestion={handleCreateQuestion} />
                    ) : (
                        <div className="text-center py-16 fade-in">
                            <p className="text-secondary-600 text-lg mb-4">
                                No questions match your search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    dispatch(setQuestionsSearch(''));
                                    dispatch(setQuestionsStatusFilter('all'));
                                }}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    )
                ) : (
                    <QuestionsGrid
                        questions={filteredQuestions}
                        onEdit={handleEditQuestion}
                        onDelete={handleDeleteQuestion}
                        onView={handleViewQuestion}
                    />
                )}

                {/* Detail Modal */}
                <QuestionDetailModal
                    question={selectedQuestion}
                    isOpen={isDetailModalOpen}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedQuestion(null);
                        dispatch(setSelectedQuestionId(null));
                    }}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                />

                {/* Form Modal */}
                <QuestionFormModal
                    isOpen={isFormModalOpen}
                    onClose={() => {
                        setIsFormModalOpen(false);
                        setQuestionToEdit(null);
                    }}
                    onSubmit={handleFormSubmit}
                    question={questionToEdit}
                    isLoading={isCreating || isUpdating}
                    userId={userId}
                />

                {/* Deleting Overlay */}
                {isDeleting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4">
                            <div className="w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-secondary-900 font-medium">Deleting question...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
