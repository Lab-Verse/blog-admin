'use client';

import { useState } from 'react';
import { Comment, CommentStatus } from '@/redux/types/comment/comments.types';
import {
    useCreateCommentReplyMutation,
    useGetCommentRepliesQuery,
} from '@/redux/api/commentreplies/commentRepliesApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Eye, Trash2, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

interface CommentsPageComponentProps {
    comments: Comment[];
    isLoading: boolean;
    onUpdateStatus: (id: string, status: CommentStatus) => void;
    onDelete: (id: string) => void;
}

function CommentReplySection({
    commentId,
    hideReplies,
}: {
    commentId: string;
    hideReplies: boolean;
}) {
    const { data: replies } = useGetCommentRepliesQuery({ commentId });
    const [createCommentReply] = useCreateCommentReplyMutation();
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const handleSubmitReply = async () => {
        if (!replyContent.trim()) {
            alert('Please write a reply before posting.');
            return;
        }

        setIsSubmittingReply(true);
        try {
            await createCommentReply({
                commentId,
                content: replyContent,
            }).unwrap();
            setReplyContent('');
        } catch (error) {
            console.error('Failed to add reply:', error);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    if (hideReplies) {
        return null;
    }

    return (
        <div className="mt-3">
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    placeholder="Write a reply..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={handleSubmitReply} disabled={isSubmittingReply}>
                        {isSubmittingReply ? 'Posting...' : 'Post Reply'}
                    </Button>
                </div>
            </div>

            {Array.isArray(replies) && replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-slate-100 pl-3">
                    {replies.map((reply) => (
                        <div key={reply.id} className="rounded-md bg-slate-50 p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-medium text-slate-700">{reply.author?.name || 'Unknown User'}</span>
                                <span>•</span>
                                <span>
                                    {reply.createdAt
                                        ? new Date(reply.createdAt).toLocaleDateString()
                                        : 'Just now'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700">{reply.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CommentsPageComponent({
    comments,
    isLoading,
    onUpdateStatus,
    onDelete,
}: CommentsPageComponentProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<CommentStatus | 'all'>('all');
    const [hiddenRepliesByComment, setHiddenRepliesByComment] = useState<Record<string, boolean>>({});

    const isRepliesHidden = (comment: Comment) => {
        return hiddenRepliesByComment[comment.id] ?? (comment.status === CommentStatus.HIDDEN);
    };

    const handleHideComment = async (comment: Comment) => {
        const nextHidden = !isRepliesHidden(comment);
        await onUpdateStatus(comment.id, nextHidden ? CommentStatus.HIDDEN : CommentStatus.VISIBLE);
        setHiddenRepliesByComment((prev) => ({
            ...prev,
            [comment.id]: nextHidden,
        }));
    };

    const handleApproveComment = async (commentId: string) => {
        await onUpdateStatus(commentId, CommentStatus.VISIBLE);
        setHiddenRepliesByComment((prev) => ({
            ...prev,
            [commentId]: false,
        }));
    };

    const filteredComments = comments.filter((comment) => {
        const authorName = comment.author?.name || '';
        const matchesSearch =
            comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            authorName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || comment.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: CommentStatus) => {
        switch (status) {
            case CommentStatus.VISIBLE:
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case CommentStatus.HIDDEN:
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case CommentStatus.DELETED:
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-primary-600" />
                            Comments
                        </h1>
                        <p className="text-slate-500">
                            Manage community interactions and moderation.
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Comments', value: comments.length, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Visible', value: comments.filter(c => c.status === CommentStatus.VISIBLE).length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Hidden', value: comments.filter(c => c.status === CommentStatus.HIDDEN).length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Deleted', value: comments.filter(c => c.status === CommentStatus.DELETED).length, icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <div className={`text-2xl font-bold ${stat.color}`}>{isLoading ? '-' : stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm sticky top-4 z-40 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search comments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 text-slate-900 font-medium cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value={CommentStatus.VISIBLE}>Visible</option>
                        <option value={CommentStatus.HIDDEN}>Hidden</option>
                        <option value={CommentStatus.DELETED}>Deleted</option>
                    </select>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <Card key={i} className="border-0 shadow-sm animate-pulse">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                                        <div className="flex-1 space-y-3">
                                            <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredComments.length === 0 ? (
                        <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-slate-200">
                            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-1">No comments found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredComments.map((comment) => (
                            <Card key={comment.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            {comment.author?.avatarUrl ? (
                                                <Image
                                                    src={comment.author.avatarUrl}
                                                    alt={comment.author.name || 'User'}
                                                    width={40}
                                                    height={40}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                    {getInitials(comment.author?.name)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {comment.author?.name || 'Anonymous'}
                                                    </h3>
                                                    <span className="text-slate-400 text-sm">•</span>
                                                    <span className="text-slate-500 text-sm">
                                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                                                    </span>
                                                </div>
                                                <Badge variant="outline" className={`${getStatusBadge(comment.status)} capitalize`}>
                                                    {comment.status}
                                                </Badge>
                                            </div>

                                            <p className="text-slate-700 leading-relaxed mb-4">
                                                {comment.content}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex min-h-10 items-center gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleApproveComment(comment.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={comment.status === CommentStatus.VISIBLE}
                                                    className={`w-24 justify-center border-slate-200 ${
                                                        comment.status === CommentStatus.VISIBLE
                                                            ? 'invisible pointer-events-none'
                                                            : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                                                    }`}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1.5" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    onClick={() => handleHideComment(comment)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-24 justify-center text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-slate-200"
                                                >
                                                    <AlertCircle className="w-4 h-4 mr-1.5" />
                                                    {isRepliesHidden(comment) ? 'Show' : 'Hide'}
                                                </Button>
                                                <div className="flex-1"></div>
                                                <Button
                                                    onClick={() => onDelete(comment.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <CommentReplySection
                                                commentId={comment.id}
                                                hideReplies={isRepliesHidden(comment)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
