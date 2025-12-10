'use client';

import React from 'react';
import { AuditEntityType } from '@/redux/types/auditlog/auditLogs.types';

interface AuditEntityBadgeProps {
    entityType: AuditEntityType;
}

const entityConfig: Record<AuditEntityType, { label: string; className: string; icon: string }> = {
    [AuditEntityType.USER]: {
        label: 'User',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        icon: '👤',
    },
    [AuditEntityType.POST]: {
        label: 'Post',
        className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        icon: '📝',
    },
    [AuditEntityType.COMMENT]: {
        label: 'Comment',
        className: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: '💬',
    },
    [AuditEntityType.CATEGORY]: {
        label: 'Category',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: '📁',
    },
    [AuditEntityType.TAG]: {
        label: 'Tag',
        className: 'bg-pink-50 text-pink-700 border-pink-200',
        icon: '🏷️',
    },
    [AuditEntityType.ROLE]: {
        label: 'Role',
        className: 'bg-violet-50 text-violet-700 border-violet-200',
        icon: '🎭',
    },
    [AuditEntityType.PERMISSION]: {
        label: 'Permission',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: '🔑',
    },
};

export default function AuditEntityBadge({ entityType }: AuditEntityBadgeProps) {
    const config = entityConfig[entityType];

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.className}`}
        >
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
}
