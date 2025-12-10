import React from 'react';
import { ViewableType } from '@/redux/types/view/viewsTypes';
import { FileText, MessageSquare, CheckSquare, File, Image } from 'lucide-react';

interface ViewTypeBreakdownProps {
    byType: Record<string, number>;
}

export const ViewTypeBreakdown: React.FC<ViewTypeBreakdownProps> = ({ byType }) => {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case ViewableType.POST:
                return <FileText className="w-5 h-5" />;
            case ViewableType.QUESTION:
                return <MessageSquare className="w-5 h-5" />;
            case ViewableType.ANSWER:
                return <CheckSquare className="w-5 h-5" />;
            case ViewableType.DRAFT:
                return <File className="w-5 h-5" />;
            case ViewableType.MEDIA:
                return <Image className="w-5 h-5" />;
            default:
                return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case ViewableType.POST:
                return 'bg-primary-100 text-primary-700';
            case ViewableType.QUESTION:
                return 'bg-accent-100 text-accent-700';
            case ViewableType.ANSWER:
                return 'bg-purple-100 text-purple-700';
            case ViewableType.DRAFT:
                return 'bg-yellow-100 text-yellow-700';
            case ViewableType.MEDIA:
                return 'bg-pink-100 text-pink-700';
            default:
                return 'bg-secondary-100 text-secondary-700';
        }
    };

    const total = Object.values(byType).reduce((sum, count) => sum + count, 0);

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-secondary-900 mb-4">Views by Type</h3>
            <div className="space-y-3">
                {Object.entries(byType).map(([type, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-lg ${getTypeColor(type)}`}>
                                        {getTypeIcon(type)}
                                    </div>
                                    <span className="font-medium text-secondary-900 capitalize">{type}</span>
                                </div>
                                <span className="text-sm font-semibold text-secondary-700">
                                    {count.toLocaleString()} ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-linear-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
