"use client";

import { QuestionsPage } from '@/components/questions';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUserId, selectAuthLoading, selectIsAuthenticated, selectAccessToken } from '@/redux/selectors/auth/authSelectors';

export default function QuestionsRoute() {
    const userId = useAppSelector(selectCurrentUserId);
    const isAuthLoading = useAppSelector(selectAuthLoading);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const accessToken = useAppSelector(selectAccessToken);

    return <QuestionsPage userId={userId} isUserLoading={isAuthLoading} />;
}
