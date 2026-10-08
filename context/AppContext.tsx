'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import {
  ScreenId,
  PlatformId,
  LanguageCode,
  ThemeMode,
  SocialAccount,
  PostItem,
  DraftItem,
  NotificationItem,
  UserProfile,
  NotificationSettings,
  PlatformSpecificContent,
  PlatformUploadStatus,
} from '../types';
import { INITIAL_USER, COMING_SOON_ACCOUNTS } from '../data/initialData';
import { translations } from '../data/translations';
import { useAuth } from './AuthContext';
import { useMediaUpload } from './MediaUploadContext';
import {
  postsApi,
  FINAL_TARGET_STATUSES,
  sanitizeForYouTube,
  normalizeTags,
  sleep,
  localDateTime,
  scheduleTimeError,
  type ServerPost,
} from '../lib/posts-api';
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
  caption: string;
  hashtags: string[];
  customHashtags: string;
  selectedPlatforms: PlatformId[];
  selectedAccountIds: string[];
  platformSettings: Partial<Record<PlatformId, PlatformSpecificContent>>;
  scheduledDate: string;
  scheduledTime: string;
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
  /** প্ল্যাটফর্ম কানেক্ট (এখন শুধু YouTube; বাকিগুলো "শীঘ্রই আসছে") */
  openOAuthModal: (p: PlatformId, accountId?: string) => void;
  disconnectAccount: (idOrPlatform: string) => void;
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

  // Language — এখন শুধু English আর বাংলা (আগে অন্য ভাষা বেছে থাকলে English)
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('ocp_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('ocp_lang', lang);
  };

  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
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
    const saved = localStorage.getItem('ocp_user_v2');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('ocp_user_v2', JSON.stringify(updated));
      return updated;
    });
  };

  // Accounts — YouTube = সার্ভার থেকে আসা আসল চ্যানেল; বাকি প্ল্যাটফর্ম "শীঘ্রই আসছে"
  const [serverAccounts, setServerAccounts] = useState<SocialAccount[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<PlatformId | null>(null);
  const [accountNotice, setAccountNotice] = useState<AccountNotice | null>(null);
  const clearAccountNotice = () => setAccountNotice(null);

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
      ...COMING_SOON_ACCOUNTS,
    ],
    [serverAccounts]
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

  /** কানেক্ট — YouTube হলে Google-এর অফিসিয়াল পেজে; বাকিগুলো এখনো চালু হয়নি */
  const openOAuthModal = (p: PlatformId) => {
    if (p === 'youtube') {
      void connectYouTube();
      return;
    }
    setAccountNotice({ type: 'info', message: 'This platform is coming soon. YouTube is available now.' });
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
    }
  };

  // Active Post Creation state (খালি থেকে শুরু — কোনো নমুনা লেখা নেই)
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<string>('');
  const [videoSize, setVideoSize] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [customHashtags, setCustomHashtags] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['youtube']);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [platformSettings, setPlatformSettings] = useState<Partial<Record<PlatformId, PlatformSpecificContent>>>({});

  // আজকের তারিখ আর এক ঘণ্টা পরের সময় দিয়ে শুরু
  const [scheduledDate, setScheduledDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [scheduledTime, setScheduledTime] = useState<string>(() => {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:00`;
  });
  const [aiTone, setAiTone] = useState<string>('viral');
  const isGeneratingAI = false; // AI ধাপে আসল হবে

  // নতুন YouTube চ্যানেল কানেক্ট হলে পোস্টের জন্য নিজে থেকে বাছাই
  useEffect(() => {
    const connectedIds = serverAccounts.filter((a) => a.connected).map((a) => a.id);
    setSelectedAccountIds((prev) => {
      const kept = prev.filter((id) => connectedIds.includes(id));
      return kept.length > 0 ? kept : connectedIds;
    });
  }, [serverAccounts]);

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
    const platforms: PlatformId[] = ['youtube', 'facebook', 'instagram', 'tiktok'];
    platforms.forEach((p) => {
      updated[p] = {
        title: p === 'youtube' ? (videoTitle || newCaption).slice(0, 100) : undefined,
        description: p === 'youtube' ? `${newCaption}\n\n${newTags.join(' ')}`.trim() : undefined,
        caption: newCaption,
        hashtags: [...newTags],
      };
    });
    setPlatformSettings(updated);
  };

  const resetPostForm = () => {
    setVideoTitle('');
    setVideoUrl('');
    setVideoFileName('');
    setVideoDuration('');
    setVideoSize('');
    setThumbnailUrl('');
    setCaption('');
    setHashtags([]);
    setCustomHashtags('');
    setPlatformSettings({});
    setSelectedPlatforms(['youtube']);
  };

  // AI Caption & Hashtags — AI ধাপে আসল হবে (Gemini → Groq → Ollama)। এখন কিছু করে না।
  const generateAICaption = async (_toneOverride?: string) => {
    void _toneOverride;
  };

  const generateAIHashtags = async () => {};

  // Upload & Publishing
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [platformUploadStatus, setPlatformUploadStatus] = useState<Record<string, PlatformUploadStatus>>({});
  const [lastPublishedPost, setLastPublishedPost] = useState<PostItem | null>(null);
  const mediaUpload = useMediaUpload();

  // ── Publishing pipeline ──────────────────────────────────────────────────
  // আসল YouTube চ্যানেল → সার্ভারে পাবলিশ (ব্যাকগ্রাউন্ডে), প্রতি ৩ সেকেন্ডে অবস্থা দেখা।
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

    let scheduledAtIso: string | undefined;
    if (isScheduled) {
      const timeError = scheduleTimeError(scheduledDate, scheduledTime);
      if (timeError) return failAll(timeError);
      scheduledAtIso = localDateTime(scheduledDate, scheduledTime)?.toISOString();
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
        scheduled_at: scheduledAtIso,
        timezone: isScheduled ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
      });
    } catch (error) {
      return failAll(error instanceof Error ? error.message : 'Could not start publishing.');
    }

    // শিডিউল হলে এখানেই শেষ — সময় হলে সার্ভার নিজেই পাবলিশ করবে
    if (isScheduled) {
      post.targets.forEach((t) => {
        if (!t.social_account_id || !accountIds.includes(t.social_account_id)) return;
        onUpdate(t.social_account_id, { status: 'pending', progress: 100, error: undefined });
      });
      return post.id;
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

    // শুধু কানেক্ট করা আসল চ্যানেল (এখন YouTube)
    const targetAccounts = accounts.filter(
      (a) => a.connected && isServerAccount(a.id) && selectedAccountIds.includes(a.id)
    );

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
      statuses = {
        youtube: {
          status: 'failed',
          progress: 100,
          error: 'No channel selected. Connect your YouTube channel in Accounts, then select it.',
        },
      };
      setPlatformUploadStatus(statuses);
      setUploadProgress(100);
      pipelineRunningRef.current = false;
      finishUploadPipeline(isScheduled, statuses, null);
      return;
    }

    setPlatformUploadStatus(statuses);

    const update = (key: string, patch: Partial<PlatformUploadStatus>) => {
      statuses = { ...statuses, [key]: { ...statuses[key], ...patch } as PlatformUploadStatus };
      setPlatformUploadStatus(statuses);
      const values = Object.values(statuses);
      const avg =
        values.reduce((sum, v) => sum + (v.status === 'published' || v.status === 'failed' ? 100 : v.progress ?? 0), 0) /
        values.length;
      setUploadProgress(Math.max(5, Math.min(100, Math.round(avg))));
    };

    void runServerPublish(
      targetAccounts.map((a) => a.id),
      isScheduled,
      update
    ).then((postId) => {
      pipelineRunningRef.current = false;
      finishUploadPipeline(isScheduled, statuses, postId);
    });
  };

  const finishUploadPipeline = (
    isScheduled: boolean,
    results: Record<string, PlatformUploadStatus>,
    serverPostId: string | null
  ) => {
    setIsUploading(false);

    const resultValues = Object.values(results);
    const publishedCount = resultValues.filter((r) => r.status === 'published').length;
    const failedCount = resultValues.filter((r) => r.status === 'failed').length;
    // শিডিউলে সফল মানে "pending" (অপেক্ষায়), পাবলিশে "published"
    const okCount = resultValues.length - failedCount;
    const allFailed = resultValues.length > 0 && okCount === 0;
    const scheduledLabel = (() => {
      const when = localDateTime(scheduledDate, scheduledTime);
      return when ? when.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : `${scheduledDate} ${scheduledTime}`;
    })();

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
      selectedAccountIds: Object.keys(results).filter((k) => isServerAccount(k)),
      platformSettings,
      status: allFailed ? 'failed' : isScheduled ? 'scheduled' : 'published',
      publishType: isScheduled ? 'schedule' : 'now',
      scheduledDate: isScheduled ? scheduledDate : undefined,
      scheduledTime: isScheduled ? scheduledTime : undefined,
      platformResults: { ...results },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
    setLastPublishedPost(newPost);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: allFailed ? 'upload_failed' : isScheduled ? 'schedule_reminder' : 'publish_success',
      title: allFailed
        ? isScheduled
          ? 'Scheduling Failed'
          : 'Publishing Failed'
        : isScheduled
        ? 'Post Scheduled'
        : failedCount > 0
        ? 'Published with some errors'
        : 'Published Successfully!',
      message: allFailed
        ? resultValues[0]?.error || (isScheduled ? 'The post could not be scheduled.' : 'The video could not be published.')
        : isScheduled
        ? `Will publish to ${okCount} channel${okCount === 1 ? '' : 's'} on ${scheduledLabel}.`
        : `Published to ${publishedCount} of ${resultValues.length} channels.`,
      time: new Date().toLocaleString(),
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

  // একটা চ্যানেলে আবার পাবলিশ
  const retryPlatformUpload = (key: string) => {
    if (!isServerAccount(key)) return;
    setPlatformUploadStatus((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), status: 'uploading', progress: 5, error: undefined },
    }));
    void runServerPublish([key], false, (k, patch) =>
      setPlatformUploadStatus((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), ...patch } as PlatformUploadStatus }))
    );
  };

  // Posts List
  const [posts, setPosts] = useState<PostItem[]>(() => {
    // v2: পুরনো নমুনা পোস্ট আর দেখাবে না
    const saved = localStorage.getItem('ocp_posts_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ocp_posts_v2', JSON.stringify(posts));
  }, [posts]);

  const [selectedPostDetail, setSelectedPostDetail] = useState<PostItem | null>(null);

  const removePostLocally = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedPostDetail?.id === id) {
      setSelectedPostDetail(null);
      goBack();
    }
  };

  // শিডিউল করা পোস্ট মুছলে সার্ভারেও বাতিল হয় (না হলে সময়মতো পাবলিশ হয়ে যেত)
  const deletePost = (id: string) => {
    const post = posts.find((p) => p.id === id);
    const serverId = post && post.status === 'scheduled' && id.startsWith('post-') ? id.slice(5) : null;

    if (!serverId) {
      removePostLocally(id);
      return;
    }

    void postsApi
      .cancel(serverId)
      .then(() => removePostLocally(id))
      .catch((error: unknown) => {
        const status = (error as { status?: number })?.status;
        if (status === 404) {
          removePostLocally(id); // সার্ভারে আর নেই
          return;
        }
        window.alert(
          error instanceof Error ? error.message : 'Could not cancel this post. Please try again.'
        );
      });
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
    const saved = localStorage.getItem('ocp_drafts_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ocp_drafts_v2', JSON.stringify(drafts));
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
      lastEdited: new Date().toLocaleString(),
    };
    setDrafts((prev) => [newDraft, ...prev.filter((d) => d.title !== newDraft.title)]);
    navigateTo('drafts');
  };

  const loadDraft = (draft: DraftItem) => {
    setVideoUrl(draft.videoUrl);
    setVideoFileName(draft.videoFileName);
    setThumbnailUrl(draft.thumbnailUrl || '');
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
    const saved = localStorage.getItem('ocp_notifs_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ocp_notifs_v2', JSON.stringify(notifications));
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

  // লগইন হলে আসল অ্যাকাউন্ট লোড; Google থেকে ফিরে এলে কানেকশন শেষ করা
  const { status: authStatus } = useAuth();

  // শিডিউল করা পোস্ট সার্ভারে পাবলিশ হলো কিনা — অ্যাপ খুললে আর প্রতি ১ মিনিটে দেখা
  const postsRef = useRef(posts);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);
  const hasPendingServerPosts = posts.some(
    (p) => (p.status === 'scheduled' || p.status === 'uploading') && p.id.startsWith('post-')
  );

  useEffect(() => {
    if (authStatus !== 'authenticated' || !hasPendingServerPosts) return;

    let stopped = false;

    const sync = async () => {
      let serverPosts: ServerPost[];
      try {
        serverPosts = await postsApi.list();
      } catch {
        return; // নেটওয়ার্ক সমস্যা — পরের বার আবার
      }
      if (stopped) return;

      const byId = new Map(serverPosts.map((sp) => [`post-${sp.id}`, sp]));
      const newlyDone: { post: PostItem; ok: boolean }[] = [];
      const updates = new Map<string, PostItem | null>(); // null = মুছে ফেলা (বাতিল হয়েছে)

      postsRef.current.forEach((p) => {
        const sp = byId.get(p.id);
        if (!sp || (p.status !== 'scheduled' && p.status !== 'uploading')) return;

        if (sp.status === 'cancelled') {
          updates.set(p.id, null);
          return;
        }

        const status: PostItem['status'] =
          sp.status === 'published' || sp.status === 'partially_failed'
            ? 'published'
            : sp.status === 'failed'
            ? 'failed'
            : p.status;
        if (status === p.status) return;

        const platformResults = { ...p.platformResults };
        sp.targets.forEach((t) => {
          if (!t.social_account_id) return;
          platformResults[t.social_account_id] = {
            ...(platformResults[t.social_account_id] || {}),
            status: t.status === 'published' ? 'published' : t.status === 'failed' || t.status === 'cancelled' ? 'failed' : 'pending',
            progress: 100,
            url: t.url ?? undefined,
            error: t.error ?? undefined,
          };
        });

        const updated: PostItem = { ...p, status, platformResults, updatedAt: new Date().toISOString() };
        updates.set(p.id, updated);
        newlyDone.push({ post: updated, ok: status === 'published' });
      });

      if (updates.size === 0) return;

      setPosts((prev) =>
        prev.flatMap((p) => {
          if (!updates.has(p.id)) return [p];
          const u = updates.get(p.id);
          return u ? [u] : [];
        })
      );

      if (newlyDone.length > 0) {
        setNotifications((prev) => [
          ...newlyDone.map(({ post, ok }) => ({
            id: `notif-${post.id}-${ok ? 'done' : 'failed'}`,
            type: (ok ? 'publish_success' : 'upload_failed') as NotificationItem['type'],
            title: ok ? 'Scheduled Post Published' : 'Scheduled Post Failed',
            message: ok
              ? `"${post.title}" is now on YouTube.`
              : Object.values(post.platformResults).find((r) => r?.error)?.error || `"${post.title}" could not be published.`,
            time: new Date().toLocaleString(),
            isRead: false,
            postId: post.id,
          })),
          ...prev.filter((n) => !newlyDone.some(({ post }) => n.id.startsWith(`notif-${post.id}-`))),
        ]);
      }
    };

    void sync();
    const timer = window.setInterval(() => void sync(), 60_000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [authStatus, hasPendingServerPosts]);
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
        openOAuthModal,
        disconnectAccount,
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
