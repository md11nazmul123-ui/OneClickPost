export type PlatformId = 'youtube' | 'facebook' | 'instagram' | 'tiktok' | 'x' | 'pinterest' | 'linkedin';

export type ScreenId = 
  | 'splash'
  | 'welcome'
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
  | 'analytics'
  | 'scheduled'
  | 'postDetail'
  | 'drafts'
  | 'settings'
  | 'profile'
  | 'notifications'
  | 'language'
  | 'help'
  | 'about'
  | 'fullstack'
  | 'aiRequest'
  | 'bulk'
  | 'inbox'
  | 'cloudImport';

export type LanguageCode = 
  | 'en' 
  | 'bn' 
  | 'hi' 
  | 'ar' 
  | 'zh' 
  | 'ja' 
  | 'ar-eg' 
  | 'pt' 
  | 'fa' 
  | 'ur'
  | 'ko';

export type ThemeMode = 'night' | 'dark' | 'smooth' | 'light';

export type VideoAspectRatio = 'original' | '9:16' | '16:9' | '1:1' | '4:5';
export type VideoFitMode = 'cover' | 'contain-blur' | 'contain-black';

export interface VideoFormatSettings {
  aspectRatio: VideoAspectRatio;
  fitMode: VideoFitMode;
  trimRange: [number, number];
  durationSeconds: number;
}

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
  repeat?: boolean;
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
