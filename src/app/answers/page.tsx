import { AnswersPage } from '@/components/answers';

// Example: Show answers for a specific question
const QUESTION_ID = 'question-123'; // Replace with actual question ID

export default function AnswersRoute() {
    return <AnswersPage questionId={QUESTION_ID} />;
}
