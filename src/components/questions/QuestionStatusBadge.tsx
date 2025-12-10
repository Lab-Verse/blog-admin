import React from 'react';
import { QuestionStatus } from '@/redux/types/question/questions.types';
import { HelpCircle, CheckCircle, Archive } from 'lucide-react';

interface QuestionStatusBadgeProps {
    status: QuestionStatus;
    className?: string;
}

export const QuestionStatusBadge: React.FC<QuestionStatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case QuestionStatus.OPEN:
                return {
                    label: 'Open',
                    icon: HelpCircle,
                    bgColor: 'bg-accent-100',
                    textColor: 'text-accent-700',
                    borderColor: 'border-accent-300',
                };
            case QuestionStatus.CLOSED:
                return {
                    label: 'Closed',
                    icon: CheckCircle,
                    bgColor: 'bg-primary-100',
                    textColor: 'text-primary-700',
                    borderColor: 'border-primary-300',
                };
            case QuestionStatus.ARCHIVED:
                return {
                    label: 'Archived',
                    icon: Archive,
                    bgColor: 'bg-secondary-200',
                    textColor: 'text-secondary-700',
                    borderColor: 'border-secondary-400',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: HelpCircle,
                    bgColor: 'bg-secondary-100',
                    textColor: 'text-secondary-600',
                    borderColor: 'border-secondary-300',
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
        >
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
};
