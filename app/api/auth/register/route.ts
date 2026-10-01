import { NextResponse, type NextRequest } from 'next/server';
import type { AuthUser } from '../../../../lib/auth-client';
import { asString, badRequest, deviceName, forbidden, isSameOrigin, passError, readJsonObject } from '../../../../lib/server/http';
import { laravelFetch } from '../../../../lib/server/laravel';
import { setSessionToken } from '../../../../lib/server/session';

/** POST /api/auth/register — নতুন অ্যাকাউন্ট খুলে সাথে সাথে লগইন */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return forbidden();

  const input = await readJsonObject(request);
  if (!input) return badRequest();

  const result = await laravelFetch<{ user: AuthUser; token: string }>('/auth/register', {
    method: 'POST',
    body: {
      name: asString(input.name, 100),
      email: asString(input.email, 191),
      password: asString(input.password, 255),
      password_confirmation: asString(input.password_confirmation, 255),
      device_name: deviceName(request),
    },
    request,
  });

  const data = result.body.data;
  if (result.status !== 201 || !data?.token) {
    return passError(result);
  }

  await setSessionToken(data.token);

  return NextResponse.json(
    { success: true, message: result.body.message, data: { user: data.user } },
    { status: 201 },
  );
}
