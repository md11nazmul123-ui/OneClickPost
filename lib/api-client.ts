import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // If running in browser and NEXT_PUBLIC_API_URL is not explicitly pointing to an external domain
    if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return '/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Interceptor for attaching user bearer tokens or handling 401 unauthenticated
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface BroadcastPayload {
  title: string;
  caption: string;
  hashtags: string[];
  video?: File;
  video_url?: string;
  scheduled_at?: string | null;
  platforms: string[];
  platform_account_ids: Record<string, string>;
  platform_overrides?: Record<string, any>;
}

export interface DailyTrendItem {
  date: string;
  label: string;
  weekday: string;
  total_posts: number;
  youtube_posts: number;
  facebook_posts: number;
  instagram_posts: number;
  tiktok_posts: number;
  x_posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  total_interactions: number;
  engagement_rate: number;
  platform_views: Record<string, number>;
  platform_engagement: Record<string, number>;
}

export interface DailyTrendsResponse {
  success: boolean;
  data: {
    days: number;
    period_label: string;
    trend_data: DailyTrendItem[];
    summary: {
      total_posts: number;
      total_views: number;
      total_likes: number;
      total_shares: number;
      total_comments: number;
      total_interactions: number;
      avg_daily_posts: number;
      avg_engagement_rate: number;
      peak_post_day: { date: string; volume: number } | null;
      peak_engagement_day: { date: string; interactions: number } | null;
      top_platform: string;
      growth_rate: string;
    };
    platforms: Array<{ key: string; name: string; color: string }>;
    source: string;
  };
}

export interface AudienceAgeItem {
  range: string;
  percent: number;
  count_label: string;
}

export interface AudienceCountryItem {
  country: string;
  code: string;
  flag: string;
  percent: number;
  viewers: string;
}

export interface AudienceGenderItem {
  type: string;
  percent: number;
}

export interface AudienceDeviceItem {
  device: string;
  percent: number;
  icon: string;
}

export interface AudienceCategoryItem {
  category: string;
  percent: number;
  description: string;
}

export interface AudienceInsightData {
  platform: string;
  platform_name: string;
  badge_color: string;
  total_views: string;
  active_followers: string;
  growth_rate: string;
  avg_watch_time: string;
  retention_rate: string;
  peak_hours: string;
  dominant_age_bracket: string;
  top_country_name: string;
  summary: string;
  age_distribution: AudienceAgeItem[];
  country_distribution: AudienceCountryItem[];
  gender_split: AudienceGenderItem[];
  device_breakdown: AudienceDeviceItem[];
  categories: AudienceCategoryItem[];
  source: string;
  timestamp: string;
}

export interface AudienceInsightResponse {
  success: boolean;
  data: AudienceInsightData;
}

export const postService = {
  getPosts: async (status?: string) => {
    const { data } = await apiClient.get('/posts', { params: { status } });
    return data;
  },

  getDailyTrends: async (days: number = 14): Promise<DailyTrendsResponse> => {
    const { data } = await apiClient.get('/analytics/daily-trends', { params: { days } });
    return data;
  },

  getAudienceInsights: async (platform: string = 'all'): Promise<AudienceInsightResponse> => {
    try {
      const { data } = await apiClient.get('/analytics/audience-insights', { params: { platform } });
      return data;
    } catch (err) {
      console.warn('Fallback: generating resilient mock audience insights:', err);
      // Realistic simulated mock API response with minor delay
      await new Promise((r) => setTimeout(r, 350));
      return {
        success: true,
        data: {
          platform,
          platform_name: platform === 'all' ? 'All Connected Platforms (Aggregated)' : `${platform.toUpperCase()} Channel`,
          badge_color: '#06B6D4',
          total_views: '482,900',
          active_followers: '247.3K Total Audience',
          growth_rate: '+22.4%',
          avg_watch_time: '2m 15s',
          retention_rate: '71.2%',
          peak_hours: '7:00 PM – 11:30 PM (Global)',
          dominant_age_bracket: '18–24 years (39%)',
          top_country_name: 'United States (36%)',
          summary: 'Strong cross-platform viewership powered by young adult tech enthusiasts and global travel content consumers.',
          age_distribution: [
            { range: '13–17', percent: 12, count_label: '58.0K' },
            { range: '18–24', percent: 39, count_label: '188.3K' },
            { range: '25–34', percent: 34, count_label: '164.2K' },
            { range: '35–44', percent: 11, count_label: '53.1K' },
            { range: '45+', percent: 4, count_label: '19.3K' },
          ],
          country_distribution: [
            { country: 'United States', code: 'US', flag: '🇺🇸', percent: 36, viewers: '173.8K' },
            { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 24, viewers: '115.9K' },
            { country: 'India', code: 'IN', flag: '🇮🇳', percent: 18, viewers: '86.9K' },
            { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 12, viewers: '57.9K' },
            { country: 'Canada', code: 'CA', flag: '🇨🇦', percent: 10, viewers: '48.3K' },
          ],
          gender_split: [
            { type: 'Male', percent: 58 },
            { type: 'Female', percent: 39 },
            { type: 'Other / Non-binary', percent: 3 },
          ],
          device_breakdown: [
            { device: 'Mobile Phones', percent: 72, icon: '📱' },
            { device: 'Desktop / Laptop', percent: 21, icon: '🖥️' },
            { device: 'Smart TVs / Tablets', percent: 7, icon: '📺' },
          ],
          categories: [
            { category: 'Technology & AI Tools', percent: 38, description: 'Software developers, AI builders, and tech enthusiasts' },
            { category: 'Cinematic Travel & Nature', percent: 30, description: 'Scenic 4K drone cinematography and landscape exploration' },
            { category: 'Creator Tips & Workflows', percent: 18, description: 'Multi-platform growth strategies and studio gear' },
            { category: 'Viral Entertainment', percent: 14, description: 'Engaging short-form hooks and community reels' },
          ],
          source: 'Mock REST Client Fallback',
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  getDashboardStats: async () => {
    const { data } = await apiClient.get('/dashboard/stats');
    return data;
  },

  createPost: async (payload: BroadcastPayload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('caption', payload.caption);

    payload.hashtags.forEach((tag, idx) => {
      formData.append(`hashtags[${idx}]`, tag);
    });

    payload.platforms.forEach((p, idx) => {
      formData.append(`platforms[${idx}]`, p);
    });

    Object.entries(payload.platform_account_ids).forEach(([p, id]) => {
      formData.append(`platform_account_ids[${p}]`, id);
    });

    if (payload.video) {
      formData.append('video', payload.video);
    } else if (payload.video_url) {
      formData.append('video_url', payload.video_url);
    }

    if (payload.scheduled_at) {
      formData.append('scheduled_at', payload.scheduled_at);
    }

    if (payload.platform_overrides) {
      formData.append('platform_overrides', JSON.stringify(payload.platform_overrides));
    }

    const { data } = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getPostStatus: async (id: string) => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data;
  },

  retryDelivery: async (deliveryId: string) => {
    const { data } = await apiClient.post(`/deliveries/${deliveryId}/retry`);
    return data;
  },

  generateCaption: async (params: {
    title: string;
    platforms?: string[];
    language?: string;
    tone?: string;
  }) => {
    const { data } = await apiClient.post('/ai/generate-caption', {
      title: params.title,
      platforms: params.platforms || ['youtube', 'facebook', 'instagram', 'tiktok', 'x'],
      language: params.language || 'en',
      tone: params.tone || 'viral',
    });
    return data;
  },
};
