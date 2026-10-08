/**
 * YouTube-এর আসল হিসাব (views, likes, subscribers) — Next.js BFF দিয়ে Laravel থেকে।
 */

export interface AnalyticsChannel {
  account_id: string;
  name: string;
  avatar_url: string | null;
  status: string;
  subscribers: number | null;
  subscribers_change_7d: number | null;
  total_views: number | null;
  video_count: number | null;
}

export interface AnalyticsPost {
  post_id: string;
  title: string | null;
  url: string | null;
  published_at: string | null;
  views: number;
  likes: number;
  comments: number;
}

export interface AnalyticsSummary {
  synced_at: string | null;
  totals: { posts: number; views: number; likes: number; comments: number };
  daily_views: { date: string; views: number }[];
  channels: AnalyticsChannel[];
  posts: AnalyticsPost[];
}

interface ApiBody<T> {
  message?: string;
  data?: T;
}

async function call(path: string, method: 'GET' | 'POST' = 'GET'): Promise<AnalyticsSummary> {
  let response: Response;
  try {
    response = await fetch(`/api/backend/${path}`, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
  } catch {
    throw new Error('Network error. Please check your connection.');
  }
  const json = (await response.json().catch(() => ({}))) as ApiBody<AnalyticsSummary>;
  if (!response.ok || !json.data) {
    throw new Error(json.message || 'Could not load stats. Please try again.');
  }
  return json.data;
}

export const analyticsApi = {
  get: () => call('analytics'),
  refresh: () => call('analytics/refresh', 'POST'),
};

/** 1234 → "1.2K", 1500000 → "1.5M" */
export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace(/\.0$/, '')}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K`;
  return String(value);
}

/** "5 minutes ago" ধরনের লেখা */
export function timeAgo(iso: string | null): string {
  if (!iso) return 'never';
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}
