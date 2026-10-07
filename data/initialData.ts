import { SocialAccount, UserProfile } from '../types';

/** লগইনের আগে বা সার্ভার থেকে তথ্য আসার আগে খালি প্রোফাইল */
export const INITIAL_USER: UserProfile = {
  name: '',
  email: '',
  avatar: '',
  role: '',
  bio: '',
};

/**
 * যে প্ল্যাটফর্মগুলো এখনো চালু হয়নি — "শীঘ্রই আসছে" হিসেবে দেখানো হয়।
 * নিজ নিজ ধাপে আসল কানেকশন যোগ হলে এখান থেকে সরে যাবে।
 */
export const COMING_SOON_ACCOUNTS: SocialAccount[] = (['facebook', 'instagram', 'tiktok'] as const).map(
  (platform) => ({
    id: `${platform}-coming-soon`,
    platform,
    name: platform === 'facebook' ? 'Facebook' : platform === 'instagram' ? 'Instagram' : 'TikTok',
    handle: 'Coming soon',
    avatar: '',
    connected: false,
    followers: '—',
    postsCount: 0,
    engagement: '—',
    comingSoon: true,
  })
);
