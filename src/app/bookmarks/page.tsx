import { BookmarksPage } from '@/components/bookmarks';

// Example: Get user ID from your auth system
// This is a placeholder - replace with your actual auth logic
const CURRENT_USER_ID = 'user-123'; // Replace with actual user ID from session/auth

export default function BookmarksRoute() {
    return <BookmarksPage userId={CURRENT_USER_ID} />;
}
