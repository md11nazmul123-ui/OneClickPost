import { NextResponse, type NextRequest } from 'next/server';
import type { AuthUser } from '../../../../lib/auth-client';
import { asString, badRequest, deviceName, forbidden, isSameOrigin, passError, readJsonObject } from '../../../../lib/server/http';
import { laravelFetch } from '../../../../lib/server/laravel';
import { setSessionToken } from '../../../../lib/server/session';

/** POST /api/auth/login — Laravel-এ লগইন করে Token HttpOnly কুকিতে রাখে */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return forbidden();

  const input = await readJsonObject(request);
  if (!input) return badRequest();

  const result = await laravelFetch<{ user: AuthUser; token: string }>('/auth/login', {
    method: 'POST',
    body: {
      email: asString(input.email, 191),
      password: asString(input.password, 255),
      device_name: deviceName(request),
    },
    request,
  });

  const data = result.body.data;
  if (result.status !== 200 || !data?.token) {
    return passError(result);
  }

  await setSessionToken(data.token);

  // Token কখনো ব্রাউজারে পাঠানো হয় না — শুধু ইউজারের তথ্য
  return NextResponse.json({ success: true, message: result.body.message, data: { user: data.user } });
}
