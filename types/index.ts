export type PlatformId = 'youtube' | 'facebook' | 'instagram' | 'tiktok';

export type ScreenId = 
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'create'
  | 'platforms'
  | 'platformSettings'
  | 'schedule'
  | 'uploading'
  | 'success'
  | 'accounts'
  | 'connect'
  | 'accountDetail'
  | 'scheduled'
  | 'postDetail'
  | 'drafts'
  | 'settings'
  | 'profile'
  | 'notifications'
  | 'language'
  | 'help'
  | 'about'
  | 'analytics';

export type LanguageCode = 'en' | 'bn';

export type ThemeMode = 'night' | 'dark' | 'smooth' | 'light';

export interface SocialAccount {
  id: string;
  platform: PlatformId;
  name: string;
  handle: string;
  avatar: string;
  connected: boolean;
  followers: string;
  postsCount: number;
  engagement: string;
  tokenExpiresIn?: string;
  scopes?: string[];
  accountLabel?: string; // e.g. "Main Channel", "Gaming Channel", "Brand Page"
  comingSoon?: boolean; // প্ল্যাটফর্ম এখনো চালু হয়নি (নিজ ধাপে আসল হবে)
}

export interface PlatformSpecificContent {
  title?: string;
  description?: string;
  caption?: string;
  hashtags: string[];
}

export interface PlatformUploadStatus {
  status: 'pending' | 'uploading' | 'published' | 'failed';
  url?: string;
  error?: string;
  progress?: number;
  accountId?: string;
  accountName?: string;
  accountHandle?: string;
}

export interface PostItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  videoFileName: string;
  videoDuration?: string;
  videoSize?: string;
  thumbnailUrl?: string;
  selectedPlatforms: PlatformId[];
  selectedAccountIds?: string[]; // IDs of specific accounts selected (multi-account per platform)
  platformSettings: Partial<Record<PlatformId, PlatformSpecificContent>>;
  status: 'published' | 'scheduled' | 'draft' | 'uploading' | 'failed';
  publishType: 'now' | 'schedule';
  scheduledDate?: string;
  scheduledTime?: string;
  platformResults: Partial<Record<string, PlatformUploadStatus>>; // key can be platform or accountId
  createdAt: string;
  updatedAt: string;
  viewsTotal?: number;
  likesTotal?: number;
}

export interface DraftItem {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  videoFileName: string;
  thumbnailUrl?: string;
  selectedPlatforms: PlatformId[];
  selectedAccountIds?: string[];
  platformSettings: Partial<Record<PlatformId, PlatformSpecificContent>>;
  lastEdited: string;
}

export interface NotificationItem {
  id: string;
  type: 'publish_success' | 'upload_failed' | 'schedule_reminder' | 'account_connected';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  postId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  bio: string;
  plan?: string;
}

export interface NotificationSettings {
  publishSuccess: boolean;
  uploadFailed: boolean;
  scheduledReminder: boolean;
  newAccountConnected: boolean;
}
