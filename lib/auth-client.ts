/**
 * ব্রাউজার → Next.js-এর নিজস্ব /api/auth/* রুট।
 * এখানে কোনো Token নেই — সেশন HttpOnly কুকিতে, ব্রাউজার নিজে থেকে পাঠায়।
 */

export interface AuthUser {
  name: string;
  email: string;
  email_verified: boolean;
  avatar_url: string | null;
  locale: string;
  timezone: string;
  settings: Record<string, unknown>;
  created_at: string | null;
}

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

async function request<T>(url: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });

    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
      data?: T;
      errors?: Record<string, string[]>;
    };

    return {
      ok: response.ok,
      status: response.status,
      message: body.message ?? (response.ok ? 'OK' : 'Something went wrong.'),
      data: body.data,
      errors: body.errors,
    };
  } catch {
    return { ok: false, status: 0, message: 'Network error. Please check your connection.' };
  }
}

export const authApi = {
  me: () => request<{ user: AuthUser }>('/api/auth/me'),

  login: (email: string, password: string) =>
    request<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, passwordConfirmation: string) =>
    request<{ user: AuthUser }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    }),

  logout: () => request<null>('/api/auth/logout', { method: 'POST' }),
};
