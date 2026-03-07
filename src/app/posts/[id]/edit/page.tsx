'use client';

import { useParams } from 'next/navigation';
import AdminPostEditor from '@/components/posts/ui/AdminPostEditor';

export default function Page() {
    const params = useParams();
    const id = params.id as string;

    return <AdminPostEditor editPostId={id} />;
}
