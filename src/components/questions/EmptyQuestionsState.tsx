import React from 'react';
import { MessageSquareX, Sparkles } from 'lucide-react';

interface EmptyQuestionsStateProps {
    onCreateQuestion?: () => void;
}

export const EmptyQuestionsState: React.FC<EmptyQuestionsStateProps> = ({ onCreateQuestion }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 fade-in">
            {/* Icon with Gradient Background */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-accent-400 to-primary-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-linear-to-br from-accent-500 to-primary-500 p-6 rounded-full">
                    <MessageSquareX className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-secondary-900 mb-3 text-center">
                No Questions Yet
            </h2>

            {/* Description */}
            <p className="text-secondary-600 text-center max-w-md mb-8 leading-relaxed">
                Start engaging with your community! Create questions to get answers and discussions going.
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center gap-2 text-sm text-secondary-500 mb-8">
                <Sparkles className="w-4 h-4 text-accent-500" />
                <span>Your questions will appear here</span>
                <Sparkles className="w-4 h-4 text-accent-500" />
            </div>

            {/* CTA Button */}
            {onCreateQuestion && (
                <button
                    onClick={onCreateQuestion}
                    className="px-6 py-3 bg-linear-to-r from-accent-600 to-primary-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                    Ask Your First Question
                </button>
            )}
        </div>
    );
};
