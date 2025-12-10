'use client';

import React from 'react';
import { AuditAction } from '@/redux/types/auditlog/auditLogs.types';

interface AuditActionBadgeProps {
    action: AuditAction;
}

const actionConfig: Record<AuditAction, { label: string; className: string; icon: string }> = {
    [AuditAction.CREATE]: {
        label: 'Created',
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: '✨',
    },
    [AuditAction.UPDATE]: {
        label: 'Updated',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '✏️',
    },
    [AuditAction.DELETE]: {
        label: 'Deleted',
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: '🗑️',
    },
    [AuditAction.LOGIN]: {
        label: 'Login',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🔐',
    },
    [AuditAction.LOGOUT]: {
        label: 'Logout',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '👋',
    },
    [AuditAction.VIEW]: {
        label: 'Viewed',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: '👁️',
    },
    [AuditAction.EXPORT]: {
        label: 'Exported',
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: '📤',
    },
};

export default function AuditActionBadge({ action }: AuditActionBadgeProps) {
    const config = actionConfig[action];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.className} transition-all duration-200 hover:scale-105`}
        >
            <span className="text-sm">{config.icon}</span>
            {config.label}
        </span>
    );
}
