import React from 'react';
import { FileX, Sparkles } from 'lucide-react';

interface EmptyDraftsStateProps {
    onCreateDraft?: () => void;
}

export const EmptyDraftsState: React.FC<EmptyDraftsStateProps> = ({ onCreateDraft }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 fade-in">
            {/* Icon with Gradient Background */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-linear-to-br from-primary-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-linear-to-br from-primary-500 to-purple-500 p-6 rounded-full">
                    <FileX className="w-16 h-16 text-white" strokeWidth={1.5} />
                </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-secondary-900 mb-3 text-center">
                No Drafts Yet
            </h2>

            {/* Description */}
            <p className="text-secondary-600 text-center max-w-md mb-8 leading-relaxed">
                Start creating your content! Drafts are saved automatically and you can publish them when ready.
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center gap-2 text-sm text-secondary-500 mb-8">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Your drafts will appear here</span>
                <Sparkles className="w-4 h-4 text-purple-500" />
            </div>

            {/* CTA Button */}
            {onCreateDraft && (
                <button
                    onClick={onCreateDraft}
                    className="px-6 py-3 bg-linear-to-r from-primary-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                    Create Your First Draft
                </button>
            )}
        </div>
    );
};
