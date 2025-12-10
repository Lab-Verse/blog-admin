import React from 'react';
import { DraftCard } from './DraftCard';
import { Draft } from '@/redux/types/draft/drafts.types';

interface DraftsGridProps {
    drafts: Draft[];
    onEdit: (draft: Draft) => void;
    onDelete: (id: string) => void;
    onView: (draft: Draft) => void;
}

export const DraftsGrid: React.FC<DraftsGridProps> = ({
    drafts,
    onEdit,
    onDelete,
    onView,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
                <DraftCard
                    key={draft.id}
                    draft={draft}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                />
            ))}
        </div>
    );
};
