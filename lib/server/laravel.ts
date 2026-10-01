/**
 * Next.js সার্ভার → Laravel API কল (শুধু সার্ভারে)।
 * ব্রাউজার কখনো সরাসরি Laravel-এ যায় না।
 */

const BASE_URL = (process.env.LARAVEL_API_URL ?? 'http://127.0.0.1:8000/api/v1').replace(/\/+$/, '');

export interface LaravelBody<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface LaravelResult<T> {
  status: number;
  body: LaravelBody<T>;
}

interface LaravelFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  /** আসল ইউজারের IP ও ব্রাউজার তথ্য Laravel-এ পাঠানোর জন্য (Rate limit ও Audit log) */
  request?: Request;
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || null;
  }
  return request.headers.get('x-real-ip');
}

export async function laravelFetch<T>(path: string, options: LaravelFetchOptions = {}): Promise<LaravelResult<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  if (options.request) {
    const ip = clientIp(options.request);
    if (ip) headers['X-Forwarded-For'] = ip;
    const userAgent = options.request.headers.get('user-agent');
    if (userAgent) headers['User-Agent'] = userAgent.slice(0, 255);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return {
      status: 503,
      body: { success: false, message: 'Service temporarily unavailable. Please try again.' },
    };
  }

  let body: LaravelBody<T>;
  try {
    body = (await response.json()) as LaravelBody<T>;
  } catch {
    body = { success: response.ok, message: response.ok ? 'OK' : 'Unexpected server response.' };
  }

  return { status: response.status, body };
}
