import { NextResponse, type NextRequest } from 'next/server';
import { badRequest, forbidden, isSameOrigin } from '../../../../lib/server/http';
import { laravelFetch } from '../../../../lib/server/laravel';
import { clearSession, getSessionToken } from '../../../../lib/server/session';

/**
 * /api/backend/* → Laravel /api/v1/*
 * ব্রাউজার কখনো Token দেখে না; Next.js সার্ভার কুকি থেকে Token নিয়ে Laravel-এ পাঠায়।
 * (লগইন/লগআউট এখান দিয়ে না — সেগুলোর জন্য আলাদা /api/auth/* রুট আছে)
 */

const MAX_BODY_BYTES = 1024 * 1024; // JSON বডি সর্বোচ্চ ১ MB (ভিডিও এখান দিয়ে যায় না)

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const method = request.method as Method;

  if (method !== 'GET' && !isSameOrigin(request)) {
    return forbidden();
  }

  const { path } = await context.params;
  const segmentPattern = /^[A-Za-z0-9_-]+$/;
  if (path.length === 0 || path.some((segment) => !segmentPattern.test(segment)) || path[0] === 'auth') {
    return badRequest();
  }

  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthenticated.' }, { status: 401 });
  }

  let body: unknown;
  if (method !== 'GET' && method !== 'DELETE') {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ success: false, message: 'Request too large.' }, { status: 413 });
    }
    if (raw.length > 0) {
      try {
        body = JSON.parse(raw);
      } catch {
        return badRequest();
      }
    }
  }

  const result = await laravelFetch(`/${path.join('/')}${request.nextUrl.search}`, {
    method,
    body,
    token,
    request,
  });

  if (result.status === 401) {
    await clearSession();
  }

  return NextResponse.json(result.body, { status: result.status });
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
