import { NextResponse, type NextRequest } from 'next/server';
import type { AuthUser } from '../../../../lib/auth-client';
import { passError } from '../../../../lib/server/http';
import { laravelFetch } from '../../../../lib/server/laravel';
import { clearSession, getSessionToken } from '../../../../lib/server/session';

/** GET /api/auth/me — বর্তমানে লগইন করা ইউজার (না থাকলে 401) */
export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthenticated.' }, { status: 401 });
  }

  const result = await laravelFetch<{ user: AuthUser }>('/auth/me', { token, request });

  if (result.status === 401) {
    await clearSession(); // মেয়াদ শেষ / বাতিল Token
  }

  if (result.status !== 200 || !result.body.data) {
    return passError(result);
  }

  return NextResponse.json({ success: true, message: 'OK', data: { user: result.body.data.user } });
}
