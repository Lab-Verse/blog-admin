import React from 'react';
import { ReportStatus } from '@/redux/types/report/reports.types';
import { AlertCircle, Eye, CheckCircle, XCircle } from 'lucide-react';

interface ReportStatusBadgeProps {
    status: ReportStatus;
    className?: string;
}

export const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case ReportStatus.OPEN:
                return {
                    label: 'Open',
                    icon: AlertCircle,
                    bgColor: 'bg-danger-100',
                    textColor: 'text-danger-700',
                    borderColor: 'border-danger-300',
                };
            case ReportStatus.IN_REVIEW:
                return {
                    label: 'In Review',
                    icon: Eye,
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-700',
                    borderColor: 'border-yellow-300',
                };
            case ReportStatus.RESOLVED:
                return {
                    label: 'Resolved',
                    icon: CheckCircle,
                    bgColor: 'bg-accent-100',
                    textColor: 'text-accent-700',
                    borderColor: 'border-accent-300',
                };
            case ReportStatus.REJECTED:
                return {
                    label: 'Rejected',
                    icon: XCircle,
                    bgColor: 'bg-secondary-200',
                    textColor: 'text-secondary-700',
                    borderColor: 'border-secondary-400',
                };
            default:
                return {
                    label: 'Unknown',
                    icon: AlertCircle,
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
