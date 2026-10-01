'use client';

import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import type { ScreenId } from '../types';

/** লগইন ছাড়া যে স্ক্রিনগুলো দেখা যায় */
const PUBLIC_SCREENS: ScreenId[] = ['splash', 'welcome', 'login', 'register'];

/**
 * পাহারাদার: লগইন না থাকলে ভেতরের কোনো স্ক্রিনে ঢোকা যাবে না,
 * আর লগইন থাকলে Welcome/Login-এ না থেকে সরাসরি Dashboard।
 */
export function AuthGate() {
  const { status, user } = useAuth();
  const { screen, navigateTo, updateUser } = useApp();

  // সার্ভার থেকে আসা আসল নাম/ইমেইল অ্যাপে বসানো
  useEffect(() => {
    if (user) {
      updateUser({ name: user.name, email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (status === 'authenticated' && PUBLIC_SCREENS.includes(screen)) {
      navigateTo('dashboard');
    }
    if (status === 'guest' && !PUBLIC_SCREENS.includes(screen)) {
      navigateTo('welcome');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, screen]);

  return null;
}
