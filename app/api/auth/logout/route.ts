import { NextResponse, type NextRequest } from 'next/server';
import { forbidden, isSameOrigin } from '../../../../lib/server/http';
import { laravelFetch } from '../../../../lib/server/laravel';
import { clearSession, getSessionToken } from '../../../../lib/server/session';

/** POST /api/auth/logout — Laravel-এ Token বাতিল + কুকি মুছে ফেলা */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return forbidden();

  const token = await getSessionToken();
  if (token) {
    await laravelFetch('/auth/logout', { method: 'POST', token, request });
  }

  await clearSession();

  return NextResponse.json({ success: true, message: 'Logged out.' });
}
