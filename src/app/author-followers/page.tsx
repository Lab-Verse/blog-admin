'use client';

import React from 'react';
import AuthorFollowersPage from '@/components/author-followers/pages/AuthorFollowersPage';
import { useGetAuthorFollowersQuery, useUnfollowAuthorMutation } from '@/redux/api/authorfollower/authorFollowersApi';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAuthorFollowersList,
    selectAuthorFollowersLoading,
    selectAuthorFollowersTotal,
    selectAuthorFollowersPage,
    selectAuthorFollowersLimit,
} from '@/redux/selectors/authorfollower/authorFollowersSelectors';
import { setAuthorFollowersPage } from '@/redux/slices/authorfollower/authorFollowersSlice';

export default function Page() {
    const dispatch = useDispatch();

    const page = useSelector(selectAuthorFollowersPage);
    const limit = useSelector(selectAuthorFollowersLimit);

    // Fetch followers with pagination
    useGetAuthorFollowersQuery({ page, limit });

    const followers = useSelector(selectAuthorFollowersList);
    const isLoading = useSelector(selectAuthorFollowersLoading);
    const total = useSelector(selectAuthorFollowersTotal);

    const [unfollowAuthor] = useUnfollowAuthorMutation();

    const handleUnfollow = async (id: string) => {
        try {
            await unfollowAuthor(id).unwrap();
        } catch (error) {
            console.error('Failed to unfollow:', error);
            alert('Failed to remove follower relationship');
        }
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setAuthorFollowersPage(newPage));
    };

    return (
        <AuthorFollowersPage
            followers={followers}
            isLoading={isLoading}
            total={total}
            page={page}
            limit={limit}
            onUnfollow={handleUnfollow}
            onPageChange={handlePageChange}
        />
    );
}
