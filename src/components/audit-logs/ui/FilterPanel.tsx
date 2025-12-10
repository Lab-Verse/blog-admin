'use client';

import React from 'react';
import { AuditAction, AuditEntityType } from '@/redux/types/auditlog/auditLogs.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
    filters: {
        action?: AuditAction;
        entityType?: AuditEntityType;
        userId?: string;
        entityId?: string;
        startDate?: string;
        endDate?: string;
    };
    onFilterChange: (filters: {
        action?: AuditAction;
        entityType?: AuditEntityType;
        userId?: string;
        entityId?: string;
        startDate?: string;
        endDate?: string;
    }) => void;
    onClearFilters: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onClearFilters }: FilterPanelProps) {
    const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '');

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-xs"
                    >
                        Clear All
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Action Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Action
                    </label>
                    <select
                        value={filters.action || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                action: (e.target.value as AuditAction) || undefined,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Actions</option>
                        {Object.values(AuditAction).map((action) => (
                            <option key={action} value={action}>
                                {action}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Entity Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entity Type
                    </label>
                    <select
                        value={filters.entityType || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                entityType: (e.target.value as AuditEntityType) || undefined,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Entity Types</option>
                        {Object.values(AuditEntityType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* User ID Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        User ID
                    </label>
                    <Input
                        type="text"
                        placeholder="Filter by user ID..."
                        value={filters.userId || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                userId: e.target.value || undefined,
                            })
                        }
                    />
                </div>

                {/* Entity ID Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entity ID
                    </label>
                    <Input
                        type="text"
                        placeholder="Filter by entity ID..."
                        value={filters.entityId || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                entityId: e.target.value || undefined,
                            })
                        }
                    />
                </div>

                {/* Start Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                    </label>
                    <Input
                        type="date"
                        value={filters.startDate || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                startDate: e.target.value || undefined,
                            })
                        }
                    />
                </div>

                {/* End Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                    </label>
                    <Input
                        type="date"
                        value={filters.endDate || ''}
                        onChange={(e) =>
                            onFilterChange({
                                ...filters,
                                endDate: e.target.value || undefined,
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
