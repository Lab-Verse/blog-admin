'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetAnswersQuery,
    useCreateAnswerMutation,
    useUpdateAnswerMutation,
    useDeleteAnswerMutation,
} from '@/redux/api/answer/answersApi';
import {
    selectAnswersList,
    selectAnswersLoading,
    selectAnswersError,
} from '@/redux/selectors/answer/answersSelectors';
import { Answer } from '@/redux/types/answer/answers.types';
import { AnswerCard } from './AnswerCard';
import { Plus, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

interface AnswersSectionProps {
    questionId: string;
}

export const AnswersSection: React.FC<AnswersSectionProps> = ({ questionId }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [answerToEdit, setAnswerToEdit] = useState<Answer | null>(null);
    const [newAnswerContent, setNewAnswerContent] = useState('');
    
    const currentUser = useAppSelector((state) => state.auth?.user);
    const isAuthenticated = useAppSelector((state) => !!state.auth?.accessToken);

    // Fetch answers for this specific question
    const { isLoading: isFetching } = useGetAnswersQuery(questionId ? { questionId } : undefined);
    const answers = useSelector(selectAnswersList);
    const isLoading = useSelector(selectAnswersLoading);
    const error = useSelector(selectAnswersError);

    // Mutations
    const [createAnswer, { isLoading: isCreating }] = useCreateAnswerMutation();
    const [updateAnswer, { isLoading: isUpdating }] = useUpdateAnswerMutation();
    const [deleteAnswer, { isLoading: isDeleting }] = useDeleteAnswerMutation();

    const handleCreateAnswer = async () => {
        if (!newAnswerContent.trim() || !questionId || !isAuthenticated) return;

        try {
            await createAnswer({
                content: newAnswerContent,
                questionId,
                userId: currentUser?.id || 'current-user',
            }).unwrap();
            setNewAnswerContent('');
            setIsFormOpen(false);
        } catch (err) {
            console.error('Failed to create answer:', err);
        }
    };

    const handleEditAnswer = (answer: Answer) => {
        setAnswerToEdit(answer);
        setNewAnswerContent(answer.content);
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
        }
    };

    const handleDeleteAnswer = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this answer?')) return;
        
        try {
            await deleteAnswer(id).unwrap();
        } catch (err) {
            console.error('Failed to delete answer:', err);
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
        }
    };

    if (error) {
        return (
            <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-danger-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-danger-900">Error Loading Answers</h3>
                        <p className="text-sm text-danger-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const filteredAnswers = answers.filter((a) => a.questionId === questionId);

    return (
        <div className="space-y-4">
            {/* Answer Form */}
            {isFormOpen && (
                <div className="bg-white rounded-lg p-4 border border-secondary-200">
                    <h3 className="font-semibold text-secondary-900 mb-3">
                        {answerToEdit ? 'Edit Answer' : 'Write Your Answer'}
                    </h3>
                    <textarea
                        value={newAnswerContent}
                        onChange={(e) => setNewAnswerContent(e.target.value)}
                        rows={4}
                        placeholder="Share your knowledge..."
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3 resize-none"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setIsFormOpen(false);
                                setAnswerToEdit(null);
                                setNewAnswerContent('');
                            }}
                            className="px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={answerToEdit ? handleUpdateAnswer : handleCreateAnswer}
                            disabled={isCreating || isUpdating || !newAnswerContent.trim() || !isAuthenticated}
                            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating || isUpdating ? 'Saving...' : answerToEdit ? 'Update' : 'Post Answer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Add Answer Button */}
            {!isFormOpen && (
                <button
                    onClick={() => {
                        setAnswerToEdit(null);
                        setNewAnswerContent('');
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors w-full justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add Answer
                </button>
            )}

            {/* Answers List */}
            {isLoading || isFetching ? (
                <div className="space-y-2">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-secondary-100 animate-pulse rounded-lg h-20" />
                    ))}
                </div>
            ) : filteredAnswers.length === 0 ? (
                <div className="text-center py-8 px-4 bg-secondary-50 rounded-lg border border-secondary-200">
                    <p className="text-secondary-600">No answers yet. Be the first to answer!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAnswers.map((answer) => (
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

            {!isAuthenticated && (
                <p className="text-sm text-danger-600 text-center py-2">You must be logged in to add an answer.</p>
            )}
        </div>
    );
};
