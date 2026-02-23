'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetAnswersQuery,
    useCreateAnswerMutation,
    useUpdateAnswerMutation,
    useDeleteAnswerMutation,
} from '@/redux/api/answer/answersApi';
import { useGetQuestionsQuery } from '@/redux/api/question/questions.api';
import {
    selectAnswersList,
    selectAnswersTotal,
    selectAnswersLoading,
    selectAnswersError,
} from '@/redux/selectors/answer/answersSelectors';
import { Answer } from '@/redux/types/answer/answers.types';
import { AnswerCard } from '../AnswerCard';
import { MessageSquare, Plus, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

interface AnswersPageProps {
    questionId?: string; // Optional: filter by question
}

export const AnswersPage: React.FC<AnswersPageProps> = ({ questionId }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [answerToEdit, setAnswerToEdit] = useState<Answer | null>(null);
    const [newAnswerContent, setNewAnswerContent] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState(questionId ?? '');
    const currentUser = useAppSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || '';
    const isAuthenticated = useAppSelector((state) => !!state.auth?.accessToken);
    const { isLoading: isFetching } = useGetAnswersQuery(selectedQuestionId ? { questionId: selectedQuestionId } : undefined);
    const { data: questions = [] } = useGetQuestionsQuery();
    const answers = useSelector(selectAnswersList);
    const total = useSelector(selectAnswersTotal);
    const isLoading = useSelector(selectAnswersLoading);
    const error = useSelector(selectAnswersError);

    // Mutations
    const [createAnswer, { isLoading: isCreating }] = useCreateAnswerMutation();
    const [updateAnswer, { isLoading: isUpdating }] = useUpdateAnswerMutation();
    const [deleteAnswer, { isLoading: isDeleting }] = useDeleteAnswerMutation();

    const handleCreateAnswer = async () => {
        if (!newAnswerContent.trim() || !selectedQuestionId || !isAuthenticated) return;

        try {
            await createAnswer({ 
                content: newAnswerContent, 
                questionId: selectedQuestionId, 
                userId: currentUserId || 'current-user' 
            }).unwrap();
            setNewAnswerContent('');
            setIsFormOpen(false);
        } catch (err) {
            console.error('Failed to create answer:', err);
            alert('Failed to create answer. Please try again.');
        }
    };

    const handleEditAnswer = (answer: Answer) => {
        setAnswerToEdit(answer);
        setNewAnswerContent(answer.content);
        setSelectedQuestionId(answer.questionId);
        setIsFormOpen(true);
    };

    const handleUpdateAnswer = async () => {
        if (!answerToEdit || !newAnswerContent.trim()) return;

        try {
            await updateAnswer({
                id: answerToEdit.id,
                data: { content: newAnswerContent },
            }).unwrap();
            setNewAnswerContent('');
            setAnswerToEdit(null);
            setIsFormOpen(false);
        } catch (err) {
            console.error('Failed to update answer:', err);
            alert('Failed to update answer. Please try again.');
        }
    };

    const handleDeleteAnswer = async (id: string) => {
        try {
            await deleteAnswer(id).unwrap();
        } catch (err) {
            console.error('Failed to delete answer:', err);
            alert('Failed to delete answer. Please try again.');
        }
    };

    const handleToggleAccepted = async (answer: Answer) => {
        try {
            await updateAnswer({
                id: answer.id,
                data: { isAccepted: !answer.isAccepted },
            }).unwrap();
        } catch (err) {
            console.error('Failed to toggle accepted status:', err);
            alert('Failed to update answer. Please try again.');
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="h-12 w-64 bg-secondary-200 rounded shimmer mb-8" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 mb-4 animate-pulse">
                            <div className="h-4 bg-secondary-200 rounded shimmer w-3/4 mb-4" />
                            <div className="h-3 bg-secondary-100 rounded shimmer w-full mb-2" />
                            <div className="h-3 bg-secondary-100 rounded shimmer w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-secondary-50 p-6 md:p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="inline-flex p-4 bg-danger-100 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-danger-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-2">Error Loading Answers</h2>
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 fade-in">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-linear-to-br from-accent-500 to-primary-500 rounded-xl shadow-lg">
                            <MessageSquare className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient-accent">Answers</h1>
                            <p className="text-secondary-600 mt-1">{total} {total === 1 ? 'answer' : 'answers'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setAnswerToEdit(null);
                            setNewAnswerContent('');
                            if (questionId) setSelectedQuestionId(questionId);
                            setIsFormOpen(!isFormOpen);
                        }}
                        className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Answer</span>
                    </button>
                </div>

                {!questionId && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                        <label htmlFor="filter-question" className="block text-sm font-medium text-secondary-700 mb-2">
                            Filter by Question
                        </label>
                        <select
                            id="filter-question"
                            value={selectedQuestionId}
                            onChange={(e) => setSelectedQuestionId(e.target.value)}
                            className="w-full md:w-96 px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="">All Questions</option>
                            {questions.map((question) => (
                                <option key={question.id} value={question.id}>
                                    {question.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Answer Form */}
                {isFormOpen && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 fade-in">
                        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                            {answerToEdit ? 'Edit Answer' : 'Write Your Answer'}
                        </h3>

                        <div className="mb-4">
                            <label htmlFor="answer-question" className="block text-sm font-medium text-secondary-700 mb-2">
                                Question
                            </label>
                            <select
                                id="answer-question"
                                value={selectedQuestionId}
                                onChange={(e) => setSelectedQuestionId(e.target.value)}
                                disabled={Boolean(questionId) || Boolean(answerToEdit)}
                                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-secondary-50"
                            >
                                <option value="">Select a question</option>
                                {questions.map((question) => (
                                    <option key={question.id} value={question.id}>
                                        {question.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <textarea
                            value={newAnswerContent}
                            onChange={(e) => setNewAnswerContent(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 resize-none mb-4"
                            placeholder="Share your knowledge..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsFormOpen(false);
                                    setAnswerToEdit(null);
                                    setNewAnswerContent('');
                                }}
                                className="px-6 py-2 bg-white border border-secondary-300 text-secondary-700 font-medium rounded-lg hover:bg-secondary-50 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={answerToEdit ? handleUpdateAnswer : handleCreateAnswer}
                                disabled={isCreating || isUpdating || !newAnswerContent.trim() || !selectedQuestionId || !isAuthenticated}
                                className="px-6 py-2 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                            >
                                {isCreating || isUpdating ? 'Saving...' : answerToEdit ? 'Update Answer' : 'Post Answer'}
                            </button>
                        </div>
                        {!isAuthenticated && (
                            <p className="mt-3 text-sm text-danger-600">You must be logged in to add an answer.</p>
                        )}
                    </div>
                )}

                {/* Answers List */}
                {answers.length === 0 ? (
                    <div className="text-center py-16 fade-in">
                        <div className="inline-flex p-6 bg-secondary-100 rounded-full mb-4">
                            <MessageSquare className="w-12 h-12 text-secondary-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">No Answers Yet</h3>
                        <p className="text-secondary-600">Be the first to answer this question!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {answers.map((answer) => (
                            <AnswerCard
                                key={answer.id}
                                answer={answer}
                                onEdit={handleEditAnswer}
                                onDelete={handleDeleteAnswer}
                                onToggleAccepted={handleToggleAccepted}
                            />
                        ))}
                    </div>
                )}

                {/* Deleting Overlay */}
                {isDeleting && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4">
                            <div className="w-6 h-6 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-secondary-900 font-medium">Deleting answer...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
