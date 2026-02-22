'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initAuth } from '@/redux/slices/auth/authSlice';

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return null;
}
