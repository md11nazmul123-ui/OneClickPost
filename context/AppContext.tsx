'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ScreenId,
  PlatformId,
  LanguageCode,
  ThemeMode,
  VideoAspectRatio,
  VideoFitMode,
  SocialAccount,
  PostItem,
  DraftItem,
  NotificationItem,
  UserProfile,
  NotificationSettings,
  PlatformSpecificContent,
  PlatformUploadStatus,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_ACCOUNTS,
  INITIAL_POSTS,
  INITIAL_DRAFTS,
  INITIAL_NOTIFICATIONS,
  SAMPLE_VIDEOS,
} from '../data/initialData';
import { translations } from '../data/translations';

interface AppContextType {
  // Navigation
  screen: ScreenId;
  navigateTo: (s: ScreenId) => void;
  goBack: () => void;
  historyStack: ScreenId[];

  // Language & i18n
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;

  // Global Theme
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // User Profile
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;

  // Active Post Creation
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoUrl: string;
  videoFileName: string;
  videoDuration: string;
  setVideoDuration: (dur: string) => void;
  videoSize: string;
  thumbnailUrl: string;
  videoAspectRatio: VideoAspectRatio;
  setVideoAspectRatio: (ratio: VideoAspectRatio) => void;
  videoFitMode: VideoFitMode;
  setVideoFitMode: (mode: VideoFitMode) => void;
  videoTrimRange: [number, number];
  setVideoTrimRange: (range: [number, number]) => void;
  caption: string;
  hashtags: string[];
  customHashtags: string;
  selectedPlatforms: PlatformId[];
  selectedAccountIds: string[];
  platformSettings: Partial<Record<PlatformId, PlatformSpecificContent>>;
  scheduledDate: string;
  scheduledTime: string;
  repeat: boolean;
  setVideoUrl: (url: string) => void;
  setVideoFileName: (name: string) => void;
  setCaption: (caption: string) => void;
  setHashtags: (tags: string[]) => void;
  setCustomHashtags: (tags: string) => void;
  togglePlatform: (platform: PlatformId) => void;
  toggleAccount: (accountId: string) => void;
  selectAllPlatforms: () => void;
  deselectAllPlatforms: () => void;
  updatePlatformSetting: (platform: PlatformId, content: Partial<PlatformSpecificContent>) => void;
  applyContentToAll: (caption: string, tags: string[]) => void;
  setScheduledDate: (date: string) => void;
  setScheduledTime: (time: string) => void;
  setRepeat: (repeat: boolean) => void;
  selectSampleVideo: (sample: typeof SAMPLE_VIDEOS[0]) => void;
  resetPostForm: () => void;

  // AI Generation
  isGeneratingAI: boolean;
  aiTone: string;
  setAiTone: (tone: string) => void;
  generateAICaption: (toneOverride?: string) => Promise<void>;
  generateAIHashtags: () => Promise<void>;

  // Upload & Publishing
  isUploading: boolean;
  uploadProgress: number;
  platformUploadStatus: Record<string, PlatformUploadStatus>;
  lastPublishedPost: PostItem | null;
  publishPostNow: () => void;
  schedulePostNow: () => void;
  retryPlatformUpload: (key: string) => void;

  // Accounts & OAuth
  accounts: SocialAccount[];
  selectedAccountDetail: SocialAccount | null;
  setSelectedAccountDetail: (acc: SocialAccount | null) => void;
  oauthModalPlatform: PlatformId | null;
  oauthTargetAccountId: string | null;
  openOAuthModal: (p: PlatformId, accountId?: string) => void;
  closeOAuthModal: () => void;
  confirmOAuthConnect: (p: PlatformId, details?: { handle?: string; accountLabel?: string; accountId?: string }) => void;
  disconnectAccount: (idOrPlatform: string) => void;
  addNewAccount: (platform: PlatformId, handle: string, label: string) => void;

