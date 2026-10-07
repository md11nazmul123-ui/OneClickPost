/**
 * কানেক্ট করা সোশ্যাল অ্যাকাউন্ট (এখন YouTube) — সব কাজ Next.js BFF (/api/backend/*) দিয়ে।
 * ব্রাউজার কখনো কোনো Token দেখে না; Token থাকে শুধু Laravel ডাটাবেসে, এনক্রিপ্টেড।
 */

import type { SocialAccount } from '../types';

export interface ServerSocialAccount {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'tiktok';
  account_name: string;
  username: string | null;
  account_type: string | null;
  avatar_url: string | null;
  status: 'active' | 'expired' | 'revoked' | 'error';
  subscriber_count: number | null;
  video_count: number | null;
  connected_at: string | null;
  last_synced_at: string | null;
}

export class SocialApiError extends Error {}

interface ApiBody<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

async function backend<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path}`, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
  } catch {
    throw new SocialApiError('Network error. Please check your connection.');
  }

  const body = (await response.json().catch(() => ({}))) as ApiBody<T>;
  if (!response.ok) {
    const firstFieldError = body.errors ? Object.values(body.errors)[0]?.[0] : undefined;
    throw new SocialApiError(firstFieldError ?? body.message ?? 'Something went wrong.');
  }
  return body.data as T;
}

export const socialApi = {
  list: async () => (await backend<{ items: ServerSocialAccount[] }>('social-accounts')).items,

  /** Google-এর অনুমতি পেজের লিংক */
  startYouTube: async () =>
    (await backend<{ url: string }>('oauth/youtube/start', { method: 'POST', body: '{}' })).url,

  /** Google থেকে ফিরে আসার পর টিকিট জমা দিয়ে চ্যানেল সেভ */
  completeYouTube: async (ticket: string) =>
    (
      await backend<{ account: ServerSocialAccount }>('oauth/youtube/complete', {
        method: 'POST',
        body: JSON.stringify({ ticket }),
      })
    ).account,

  disconnect: (id: string) => backend<null>(`social-accounts/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

/** শুধু Google-এর আসল লগইন পেজে পাঠানো হবে — অন্য কোনো ঠিকানায় না (open-redirect রোধ) */
export function isTrustedGoogleAuthUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'accounts.google.com';
  } catch {
    return false;
  }
}

function formatCount(value: number | null): string {
  if (value === null) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(value);
}

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e2e8f0"/><circle cx="32" cy="25" r="11" fill="#94a3b8"/><path d="M12 56c3-11 11-17 20-17s17 6 20 17" fill="#94a3b8"/></svg>'
  );

/** সার্ভারের অ্যাকাউন্টকে অ্যাপের স্ক্রিনগুলোর ফরম্যাটে রূপান্তর */
export function toAppAccount(account: ServerSocialAccount): SocialAccount {
  const active = account.status === 'active';

  return {
    id: account.id,
    platform: account.platform,
    name: account.account_name,
    handle: account.username ?? account.account_name,
    avatar: account.avatar_url ?? DEFAULT_AVATAR,
    connected: active,
    followers: formatCount(account.subscriber_count),
    postsCount: account.video_count ?? 0,
    engagement: '—',
    tokenExpiresIn: active ? 'Auto-renew' : 'Reconnect needed',
    scopes: ['youtube.upload', 'youtube.readonly'],
    accountLabel: account.account_type === 'channel' ? 'YouTube Channel' : undefined,
  };
}

export interface OAuthReturn {
  platform: string;
  ticket?: string;
  error?: string;
}

let oauthReturnCache: OAuthReturn | null | undefined;

/**
 * Google থেকে ফিরে আসার পর URL-এর # অংশ থেকে ফলাফল পড়া (তারপর URL পরিষ্কার)।
 * প্রথমবার পড়া ফলাফল মনে রাখা হয়, যাতে React দুবার রেন্ডার করলেও টিকিট হারিয়ে না যায়।
 */
export function readOAuthReturn(): OAuthReturn | null {
  if (oauthReturnCache === undefined) {
    oauthReturnCache = parseOAuthReturn();
  }
  return oauthReturnCache;
}

function parseOAuthReturn(): OAuthReturn | null {
  if (typeof window === 'undefined' || !window.location.hash.includes('oauth=')) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const platform = params.get('oauth');

  // টিকিট যেন ব্রাউজারের ইতিহাসে না থাকে
  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  if (!platform) return null;

  const ticket = params.get('ticket') ?? undefined;
  const error = params.get('error') ?? undefined;

  return {
    platform,
    ticket: ticket && /^[A-Za-z0-9]{64}$/.test(ticket) ? ticket : undefined,
    error: error && /^[a-z_]{1,40}$/.test(error) ? error : undefined,
  };
}

export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  cancelled: 'YouTube connection was cancelled.',
  expired: 'The connection took too long. Please try again.',
  invalid_state: 'The connection link was invalid. Please try again.',
  invalid_request: 'The connection link was invalid. Please try again.',
  missing_permission: 'Please allow all requested YouTube permissions (upload and view) and try again.',
  no_channel: 'This Google account has no YouTube channel. Create a channel on YouTube first, then connect again.',
  network: 'Could not reach YouTube. Please try again.',
  provider_error: 'YouTube rejected the connection. Please try again.',
  invalid_grant: 'The YouTube approval expired. Please try again.',
  not_configured: 'YouTube connection is not set up on the server yet.',
  failed: 'Could not connect YouTube. Please try again.',
};
