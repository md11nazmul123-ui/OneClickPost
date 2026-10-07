'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
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
import { useAuth } from './AuthContext';
import { useMediaUpload } from './MediaUploadContext';
import { postsApi, FINAL_TARGET_STATUSES, sanitizeForYouTube, normalizeTags, sleep, type ServerPost } from '../lib/posts-api';
import {
  socialApi,
  toAppAccount,
  readOAuthReturn,
  clearOAuthReturnFromUrl,
  isTrustedGoogleAuthUrl,
  OAUTH_ERROR_MESSAGES,
} from '../lib/social-accounts';

/** অ্যাকাউন্ট পেজের উপরে দেখানো বার্তা (কানেক্ট সফল / ব্যর্থ) */
export interface AccountNotice {
  type: 'success' | 'error' | 'info';
  message: string;
}

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
  refreshConnectedAccounts: () => Promise<void>;
  connectingPlatform: PlatformId | null;
  accountNotice: AccountNotice | null;
  clearAccountNotice: () => void;

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
  // YouTube = সার্ভার থেকে আসা আসল চ্যানেল। বাকি প্ল্যাটফর্ম এখনো ডেমো (নিজ নিজ ধাপে আসল হবে)।
  const [localAccounts, setAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('ocp_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  const [serverAccounts, setServerAccounts] = useState<SocialAccount[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformId | null>(null);
  const [accountNotice, setAccountNotice] = useState<AccountNotice | null>(null);
  const clearAccountNotice = () => setAccountNotice(null);

  const REAL_PLATFORMS: PlatformId[] = ['youtube'];
  const accounts = useMemo<SocialAccount[]>(
    () => [
      ...serverAccounts,
      // কোনো YouTube চ্যানেল না থাকলে "Connect" দেখানোর জন্য একটা খালি জায়গা
      ...(serverAccounts.some((a) => a.platform === 'youtube')
        ? []
        : [
            {
              id: 'youtube-connect',
              platform: 'youtube' as PlatformId,
              name: 'YouTube',
              handle: 'Not Connected',
              avatar: '',
              connected: false,
              followers: '—',
              postsCount: 0,
              engagement: '—',
              tokenExpiresIn: 'Disconnected',
              accountLabel: 'Main Channel',
            },
          ]),
      ...localAccounts.filter((a) => !REAL_PLATFORMS.includes(a.platform)),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serverAccounts, localAccounts]
  );
  const isServerAccount = (id: string) => serverAccounts.some((a) => a.id === id);

  const refreshConnectedAccounts = async () => {
    try {
      const items = await socialApi.list();
      setServerAccounts(items.map(toAppAccount));
    } catch {
      // নেটওয়ার্ক সমস্যা হলে আগের তালিকা থাকবে
    }
  };

  /** আসল YouTube কানেক্ট — Google-এর অফিসিয়াল লগইন পেজে নিয়ে যায় */
  const connectYouTube = async () => {
    if (connectingPlatform) return;
    setConnectingPlatform('youtube');
    setAccountNotice(null);
    try {
      const url = await socialApi.startYouTube();
      if (!isTrustedGoogleAuthUrl(url)) {
        throw new Error('Unexpected sign-in address.');
      }
      window.location.assign(url);
    } catch (error) {
      setConnectingPlatform(null);
      setAccountNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not start YouTube connection.',
      });
    }
  };

  const [selectedAccountDetail, setSelectedAccountDetail] = useState<SocialAccount | null>(null);
  const [oauthModalPlatform, setOauthModalPlatform] = useState<PlatformId | null>(null);
  const [oauthTargetAccountId, setOauthTargetAccountId] = useState<string | null>(null);

  const openOAuthModal = (p: PlatformId, accountId?: string) => {
    if (p === 'youtube') {
      void connectYouTube();
      return;
    }
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
    if (platform === 'youtube') {
      void connectYouTube();
      return;
    }
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
    const serverTargets = serverAccounts.filter((a) => a.id === idOrPlatform || a.platform === idOrPlatform);
    if (serverTargets.length > 0) {
      void (async () => {
        try {
          for (const target of serverTargets) {
            await socialApi.disconnect(target.id);
          }
          setSelectedAccountIds((prev) => prev.filter((id) => !serverTargets.some((t) => t.id === id)));
          if (selectedAccountDetail && serverTargets.some((t) => t.id === selectedAccountDetail.id)) {
            setSelectedAccountDetail((prev) => (prev ? { ...prev, connected: false } : null));
          }
          setAccountNotice({ type: 'info', message: 'Account disconnected.' });
        } catch (error) {
          setAccountNotice({
            type: 'error',
            message: error instanceof Error ? error.message : 'Could not disconnect the account.',
          });
        } finally {
          await refreshConnectedAccounts();
        }
      })();
      return;
    }
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
  const mediaUpload = useMediaUpload();

  // ── Publishing pipeline ──────────────────────────────────────────────────
  // আসল YouTube চ্যানেল → সার্ভারে পাবলিশ (ব্যাকগ্রাউন্ডে), প্রতি ৩ সেকেন্ডে অবস্থা দেখা।
  // বাকি প্ল্যাটফর্ম এখনো ডেমো (নিজ নিজ ধাপে আসল হবে)।
  const pipelineRunningRef = useRef(false);

  /** আসল YouTube চ্যানেলে পাবলিশ; প্রতিটা চ্যানেলের অবস্থা onUpdate দিয়ে জানায় */
  const runServerPublish = async (
    accountIds: string[],
    isScheduled: boolean,
    onUpdate: (key: string, patch: Partial<PlatformUploadStatus>) => void
  ): Promise<string | null> => {
    const failAll = (message: string) => {
      accountIds.forEach((id) => onUpdate(id, { status: 'failed', error: message, progress: 100 }));
      return null;
    };

    if (isScheduled) {
      return failAll('Scheduling to YouTube is coming in the next update. Please use "Publish Now" for now.');
    }
    if (mediaUpload.status !== 'ready' || !mediaUpload.media) {
      return failAll('Upload your video first and wait for "✓ Uploaded", then publish.');
    }

    const yt = platformSettings.youtube;
    const title = sanitizeForYouTube(yt?.title || videoTitle || mediaUpload.media.original_name || 'New video', 100);
    const description = sanitizeForYouTube(yt?.description || caption || '', 5000);
    const tags = normalizeTags(yt?.hashtags?.length ? yt.hashtags : hashtags);

    let post: ServerPost;
    try {
      post = await postsApi.publish({
        media_id: mediaUpload.media.id,
        title: title || 'New video',
        description,
        tags,
        // Google যাচাই (audit) না হওয়া পর্যন্ত YouTube নিজেই ভিডিও Private রাখে
        privacy: 'private',
        made_for_kids: false,
        account_ids: accountIds,
      });
    } catch (error) {
      return failAll(error instanceof Error ? error.message : 'Could not start publishing.');
    }

    // শেষ না হওয়া পর্যন্ত অবস্থা দেখা (নেটওয়ার্ক সমস্যায় কয়েকবার ছাড় দেওয়া)
    let networkFailures = 0;
    while (true) {
      const done = post.targets.every((t) => FINAL_TARGET_STATUSES.includes(t.status));
      post.targets.forEach((t) => {
        if (!t.social_account_id || !accountIds.includes(t.social_account_id)) return;
        onUpdate(t.social_account_id, {
          status: t.status === 'published' ? 'published' : FINAL_TARGET_STATUSES.includes(t.status) ? 'failed' : 'uploading',
          progress: t.status === 'queued' ? 5 : Math.max(5, t.progress),
          url: t.url ?? undefined,
          error: t.error ?? undefined,
        });
      });
      if (done) return post.id;

      await sleep(3000);
      try {
        post = await postsApi.get(post.id);
        networkFailures = 0;
      } catch {
        networkFailures += 1;
        if (networkFailures >= 20) {
          return failAll('Lost connection while publishing. Check "Scheduled & Published" later for the result.');
        }
      }
    }
  };

  const startUploadPipeline = (isScheduled: boolean) => {
    if (pipelineRunningRef.current) return; // দুবার চাপলে দুবার পাবলিশ হবে না
    pipelineRunningRef.current = true;

    setIsUploading(true);
    setUploadProgress(5);
    navigateTo('uploading');

    const targetAccounts = accounts.filter(
      (a) => a.connected && (selectedAccountIds.includes(a.id) || selectedPlatforms.includes(a.platform))
    );
    const serverTargets = targetAccounts.filter((a) => isServerAccount(a.id));
    const demoTargets = targetAccounts.filter((a) => !isServerAccount(a.id));

    let statuses: Record<string, PlatformUploadStatus> = {};
    targetAccounts.forEach((acc) => {
      statuses[acc.id] = {
        status: 'uploading',
        progress: 5,
        accountId: acc.id,
        accountName: acc.name,
        accountHandle: acc.handle,
      };
    });
    if (targetAccounts.length === 0) {
      selectedPlatforms.forEach((p) => {
        statuses[p] = { status: 'uploading', progress: 5 };
      });
    }
    setPlatformUploadStatus(statuses);

    const update = (key: string, patch: Partial<PlatformUploadStatus>) => {
      statuses = { ...statuses, [key]: { ...statuses[key], ...patch } as PlatformUploadStatus };
      setPlatformUploadStatus(statuses);
    };

    const demoKeys = targetAccounts.length > 0 ? demoTargets.map((a) => a.id) : Object.keys(statuses);
    let demoDone = demoKeys.length === 0;
    let serverDone = serverTargets.length === 0;
    let serverPostId: string | null = null;
    let finished = false;

    const recompute = () => {
      const values = Object.values(statuses);
      const avg =
        values.length === 0
          ? 100
          : values.reduce((sum, v) => sum + (v.status === 'published' || v.status === 'failed' ? 100 : v.progress ?? 0), 0) /
            values.length;
      setUploadProgress(Math.max(5, Math.min(100, Math.round(avg))));

      if (demoDone && serverDone && !finished) {
        finished = true;
        pipelineRunningRef.current = false;
        finishUploadPipeline(isScheduled, statuses, serverPostId);
      }
    };

    // ডেমো প্ল্যাটফর্ম (Facebook, Instagram ...) — আগের মতোই অনুকরণ
    if (!demoDone) {
      let progress = 10;
      const timer = setInterval(() => {
        progress = Math.min(100, progress + Math.floor(Math.random() * 14) + 6);
        demoKeys.forEach((key, idx) => {
          if (statuses[key]?.status !== 'uploading') return;
          if (progress >= 100 || progress > (idx + 1) * (90 / demoKeys.length)) {
            const acc = accounts.find((a) => a.id === key);
            const platformKey = acc ? acc.platform : key;
            update(key, {
              status: 'published',
              url: `https://${platformKey}.com/post/ocp_${Date.now()}_${key.slice(-4)}`,
              progress: 100,
            });
          } else {
            update(key, { progress });
          }
        });
        if (demoKeys.every((key) => statuses[key]?.status !== 'uploading')) {
          clearInterval(timer);
          demoDone = true;
        }
        recompute();
      }, 400);
    }

    // আসল YouTube
    if (!serverDone) {
      void runServerPublish(
        serverTargets.map((a) => a.id),
        isScheduled,
        (key, patch) => {
          update(key, patch);
          recompute();
        }
      ).then((postId) => {
        serverPostId = postId;
        serverDone = true;
        recompute();
      });
    }

    if (demoDone && serverDone) {
      recompute();
    }
  };

  const finishUploadPipeline = (
    isScheduled: boolean,
    results: Record<string, PlatformUploadStatus>,
    serverPostId: string | null
  ) => {
    setIsUploading(false);
    const targetAccounts = accounts.filter(
      (a) => a.connected && (selectedAccountIds.includes(a.id) || selectedPlatforms.includes(a.platform))
    );

    const resultValues = Object.values(results);
    const publishedCount = resultValues.filter((r) => r.status === 'published').length;
    const failedCount = resultValues.filter((r) => r.status === 'failed').length;
    const allFailed = resultValues.length > 0 && publishedCount === 0;

    const newPost: PostItem = {
      // সার্ভারের ID থাকলে সেটাই (একই ID দুবার হবে না), নইলে এলোমেলো
      id: serverPostId ? `post-${serverPostId}` : `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: platformSettings.youtube?.title || videoTitle || caption.slice(0, 45) || 'New Video Post',
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
      status: allFailed ? 'failed' : isScheduled ? 'scheduled' : 'published',
      publishType: isScheduled ? 'schedule' : 'now',
      scheduledDate: isScheduled ? scheduledDate : undefined,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      repeat,
      platformResults: { ...results },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsTotal: 0,
      likesTotal: 0,
    };

    setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
    setLastPublishedPost(newPost);
    if (publishedCount > 0) {
      setTodayBroadcastsCount((prev) => {
        const next = prev + 1;
        localStorage.setItem('ocp_today_broadcasts_count', next.toString());
        return next;
      });
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: allFailed ? 'upload_failed' : isScheduled ? 'schedule_reminder' : 'publish_success',
      title: allFailed
        ? 'Publishing Failed'
        : isScheduled
        ? 'Post Scheduled Successfully!'
        : failedCount > 0
        ? 'Published with some errors'
        : 'Published Successfully!',
      message: allFailed
        ? 'The video could not be published. Open the post to see why.'
        : isScheduled
        ? `Queued for broadcast across ${publishedCount} channels on ${scheduledDate} at ${scheduledTime}.`
        : `Published to ${publishedCount} of ${resultValues.length} channels.`,
      time: 'Just now',
      isRead: false,
      postId: newPost.id,
    };
    setNotifications((prev) => [notif, ...prev]);

    navigateTo('success');
  };

  const publishPostNow = () => {
    startUploadPipeline(false);
  };

  const schedulePostNow = () => {
    startUploadPipeline(true);
  };

  const retryPlatformUpload = (key: string) => {
    // আসল YouTube চ্যানেল: শুধু সেই চ্যানেলে আবার পাবলিশ
    if (isServerAccount(key)) {
      setPlatformUploadStatus((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || {}), status: 'uploading', progress: 5, error: undefined },
      }));
      void runServerPublish([key], false, (k, patch) =>
        setPlatformUploadStatus((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), ...patch } as PlatformUploadStatus }))
      );
      return;
    }

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

  // লগইন হলে আসল অ্যাকাউন্ট লোড; Google থেকে ফিরে এলে কানেকশন শেষ করা
  const { status: authStatus } = useAuth();
  const oauthReturnRef = useRef<ReturnType<typeof readOAuthReturn> | undefined>(undefined);
  if (oauthReturnRef.current === undefined) {
    oauthReturnRef.current = readOAuthReturn();
  }

  // টিকিট পড়া হয়ে গেলে URL পরিষ্কার (রেন্ডারের পরে)
  useEffect(() => {
    clearOAuthReturnFromUrl();
  }, []);

  useEffect(() => {
    if (authStatus === 'guest') {
      setServerAccounts([]);
      return;
    }
    if (authStatus !== 'authenticated') return;

    void (async () => {
      const oauth = oauthReturnRef.current;
      oauthReturnRef.current = null; // একবারই

      if (oauth && oauth.platform === 'youtube') {
        if (oauth.ticket) {
          try {
            const account = await socialApi.completeYouTube(oauth.ticket);
            setAccountNotice({ type: 'success', message: `YouTube channel "${account.account_name}" connected.` });
            setNotifications((prev) => [
              {
                id: `notif-${Date.now()}`,
                type: 'account_connected',
                title: 'YouTube Connected',
                message: `${account.account_name} is ready for publishing.`,
                time: 'Just now',
                isRead: false,
              },
              ...prev,
            ]);
          } catch (error) {
            setAccountNotice({
              type: 'error',
              message: error instanceof Error ? error.message : OAUTH_ERROR_MESSAGES.failed,
            });
          }
        } else {
          setAccountNotice({
            type: 'error',
            message: OAUTH_ERROR_MESSAGES[oauth.error ?? 'failed'] ?? OAUTH_ERROR_MESSAGES.failed,
          });
        }
        setHistoryStack(['dashboard']);
        setScreen('accounts');
      }

      await refreshConnectedAccounts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus]);

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
        refreshConnectedAccounts,
        connectingPlatform,
        accountNotice,
        clearAccountNotice,
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