  // Posts & Drafts
  posts: PostItem[];
  selectedPostDetail: PostItem | null;
  setSelectedPostDetail: (post: PostItem | null) => void;
  deletePost: (id: string) => void;
  retryPost: (id: string) => void;
  drafts: DraftItem[];
  saveCurrentAsDraft: () => void;
  loadDraft: (draft: DraftItem) => void;
  deleteDraft: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Daily Broadcast Goals
  dailyBroadcastGoal: number;
  setDailyBroadcastGoal: (goal: number) => void;
  todayBroadcastsCount: number;
  incrementTodayBroadcasts: () => void;
  decrementTodayBroadcasts: () => void;
  resetTodayBroadcasts: (val?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [screen, setScreen] = useState<ScreenId>('splash');
  const [historyStack, setHistoryStack] = useState<ScreenId[]>([]);

  // Global Theme (persists in localStorage, defaults to Day/'light')
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ocp_theme');
    if (saved === 'night' || saved === 'dark' || saved === 'smooth' || saved === 'light') {
      return saved as ThemeMode;
    }
    return 'light';
  });

  const applyTheme = (newTheme: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.remove('night', 'dark', 'smooth', 'light');
    document.documentElement.classList.add(newTheme);
    if (newTheme === 'smooth' || newTheme === 'light') {
      document.documentElement.style.colorScheme = 'light';
    } else {
      document.documentElement.style.colorScheme = 'dark';
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('ocp_theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    // Cycle: Day (default) -> Night -> Dark -> Smooth -> Day
    const nextTheme: ThemeMode =
      theme === 'light' ? 'night' :
      theme === 'night' ? 'dark' :
      theme === 'dark' ? 'smooth' : 'light';
    setTheme(nextTheme);
  };

  // Splash, Welcome, Login & Register are always shown in Day mode, whatever the user picked
  useEffect(() => {
    const alwaysDay =
      screen === 'splash' || screen === 'welcome' || screen === 'login' || screen === 'register';
    applyTheme(alwaysDay ? 'light' : theme);
  }, [theme, screen]);

  // Language
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('ocp_lang') as LanguageCode) || 'en';
  });

  const isRTL = (lang: LanguageCode) =>
    lang === 'ar' || lang === 'ar-eg' || lang === 'fa' || lang === 'ur';

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('ocp_lang', lang);
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const navigateTo = (newScreen: ScreenId) => {
    if (newScreen !== screen) {
      setHistoryStack((prev) => [...prev, screen]);
      setScreen(newScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prevScreen = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, -1));
      setScreen(prevScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setScreen('dashboard');
    }
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ocp_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('ocp_user', JSON.stringify(updated));
      return updated;
    });
  };

  // Accounts
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('ocp_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [selectedAccountDetail, setSelectedAccountDetail] = useState<SocialAccount | null>(null);
  const [oauthModalPlatform, setOauthModalPlatform] = useState<PlatformId | null>(null);
  const [oauthTargetAccountId, setOauthTargetAccountId] = useState<string | null>(null);

  const openOAuthModal = (p: PlatformId, accountId?: string) => {
    setOauthModalPlatform(p);
    setOauthTargetAccountId(accountId || null);
  };
  const closeOAuthModal = () => {
    setOauthModalPlatform(null);
    setOauthTargetAccountId(null);
  };

  const confirmOAuthConnect = (
    platform: PlatformId,
    details?: { handle?: string; accountLabel?: string; accountId?: string }
  ) => {
    const targetId = details?.accountId || oauthTargetAccountId;

    setAccounts((prev) => {
      // If reconnecting a specific existing account ID
      if (targetId) {
        return prev.map((acc) => {
          if (acc.id === targetId) {
            return {
              ...acc,
              connected: true,
              handle: details?.handle || (acc.handle === 'Not Connected' ? `@nazmul_${platform}` : acc.handle),
              accountLabel: details?.accountLabel || acc.accountLabel,
              tokenExpiresIn: '60 days',
            };
          }
          return acc;
        });
      }

      // If connecting a newly designated account or toggling existing disconnected
      const existingConnectedSame = prev.filter((a) => a.platform === platform && a.connected);
      const existingDisconnected = prev.find((a) => a.platform === platform && !a.connected);

      if (details?.handle || details?.accountLabel) {
        // Create as fresh additional account under this platform
        const newAccId = `${platform.slice(0, 2)}-${Date.now()}`;
        const newAccount: SocialAccount = {
          id: newAccId,
          platform,
          name: platform.toUpperCase(),
          handle: details.handle?.startsWith('@') ? details.handle : `@${details.handle || `channel_${Date.now().toString().slice(-4)}`}`,
          accountLabel: details.accountLabel || `Channel #${existingConnectedSame.length + 1}`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          connected: true,
          followers: '1.2K',
          postsCount: 0,
          engagement: '4.8%',
          tokenExpiresIn: '60 days',
          scopes: ['publish_content', 'read_insights'],
        };
        const updated = [...prev, newAccount];
        localStorage.setItem('ocp_accounts', JSON.stringify(updated));
        return updated;
      }

      if (existingDisconnected) {
        const updated = prev.map((acc) => {
          if (acc.id === existingDisconnected.id) {
            return {
              ...acc,
              connected: true,
              handle: acc.handle === 'Not Connected' ? `@nazmul_${platform}` : acc.handle,
              tokenExpiresIn: '60 days',
            };
          }
          return acc;
        });
        localStorage.setItem('ocp_accounts', JSON.stringify(updated));
        return updated;
      }

      // Otherwise connect first matching platform
      const updated = prev.map((acc) => {
        if (acc.platform === platform) {
          return {
            ...acc,
            connected: true,
            handle: acc.handle === 'Not Connected' ? `@nazmul_${platform}` : acc.handle,
            tokenExpiresIn: '60 days',
          };
        }
        return acc;
      });
      localStorage.setItem('ocp_accounts', JSON.stringify(updated));
      return updated;
    });

    closeOAuthModal();
    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'account_connected',
      title: 'Social Account Connected',
      message: `${platform.toUpperCase()} channel/profile linked successfully via official OAuth.`,
      time: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addNewAccount = (platform: PlatformId, handle: string, label: string) => {
    const newAccId = `${platform.slice(0, 2)}-${Date.now()}`;
    const newAccount: SocialAccount = {
      id: newAccId,
      platform,
      name: platform === 'youtube' ? 'YouTube' : platform === 'facebook' ? 'Facebook' : platform.toUpperCase(),
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      accountLabel: label || 'Additional Channel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      connected: true,
      followers: '5.4K',
      postsCount: 1,
      engagement: '6.2%',
      tokenExpiresIn: '60 days',
      scopes: ['publish_content', 'media_upload', 'manage_posts'],
    };

    setAccounts((prev) => {
      const updated = [...prev, newAccount];
      localStorage.setItem('ocp_accounts', JSON.stringify(updated));
      return updated;
    });

    // Also auto-select it for posting
    setSelectedAccountIds((prev) => [...prev, newAccId]);
    if (!selectedPlatforms.includes(platform)) {
      setSelectedPlatforms((prev) => [...prev, platform]);
    }
  };

  const disconnectAccount = (idOrPlatform: string) => {
    setAccounts((prev) => {
      const updated = prev.map((acc) => {
        if (acc.id === idOrPlatform || acc.platform === idOrPlatform) {
          return {
            ...acc,
            connected: false,
            tokenExpiresIn: 'Disconnected',
          };
        }
        return acc;
      });
      localStorage.setItem('ocp_accounts', JSON.stringify(updated));
      return updated;
    });

    setSelectedAccountIds((prev) => prev.filter((id) => id !== idOrPlatform));

    if (selectedAccountDetail?.id === idOrPlatform || selectedAccountDetail?.platform === idOrPlatform) {
      setSelectedAccountDetail((prev) => (prev ? { ...prev, connected: false } : null));
    }
  };

  // Active Post Creation state
  const [videoTitle, setVideoTitle] = useState<string>('5 Game-Changing AI Tools That Will Replace Programmers');
  const [videoUrl, setVideoUrl] = useState<string>(SAMPLE_VIDEOS[0].url);
  const [videoFileName, setVideoFileName] = useState<string>(SAMPLE_VIDEOS[0].name);
  const [videoDuration, setVideoDuration] = useState<string>(SAMPLE_VIDEOS[0].duration);
  const [videoSize, setVideoSize] = useState<string>(SAMPLE_VIDEOS[0].size);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(SAMPLE_VIDEOS[0].thumbnail);
  const [videoAspectRatio, setVideoAspectRatio] = useState<VideoAspectRatio>('original');
  const [videoFitMode, setVideoFitMode] = useState<VideoFitMode>('contain-blur');
  const [videoTrimRange, setVideoTrimRange] = useState<[number, number]>([0, 60]);
  const [caption, setCaption] = useState<string>(
    'Nature is not a place to visit, it is home. 🌿 Take a deep breath and immerse yourself in this tranquil escape.'
  );
  const [hashtags, setHashtags] = useState<string[]>(['#nature', '#travel', '#beautiful', '#wanderlust', '#explore']);
  const [customHashtags, setCustomHashtags] = useState<string>('nature, travel, beautiful');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['youtube', 'facebook', 'instagram', 'tiktok']);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(() => {
    return ['yt-1', 'yt-2', 'fb-1', 'ig-1', 'tt-1'];
  });

  const [platformSettings, setPlatformSettings] = useState<Partial<Record<PlatformId, PlatformSpecificContent>>>({
    youtube: {
      title: 'Majestic Nature Video | Beautiful World 4K',
      description: 'Explore the sublime calmness of pristine valleys. Subscribe for weekly escapes! 🌿\n\n#nature #travel #4k',
      hashtags: ['#nature', '#travel', '#beautiful'],
    },
    facebook: {
      caption: 'Nature is not a place to visit, it is home. 🌿 Would you travel here this weekend?',
      hashtags: ['#nature', '#travel', '#beautiful'],
    },
    instagram: {
      caption: 'Unreal scenery that feels straight out of a dream ✨ Tag your travel buddy and save this! ✈️📍',
      hashtags: ['#nature', '#travel', '#reels', '#explore', '#viral'],
    },
    tiktok: {
      caption: 'POV: You found the most peaceful spot on earth 🌿 #fyp #viral',
      hashtags: ['#nature', '#travel', '#viral', '#fyp'],
    },
  });
  const [scheduledDate, setScheduledDate] = useState<string>('2026-09-26');
  const [scheduledTime, setScheduledTime] = useState<string>('10:30');
  const [repeat, setRepeat] = useState<boolean>(false);
  const [aiTone, setAiTone] = useState<string>('viral');
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  // Toggle platform toggles all connected accounts under that platform
  const togglePlatform = (p: PlatformId) => {
    const isPlatformActive = selectedPlatforms.includes(p);
    const platformAccounts = accounts.filter((a) => a.platform === p && a.connected);

    if (isPlatformActive) {
      setSelectedPlatforms((prev) => prev.filter((item) => item !== p));
      setSelectedAccountIds((prev) => prev.filter((id) => !platformAccounts.some((a) => a.id === id)));
    } else {
      setSelectedPlatforms((prev) => [...prev, p]);
      const newAccIds = platformAccounts.map((a) => a.id);
      setSelectedAccountIds((prev) => Array.from(new Set([...prev, ...newAccIds])));
    }
  };

  // Toggle an individual account (e.g. YouTube channel 1 vs channel 2)
  const toggleAccount = (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;

    setSelectedAccountIds((prev) => {
      const isSelected = prev.includes(accountId);
      const nextAccIds = isSelected ? prev.filter((id) => id !== accountId) : [...prev, accountId];

      // If at least one account in this platform is selected, keep platform selected
      const hasOtherSelectedInPlatform = nextAccIds.some((id) => {
        const otherAcc = accounts.find((a) => a.id === id);
        return otherAcc?.platform === acc.platform;
      });

      setSelectedPlatforms((platPrev) => {
        if (hasOtherSelectedInPlatform && !platPrev.includes(acc.platform)) {
          return [...platPrev, acc.platform];
        }
        if (!hasOtherSelectedInPlatform && platPrev.includes(acc.platform)) {
          return platPrev.filter((p) => p !== acc.platform);
        }
        return platPrev;
      });

      return nextAccIds;
    });
  };

  const selectAllPlatforms = () => {
    const connectedOnes = accounts.filter((a) => a.connected);
    setSelectedPlatforms(Array.from(new Set(connectedOnes.map((a) => a.platform))));
    setSelectedAccountIds(connectedOnes.map((a) => a.id));
  };

  const deselectAllPlatforms = () => {
    setSelectedPlatforms([]);
    setSelectedAccountIds([]);
  };

  const updatePlatformSetting = (platform: PlatformId, content: Partial<PlatformSpecificContent>) => {
    setPlatformSettings((prev) => ({
      ...prev,
      [platform]: {
        ...(prev[platform] || { hashtags: [] }),
        ...content,
      },
    }));
  };

  const applyContentToAll = (newCaption: string, newTags: string[]) => {
    const updated: Partial<Record<PlatformId, PlatformSpecificContent>> = {};
    const platforms: PlatformId[] = ['youtube', 'facebook', 'instagram', 'tiktok', 'x', 'pinterest', 'linkedin'];
    platforms.forEach((p) => {
      updated[p] = {
        title: p === 'youtube' ? newCaption.slice(0, 70) : undefined,
        description: p === 'youtube' ? `${newCaption}\n\n${newTags.join(' ')}` : undefined,
        caption: newCaption,
        hashtags: [...newTags],
      };
    });
    setPlatformSettings(updated);
  };

  const selectSampleVideo = (sample: typeof SAMPLE_VIDEOS[0]) => {
    setVideoTitle(sample.topic);
    setVideoUrl(sample.url);
    setVideoFileName(sample.name);
    setVideoDuration(sample.duration);
    setVideoSize(sample.size);
    setThumbnailUrl(sample.thumbnail);
    setCaption(`Exploring ${sample.topic}. 🌿 Check out this stunning view!`);
  };

  const resetPostForm = () => {
    selectSampleVideo(SAMPLE_VIDEOS[0]);
    setVideoTitle('Exploring Pristine Mountain Valleys');
    setCaption('Nature is not a place to visit, it is home. 🌿 Take a deep breath and immerse yourself in this tranquil escape.');
    setHashtags(['#nature', '#travel', '#beautiful', '#wanderlust']);
    setCustomHashtags('nature, travel, beautiful');
    setSelectedPlatforms(['youtube', 'facebook', 'instagram', 'tiktok']);
  };

  // AI Caption & Hashtags Generation
  const generateAICaption = async (toneOverride?: string) => {
    setIsGeneratingAI(true);
    const targetTone = toneOverride || aiTone;
    try {
      const res = await fetch('/api/v1/ai/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle || videoFileName || 'Epic nature travel video',
          platforms: selectedPlatforms,
          tone: targetTone,
          language: language === 'bn' ? 'bn' : 'en',
        }),
      });
      const json = await res.json();
      if (json.success && json.caption) {
        setCaption(json.caption);
        if (json.hashtags && Array.isArray(json.hashtags)) {
          const cleanedTags = json.hashtags.map((h: string) => (h.startsWith('#') ? h : `#${h}`));
          setHashtags(cleanedTags);
          setCustomHashtags(cleanedTags.map((h: string) => h.replace('#', '')).join(', '));
        }
        // Update per-platform presets if overrides returned
        if (json.platform_overrides) {
          const po = json.platform_overrides;
          setPlatformSettings((prev) => ({
            ...prev,
            youtube: {
              title: po.youtube?.title || videoTitle || 'Cinematic 4K Experience',
              description: po.youtube?.caption || po.youtube?.description || prev.youtube?.description || '',
              hashtags: po.youtube?.hashtags || prev.youtube?.hashtags || [],
            },
            facebook: {
              caption: po.facebook?.caption || prev.facebook?.caption || '',
              hashtags: po.facebook?.hashtags || prev.facebook?.hashtags || [],
            },
            instagram: {
              caption: po.instagram?.caption || prev.instagram?.caption || '',
              hashtags: po.instagram?.hashtags || prev.instagram?.hashtags || [],
            },
            tiktok: {
              caption: po.tiktok?.caption || prev.tiktok?.caption || '',
              hashtags: po.tiktok?.hashtags || prev.tiktok?.hashtags || [],
            },
            x: {
              caption: po.x?.caption || prev.x?.caption || '',
              hashtags: po.x?.hashtags || prev.x?.hashtags || [],
            },
          }));
        }
      }
    } catch (err) {
      console.error('Failed to generate AI content:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateAIHashtags = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: caption || videoFileName || 'travel video',
          tone: 'viral',
          language,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.general?.hashtags) {
        const tags = json.data.general.hashtags;
        setHashtags(tags);
        setCustomHashtags(tags.map((t: string) => t.replace('#', '')).join(', '));
      }
    } catch (err) {
      console.error('Failed to generate AI tags:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Upload & Publishing Simulation
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [platformUploadStatus, setPlatformUploadStatus] = useState<Record<string, PlatformUploadStatus>>({});
  const [lastPublishedPost, setLastPublishedPost] = useState<PostItem | null>(null);

  const startUploadPipeline = (isScheduled: boolean) => {
    setIsUploading(true);
    setUploadProgress(5);
    navigateTo('uploading');

    // Gather effective targets: either selectedAccountIds or platform fallback
    const targetAccounts = accounts.filter(
      (a) => a.connected && (selectedAccountIds.includes(a.id) || selectedPlatforms.includes(a.platform))
    );

    const initialStatuses: Record<string, PlatformUploadStatus> = {};
    if (targetAccounts.length > 0) {
      targetAccounts.forEach((acc) => {
        initialStatuses[acc.id] = {
          status: 'uploading',
          progress: 10,
          accountId: acc.id,
          accountName: acc.name,
          accountHandle: acc.handle,
        };
      });
    } else {
      selectedPlatforms.forEach((p) => {
        initialStatuses[p] = { status: 'uploading', progress: 10 };
      });
    }
    setPlatformUploadStatus(initialStatuses);

    // Realistic multi-stage upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          finishUploadPipeline(isScheduled);
          return 100;
        }
        const jump = Math.floor(Math.random() * 14) + 6;
        const nextVal = Math.min(prev + jump, 98);

        // Update target account intermediate statuses
        setPlatformUploadStatus((curr) => {
          const updated = { ...curr };
          const keys = Object.keys(updated);
          keys.forEach((key, idx) => {
            if (nextVal > (idx + 1) * (90 / Math.max(1, keys.length))) {
              const currentItem = updated[key];
              if (currentItem?.status !== 'failed') {
                const acc = accounts.find((a) => a.id === key);
                const platformKey = acc ? acc.platform : key;
                updated[key] = {
                  ...currentItem,
                  status: 'published',
                  url: `https://${platformKey}.com/post/ocp_${Date.now()}_${key.slice(-4)}`,
                  progress: 100,
                };
              }
            }
          });
          return updated;
        });

        return nextVal;
      });
    }, 400);
  };

  const finishUploadPipeline = (isScheduled: boolean) => {
    setIsUploading(false);
    const targetAccounts = accounts.filter(
      (a) => a.connected && (selectedAccountIds.includes(a.id) || selectedPlatforms.includes(a.platform))
    );

    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      title: platformSettings.youtube?.title || caption.slice(0, 45) || 'New Video Post',
      caption,
      hashtags,
      videoUrl,
      videoFileName,
      videoDuration,
      videoSize,
      thumbnailUrl,
      selectedPlatforms,
      selectedAccountIds: targetAccounts.map((a) => a.id),
      platformSettings,
      status: isScheduled ? 'scheduled' : 'published',
      publishType: isScheduled ? 'schedule' : 'now',
      scheduledDate: isScheduled ? scheduledDate : undefined,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      repeat,
      platformResults: { ...platformUploadStatus },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsTotal: 0,
      likesTotal: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setLastPublishedPost(newPost);
    setTodayBroadcastsCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('ocp_today_broadcasts_count', next.toString());
      return next;
    });

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: isScheduled ? 'schedule_reminder' : 'publish_success',
      title: isScheduled ? 'Post Scheduled Successfully!' : 'Published Successfully!',
      message: isScheduled
        ? `Queued for broadcast across ${targetAccounts.length || selectedPlatforms.length} channels on ${scheduledDate} at ${scheduledTime}.`
        : `Your video was broadcasted to ${targetAccounts.length || selectedPlatforms.length} social channels simultaneously.`,
      time: 'Just now',
      isRead: false,
      postId: newPost.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    // Go to success screen
    navigateTo('success');
  };

  const publishPostNow = () => {
    startUploadPipeline(false);
  };

  const schedulePostNow = () => {
    startUploadPipeline(true);
  };

  const retryPlatformUpload = (key: string) => {
    setPlatformUploadStatus((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), status: 'uploading', progress: 50 },
    }));

    setTimeout(() => {
      setPlatformUploadStatus((prev) => {
        const acc = accounts.find((a) => a.id === key);
        const platformKey = acc ? acc.platform : key;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            status: 'published',
            url: `https://${platformKey}.com/post/ocp_${Date.now()}`,
            progress: 100,
          },
        };
      });
    }, 1500);
  };

  // Posts List
  const [posts, setPosts] = useState<PostItem[]>(() => {
    const saved = localStorage.getItem('ocp_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('ocp_posts', JSON.stringify(posts));
  }, [posts]);

  const [selectedPostDetail, setSelectedPostDetail] = useState<PostItem | null>(null);

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPostDetail?.id === id) {
      setSelectedPostDetail(null);
      goBack();
    }
  };

  const retryPost = (id: string) => {
    const target = posts.find((p) => p.id === id);
    if (!target) return;
    setVideoUrl(target.videoUrl);
    setVideoFileName(target.videoFileName);
    setCaption(target.caption);
    setHashtags(target.hashtags);
    setSelectedPlatforms(target.selectedPlatforms);
    setPlatformSettings(target.platformSettings);
    startUploadPipeline(false);
  };

  // Drafts
  const [drafts, setDrafts] = useState<DraftItem[]>(() => {
    const saved = localStorage.getItem('ocp_drafts');
    return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
  });

  useEffect(() => {
    localStorage.setItem('ocp_drafts', JSON.stringify(drafts));
  }, [drafts]);

  const saveCurrentAsDraft = () => {
    const newDraft: DraftItem = {
      id: `draft-${Date.now()}`,
      title: platformSettings.youtube?.title || caption.slice(0, 35) || 'Untitled Draft',
      caption,
      hashtags,
      videoUrl,
      videoFileName,
      thumbnailUrl,
      selectedPlatforms,
      platformSettings,
      lastEdited: 'Just now',
    };
    setDrafts((prev) => [newDraft, ...prev.filter((d) => d.title !== newDraft.title)]);
    navigateTo('drafts');
  };

  const loadDraft = (draft: DraftItem) => {
    setVideoUrl(draft.videoUrl);
    setVideoFileName(draft.videoFileName);
    setThumbnailUrl(draft.thumbnailUrl || SAMPLE_VIDEOS[0].thumbnail);
    setCaption(draft.caption);
    setHashtags(draft.hashtags);
    setCustomHashtags(draft.hashtags.map((h) => h.replace('#', '')).join(', '));
    setSelectedPlatforms(draft.selectedPlatforms);
    setPlatformSettings(draft.platformSettings);
    navigateTo('create');
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ocp_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('ocp_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('ocp_notif_settings');
    return saved
      ? JSON.parse(saved)
      : {
          publishSuccess: true,
          uploadFailed: true,
          scheduledReminder: true,
          newAccountConnected: true,
        };
  });

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('ocp_notif_settings', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Daily Broadcast Goals State
  const [dailyBroadcastGoal, setDailyBroadcastGoalState] = useState<number>(() => {
    const saved = localStorage.getItem('ocp_daily_broadcast_goal');
    return saved ? Math.max(1, parseInt(saved, 10)) : 5;
  });

  const setDailyBroadcastGoal = (goal: number) => {
    const clamped = Math.max(1, Math.min(30, goal));
    setDailyBroadcastGoalState(clamped);
    localStorage.setItem('ocp_daily_broadcast_goal', clamped.toString());
  };

  const [todayBroadcastsCount, setTodayBroadcastsCount] = useState<number>(() => {
    const saved = localStorage.getItem('ocp_today_broadcasts_count');
    return saved !== null ? parseInt(saved, 10) : 2;
  });

  const incrementTodayBroadcasts = () => {
    setTodayBroadcastsCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('ocp_today_broadcasts_count', next.toString());
      return next;
    });
  };

  const decrementTodayBroadcasts = () => {
    setTodayBroadcastsCount((prev) => {
      const next = Math.max(0, prev - 1);
      localStorage.setItem('ocp_today_broadcasts_count', next.toString());
      return next;
    });
  };

  const resetTodayBroadcasts = (val: number = 0) => {
    setTodayBroadcastsCount(val);
    localStorage.setItem('ocp_today_broadcasts_count', val.toString());
  };

  return (
    <AppContext.Provider
      value={{
        screen,
        navigateTo,
        goBack,
        historyStack,
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        user,
        updateUser,
        videoTitle,
        setVideoTitle,
        videoUrl,
        videoFileName,
        videoDuration,
        setVideoDuration,
        videoSize,
        thumbnailUrl,
        caption,
        hashtags,
        customHashtags,
        selectedPlatforms,
        selectedAccountIds,
        platformSettings,
        scheduledDate,
        scheduledTime,
        repeat,
        videoAspectRatio,
        setVideoAspectRatio,
        videoFitMode,
        setVideoFitMode,
        videoTrimRange,
        setVideoTrimRange,
        setVideoUrl,
        setVideoFileName,
        setCaption,
        setHashtags,
        setCustomHashtags,
        togglePlatform,
        toggleAccount,
        selectAllPlatforms,
        deselectAllPlatforms,
        updatePlatformSetting,
        applyContentToAll,
        setScheduledDate,
        setScheduledTime,
        setRepeat,
        selectSampleVideo,
        resetPostForm,
        isGeneratingAI,
        aiTone,
        setAiTone,
        generateAICaption,
        generateAIHashtags,
        isUploading,
        uploadProgress,
        platformUploadStatus,
        lastPublishedPost,
        publishPostNow,
        schedulePostNow,
        retryPlatformUpload,
        accounts,
        selectedAccountDetail,
        setSelectedAccountDetail,
        oauthModalPlatform,
        oauthTargetAccountId,
        openOAuthModal,
        closeOAuthModal,
        confirmOAuthConnect,
        disconnectAccount,
        addNewAccount,
        posts,
        selectedPostDetail,
        setSelectedPostDetail,
        deletePost,
        retryPost,
        drafts,
        saveCurrentAsDraft,
        loadDraft,
        deleteDraft,
        notifications,
        unreadNotifsCount,
        notificationSettings,
        updateNotificationSettings,
        markNotificationAsRead,
        markAllNotificationsRead,
        dailyBroadcastGoal,
        setDailyBroadcastGoal,
        todayBroadcastsCount,
        incrementTodayBroadcasts,
        decrementTodayBroadcasts,
        resetTodayBroadcasts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
