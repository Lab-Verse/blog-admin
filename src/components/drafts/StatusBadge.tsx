import React from 'react';
import { DraftStatus } from '@/redux/types/draft/drafts.types';
import { FileText, Clock, Archive } from 'lucide-react';

interface StatusBadgeProps {
    status: DraftStatus;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case DraftStatus.DRAFT:
                return {
                    label: 'Draft',
                    icon: FileText,
                    bgColor: 'bg-primary-100',
                    textColor: 'text-primary-700',
                    borderColor: 'border-primary-300',
                };
            case DraftStatus.SCHEDULED:
                return {
                    label: 'Scheduled',
                    icon: Clock,
                    bgColor: 'bg-purple-100',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-300',
                };
            case DraftStatus.ARCHIVED:
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
