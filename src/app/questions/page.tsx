import { QuestionsPage } from '@/components/questions';

// Example: Get user ID from your auth system
const CURRENT_USER_ID = 'user-123'; // Replace with actual user ID from session/auth

export default function QuestionsRoute() {
    return <QuestionsPage userId={CURRENT_USER_ID} />;
}
