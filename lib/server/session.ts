/**
 * লগইন সেশন (শুধু সার্ভারে ব্যবহার হবে — কখনো 'use client' ফাইলে import করা যাবে না)।
 *
 * Laravel-এর দেওয়া Token ব্রাউজারের JavaScript কখনো দেখতে পায় না —
 * এটা HttpOnly কুকিতে থাকে, তাই XSS হলেও Token চুরি করা যায় না।
 */
import { cookies } from 'next/headers';

const isProduction = process.env.NODE_ENV === 'production';

// Production-এ "__Host-" prefix: শুধু HTTPS, শুধু এই ডোমেইন, Path=/ — সবচেয়ে কড়া কুকি নিয়ম
export const SESSION_COOKIE = isProduction ? '__Host-ocp_session' : 'ocp_session';

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // ৩০ দিন (Laravel token-এর মেয়াদের সমান)

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
    priority: 'high',
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
