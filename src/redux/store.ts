// src/app/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/query";

// Import reducers
import authReducer from './slices/auth/authSlice';
import answersReducer from './slices/answer/answersSlice';
import auditlogsReducer from './slices/auditlog/auditLogsSlice';
import authorFollowersRedducer from './slices/authorfollower/authorFollowersSlice';
import bookmarksReducer from './slices/bookmark/bookmarksSlice';
import categoriesReducer from './slices/category/categoriesSlice';
import categoryFollowersReducer from './slices/categoryfollower/categoryFollowersSlice';
import commentRepliesReducer from './slices/commentreplies/commentRepliesSlice';
import commentsReducer from './slices/comment/commentsSlice';
import draftsReducer from './slices/draft/draftsSlice';
import mediaReducer from './slices/media/mediaSlice';
import { notificationsReducer } from './slices/notification/notifications.slice';
import { permissionsReducer } from './slices/permission/permissions.slice';
import { postMediaReducer } from './slices/postmedia/postMedia.slice';
import {postsReducer } from './slices/post/posts.slice';
import { postTagsReducer } from './slices/posttag/postTags.slice';
import { questionsReducer } from './slices/question/questions.slice';
import {reactionsReducer } from './slices/reaction/reactions.slice';
import { reportsReducer } from './slices/report/reports.slice';
import { rolePermissionsReducer } from './slices/rolepermission/rolePermissions.slice';
import {rolesReducer } from './slices/role/roles.slice';
import tagsReducer from './slices/tags/tagsSlice';
import usersReducer from './slices/user/usersSlice';
import viewsReducer from './slices/view/viewsSlice';

// Import API's
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    
    auth: authReducer,
    users: usersReducer,
    answers: answersReducer,
    auditLogs: auditlogsReducer,
    authorFollowers: authorFollowersRedducer,
    bookmarks: bookmarksReducer,
    categories: categoriesReducer,
    categoryFollowers: categoryFollowersReducer,
    commentReplies: commentRepliesReducer,
    comments: commentsReducer,
    drafts: draftsReducer,
    media: mediaReducer,
    notifications: notificationsReducer,
    permissions: permissionsReducer,
    postMedia: postMediaReducer,
    posts: postsReducer,
    postTags: postTagsReducer,
    questions: questionsReducer,
    reactions: reactionsReducer,
    reports: reportsReducer,
    rolePermissions: rolePermissionsReducer,
    roles: rolesReducer,
    tags: tagsReducer,
    views: viewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
    ),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: {},
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


