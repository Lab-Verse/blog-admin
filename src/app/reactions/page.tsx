import { ReactionsPage } from '@/components/reactions';

// Example: Show reactions for a specific post
const CURRENT_USER_ID = 'user-123'; // Replace with actual user ID from session/auth
const TARGET_TYPE = 'post'; // Can be 'post', 'question', 'comment', or 'answer'
const TARGET_ID = 'post-456'; // Replace with actual target ID

export default function ReactionsRoute() {
    return (
        <ReactionsPage
            userId={CURRENT_USER_ID}
            targetType={TARGET_TYPE}
            targetId={TARGET_ID}
        />
    );
}
