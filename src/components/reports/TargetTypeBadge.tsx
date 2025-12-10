import React from 'react';
import { ReportTargetType } from '@/redux/types/report/reports.types';
import { FileText, MessageSquare, MessageCircle, CheckSquare, User } from 'lucide-react';

interface TargetTypeBadgeProps {
    targetType: ReportTargetType;
    className?: string;
}

export const TargetTypeBadge: React.FC<TargetTypeBadgeProps> = ({ targetType, className = '' }) => {
    const getTargetConfig = () => {
        switch (targetType) {
            case 'post':
                return {
                    label: 'Post',
                    icon: FileText,
                    color: 'text-primary-700 bg-primary-100 border-primary-300',
                };
            case 'question':
                return {
                    label: 'Question',
                    icon: MessageSquare,
                    color: 'text-accent-700 bg-accent-100 border-accent-300',
                };
            case 'comment':
                return {
                    label: 'Comment',
                    icon: MessageCircle,
                    color: 'text-purple-700 bg-purple-100 border-purple-300',
                };
            case 'answer':
                return {
                    label: 'Answer',
                    icon: CheckSquare,
                    color: 'text-yellow-700 bg-yellow-100 border-yellow-300',
                };
            case 'user':
                return {
                    label: 'User',
                    icon: User,
                    color: 'text-secondary-700 bg-secondary-200 border-secondary-400',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: FileText,
                    color: 'text-secondary-600 bg-secondary-100 border-secondary-300',
                };
        }
    };

    const config = getTargetConfig();
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}
        >
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
};
