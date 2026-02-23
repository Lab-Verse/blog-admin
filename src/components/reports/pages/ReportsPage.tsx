'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetReportsQuery,
    useUpdateReportMutation,
} from '@/redux/api/report/reports.api';
import { useDeletePostMutation } from '@/redux/api/post/posts.api';
import {
    selectFilteredReports,
    selectAllReports,
    selectReportsLoading,
    selectReportsError,
    selectReportsSearch,
    selectReportsStatusFilter,
    selectReportsTargetTypeFilter,
} from '@/redux/selectors/report/reports.selectors';
import {
    setReportsSearch,
    setReportsStatusFilter,
    setReportsTargetTypeFilter,
} from '@/redux/slices/report/reports.slice';
import { Report, ReportStatus, ReportTargetType, UpdateReportRequest } from '@/redux/types/report/reports.types';
import { ReportCard } from '../ReportCard';
import { ReportDetailModal } from '../ReportDetailModal';
import { Shield, Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportsPageProps {
    moderatorId: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ moderatorId }) => {
    const dispatch = useDispatch();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const { isLoading: isFetching, data: apiData, error: apiError } = useGetReportsQuery();
    const rawFilteredReports = useSelector(selectFilteredReports);
    const rawAllReports = useSelector(selectAllReports);
    const isLoading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);
    const searchQuery = useSelector(selectReportsSearch);
    const statusFilter = useSelector(selectReportsStatusFilter);
    const targetTypeFilter = useSelector(selectReportsTargetTypeFilter);

    const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();
    const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();

    // Use real data from Redux
    const allReports = rawAllReports;
    const filteredReports = rawFilteredReports;

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setIsDetailModalOpen(true);
    };

    const handleAcceptReport = async (report: Report) => {
        if (report.target_type !== 'post' || !report.post_id) {
            alert('This report is not about a post.');
            return;
        }

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this post? This action cannot be undone.'
        );
        if (!confirmDelete) return;

        try {
            // Delete the post
            await deletePost(report.post_id).unwrap();

            // Update the report status to RESOLVED
            await updateReport({
                id: report.id,
                body: {
                    status: ReportStatus.RESOLVED,
                    moderator_id: moderatorId,
                    resolution_notes: 'Post removed due to policy violation',
                },
            }).unwrap();
        } catch (err) {
            console.error('Failed to accept report:', err);
            alert('Failed to accept report. Please try again.');
        }
    };

    const handleRejectReport = async (report: Report) => {
        try {
            await updateReport({
                id: report.id,
                body: {
                    status: ReportStatus.REJECTED,
                    moderator_id: moderatorId,
                    resolution_notes: 'Report rejected - content is acceptable',
                },
            }).unwrap();
        } catch (err) {
            console.error('Failed to reject report:', err);
            alert('Failed to reject report. Please try again.');
        }
    };

    // Calculate stats
    const openCount = allReports.filter((r) => r.status === ReportStatus.OPEN).length;
    const inReviewCount = allReports.filter((r) => r.status === ReportStatus.IN_REVIEW).length;
    const resolvedCount = allReports.filter((r) => r.status === ReportStatus.RESOLVED).length;
    const rejectedCount = allReports.filter((r) => r.status === ReportStatus.REJECTED).length;

    if (isLoading || isFetching) {
        return (
            <div className="p-6">
                <div className="h-12 w-64 bg-secondary-200 rounded shimmer mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-secondary-200 rounded-xl shimmer" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-6 bg-secondary-200 rounded shimmer w-3/4 mb-4" />
                            <div className="h-4 bg-secondary-100 rounded shimmer w-full mb-2" />
                            <div className="h-4 bg-secondary-100 rounded shimmer w-5/6" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header with Gradient Title */}
            <div className="mb-8 fade-in">
                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Moderation Dashboard</h1>
                    <div className="flex items-center gap-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        Live
                    </div>
                </div>
                <p className="text-secondary-600">
                    Review and manage reported content
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Open Reports</p>
                                <p className="text-3xl font-bold text-secondary-900">{openCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-yellow-500 text-white">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">In Review</p>
                                <p className="text-3xl font-bold text-secondary-900">{inReviewCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-500 text-white">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Resolved</p>
                                <p className="text-3xl font-bold text-secondary-900">{resolvedCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-500 text-white">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                                <p className="text-3xl font-bold text-secondary-900">{rejectedCount}</p>
                            </div>
                            <div className="p-3 rounded-full bg-red-500 text-white">
                                <XCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                        type="text"
                        placeholder="Search reports by reason or description..."
                        value={searchQuery}
                        onChange={(e) => dispatch(setReportsSearch(e.target.value))}
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => dispatch(setReportsStatusFilter(e.target.value as ReportStatus | 'all'))}
                        className="pl-12 pr-10 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none min-w-[180px]"
                    >
                        <option value="all">All Statuses</option>
                        <option value={ReportStatus.OPEN}>Open</option>
                        <option value={ReportStatus.IN_REVIEW}>In Review</option>
                        <option value={ReportStatus.RESOLVED}>Resolved</option>
                        <option value={ReportStatus.REJECTED}>Rejected</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Target Type Filter */}
                <div className="relative">
                    <select
                        value={targetTypeFilter}
                        onChange={(e) => dispatch(setReportsTargetTypeFilter(e.target.value as ReportTargetType | 'all'))}
                        className="px-4 pr-10 py-3.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none min-w-[150px]"
                    >
                        <option value="all">All Types</option>
                        <option value="post">Post</option>
                        <option value="question">Question</option>
                        <option value="comment">Comment</option>
                        <option value="answer">Answer</option>
                        <option value="user">User</option>
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            {filteredReports.length === 0 ? (
                <div className="text-center py-16 fade-in">
                    <div className="inline-flex p-6 bg-accent-100 rounded-full mb-4">
                        <Shield className="w-12 h-12 text-accent-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        {allReports.length === 0 ? 'No Reports Yet' : 'No Matching Reports'}
                    </h3>
                    <p className="text-secondary-600">
                        {allReports.length === 0
                            ? 'All clear! No reports to review.'
                            : 'Try adjusting your filters to see more reports.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map((report) => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onView={handleViewReport}
                            onAccept={handleAcceptReport}
                            onReject={handleRejectReport}
                        />
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <ReportDetailModal
                report={selectedReport}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedReport(null);
                }}
                onUpdate={async (id, data) => {
                    try {
                        await updateReport({ id, body: data }).unwrap();
                    } catch (err: any) {
                        console.error('Failed to update report:', err?.data || err?.message || err);
                        const errorMessage = err?.data?.message || err?.message || 'Failed to update report. Please try again.';
                        throw new Error(errorMessage);
                    }
                }}
                onAccept={handleAcceptReport}
                onReject={handleRejectReport}
                moderatorId={moderatorId}
                isLoading={isUpdating}
            />
        </div>
    );
};
