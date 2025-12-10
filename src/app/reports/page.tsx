import { ReportsPage } from '@/components/reports';

// Example: Moderator ID from auth system
const MODERATOR_ID = 'moderator-123'; // Replace with actual moderator ID from session/auth

export default function ReportsRoute() {
    return <ReportsPage moderatorId={MODERATOR_ID} />;
}
