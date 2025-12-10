import React from 'react';
import { QuestionCard } from './QuestionCard';
import { Question } from '@/redux/types/question/questions.types';

interface QuestionsGridProps {
    questions: Question[];
    onEdit: (question: Question) => void;
    onDelete: (id: string) => void;
    onView: (question: Question) => void;
}

export const QuestionsGrid: React.FC<QuestionsGridProps> = ({
    questions,
    onEdit,
    onDelete,
    onView,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </div>
    );
};
