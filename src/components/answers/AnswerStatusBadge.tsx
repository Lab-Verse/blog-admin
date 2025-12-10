import React from 'react';
import { AnswerStatus } from '@/redux/types/answer/answers.types';
import { FileText, Eye, Trash2 } from 'lucide-react';

interface AnswerStatusBadgeProps {
    status: AnswerStatus;
    className?: string;
}

export const AnswerStatusBadge: React.FC<AnswerStatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case AnswerStatus.PUBLISHED:
                return {
                    label: 'Published',
                    icon: Eye,
                    bgColor: 'bg-accent-100',
                    textColor: 'text-accent-700',
                    borderColor: 'border-accent-300',
                };
            case AnswerStatus.DRAFT:
                return {
                    label: 'Draft',
                    icon: FileText,
                    bgColor: 'bg-primary-100',
                    textColor: 'text-primary-700',
                    borderColor: 'border-primary-300',
                };
            case AnswerStatus.DELETED:
                return {
                    label: 'Deleted',
                    icon: Trash2,
                    bgColor: 'bg-danger-100',
                    textColor: 'text-danger-700',
                    borderColor: 'border-danger-300',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: FileText,
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
