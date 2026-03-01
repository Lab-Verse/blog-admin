'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initAuth } from '@/redux/slices/auth/authSlice';
import { RootState } from '@/redux/store';

export default function AuthInitializer() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  // Fetch user if token exists but user is not loaded
  useEffect(() => {
    if (accessToken && !user) {
      // The token exists from cookies but user data is not in Redux.
      // This is normal - user data is populated during login.
      // The backend will use JWT to authenticate requests.
    }
  }, [accessToken, user]);

  return null;
}
