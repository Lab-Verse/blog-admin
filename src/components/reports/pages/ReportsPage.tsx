'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetReportsQuery,
    useUpdateReportMutation,
} from '@/redux/api/report/reports.api';
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
import { Shield, Search, Filter, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ReportsPageProps {
    moderatorId: string;
}

// Mock data for fallback
const MOCK_REPORTS: Report[] = [
    {
        id: '1',
        reporter_id: 'user-1',
        target_type: 'post',
        post_id: 'post-1',
        reason: 'Spam',
        description: 'This post is just a link to a suspicious website.',
        status: ReportStatus.OPEN,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { id: 'user-1', name: 'John Doe', email: 'john@example.com' }
    },
    {
        id: '2',
        reporter_id: 'user-2',
        target_type: 'comment',
        comment_id: 'comment-1',
        reason: 'Harassment',
        description: 'User is being abusive in the comments.',
        status: ReportStatus.IN_REVIEW,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' }
    },
    {
        id: '3',
        reporter_id: 'user-3',
        target_type: 'user',
        reported_user_id: 'user-4',
        reason: 'Inappropriate Profile',
        description: 'Profile picture contains offensive content.',
        status: ReportStatus.RESOLVED,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { id: 'user-3', name: 'Mike Johnson', email: 'mike@example.com' }
    },
    {
        id: '4',
        reporter_id: 'user-1',
        target_type: 'post',
        post_id: 'post-5',
        reason: 'Misinformation',
        description: 'Claims are not backed by facts.',
        status: ReportStatus.REJECTED,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { id: 'user-1', name: 'John Doe', email: 'john@example.com' }
    },
    {
        id: '5',
        reporter_id: 'user-5',
        target_type: 'question',
        question_id: 'q-1',
        reason: 'Duplicate',
        description: 'This question has been asked multiple times.',
        status: ReportStatus.OPEN,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString(),
        reporter: { id: 'user-5', name: 'Sarah Wilson', email: 'sarah@example.com' }
    }
];

export const ReportsPage: React.FC<ReportsPageProps> = ({ moderatorId }) => {
    const dispatch = useDispatch();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const { isLoading: isFetching } = useGetReportsQuery();
    const rawFilteredReports = useSelector(selectFilteredReports);
    const rawAllReports = useSelector(selectAllReports);
    const isLoading = useSelector(selectReportsLoading);
    const error = useSelector(selectReportsError);
    const searchQuery = useSelector(selectReportsSearch);
    const statusFilter = useSelector(selectReportsStatusFilter);
    const targetTypeFilter = useSelector(selectReportsTargetTypeFilter);

    const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

    // Use mock data if there's an error
    const allReports = error ? MOCK_REPORTS : rawAllReports;
    const isDemoMode = !!error;

    // Filter mock data if in demo mode
    const filteredReports = isDemoMode
        ? allReports.filter(report => {
            const matchesSearch = !searchQuery ||
                report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
            const matchesType = targetTypeFilter === 'all' || report.target_type === targetTypeFilter;
            return matchesSearch && matchesStatus && matchesType;
        })
        : rawFilteredReports;

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        setIsDetailModalOpen(true);
    };

    const handleQuickResolve = async (report: Report) => {
        if (isDemoMode) {
            alert('Resolve functionality is disabled in demo mode.');
            return;
        }
        try {
            await updateReport({
                id: report.id,
                body: {
                    status: ReportStatus.RESOLVED,
                    moderator_id: moderatorId,
                },
            }).unwrap();
        } catch (err) {
            console.error('Failed to resolve report:', err);
            alert('Failed to resolve report. Please try again.');
        }
    };

    const handleQuickReject = async (report: Report) => {
        if (isDemoMode) {
            alert('Reject functionality is disabled in demo mode.');
            return;
        }
        try {
            await updateReport({
                id: report.id,
                body: {
                    status: ReportStatus.REJECTED,
                    moderator_id: moderatorId,
                },
            }).unwrap();
        } catch (err) {
            console.error('Failed to reject report:', err);
            alert('Failed to reject report. Please try again.');
        }
    };

    const handleUpdateReport = async (id: string, data: UpdateReportRequest) => {
        if (isDemoMode) {
            alert('Update functionality is disabled in demo mode.');
            return;
        }
        try {
            await updateReport({ id, body: data }).unwrap();
        } catch (err) {
            console.error('Failed to update report:', err);
            throw err;
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
            {/* Demo Mode Alert */}
            {isDemoMode && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5" />
                    <p className="text-sm font-medium">
                        Showing demo data because the backend is unreachable.
                    </p>
                </div>
            )}

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
                            onResolve={handleQuickResolve}
                            onReject={handleQuickReject}
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
                onUpdate={handleUpdateReport}
                moderatorId={moderatorId}
                isLoading={isUpdating}
            />
        </div>
    );
};
