/**
 * Route Handler-এর ছোট সহায়ক ফাংশন (শুধু সার্ভারে)।
 */
import { NextResponse } from 'next/server';
import type { LaravelResult } from './laravel';

/**
 * CSRF রোধ: POST রিকোয়েস্ট শুধু আমাদের নিজের সাইট থেকেই আসতে পারবে।
 * অন্য কোনো ওয়েবসাইট ইউজারের ব্রাউজার ব্যবহার করে লগইন/লগআউট করাতে পারবে না।
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function asString(value: unknown, maxLength = 255): string {
  return typeof value === 'string' ? value.slice(0, maxLength) : '';
}

export function deviceName(request: Request): string {
  const userAgent = request.headers.get('user-agent') ?? 'unknown';
  return `Web: ${userAgent}`.slice(0, 100);
}

export function forbidden(): NextResponse {
  return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 });
}

export function badRequest(): NextResponse {
  return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
}

/** Laravel-এর Error হুবহু (কিন্তু শুধু নিরাপদ অংশ) ব্রাউজারে ফেরত */
export function passError<T>(result: LaravelResult<T>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: result.body.message,
      ...(result.body.errors ? { errors: result.body.errors } : {}),
    },
    { status: result.status >= 400 ? result.status : 500 },
  );
}
