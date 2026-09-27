import { PlatformId } from '../types';

export interface AgeGroupMetric {
  range: string;
  percent: number;
  countLabel: string;
}

export interface GenderMetric {
  type: string;
  percent: number;
}

export interface LocationMetric {
  country: string;
  code: string;
  flag: string;
  percent: number;
  viewers: string;
}

export interface AudienceCategoryMetric {
  category: string;
  percent: number;
  iconName?: string;
  description: string;
}

export interface DeviceBreakdownMetric {
  device: string;
  percent: number;
  icon: string;
}

export interface PlatformAudienceData {
  platform: PlatformId;
  platformName: string;
  totalViews: string;
  activeFollowers: string;
  growth: string;
  avgWatchTime: string;
  retentionRate: string;
  primaryDemographicSummary: string;
  ageGroups: AgeGroupMetric[];
  gender: GenderMetric[];
  topLocations: LocationMetric[];
  audienceCategories: AudienceCategoryMetric[];
  deviceBreakdown: DeviceBreakdownMetric[];
  peakActiveHours: string;
}

export const PLATFORM_AUDIENCE_METRICS: Record<PlatformId, PlatformAudienceData> = {
  youtube: {
    platform: 'youtube',
    platformName: 'YouTube Channel',
    totalViews: '52,400',
    activeFollowers: '54.2K Subscribers',
    growth: '+22.4%',
    avgWatchTime: '4m 38s',
    retentionRate: '68.5%',
    primaryDemographicSummary: 'Tech-savvy young adults & programmers watching full-length 4K guides and drone footage.',
    ageGroups: [
      { range: '13–17', percent: 8, countLabel: '4.2K' },
      { range: '18–24', percent: 36, countLabel: '18.8K' },
      { range: '25–34', percent: 42, countLabel: '22.0K' },
      { range: '35–44', percent: 11, countLabel: '5.8K' },
      { range: '45+', percent: 3, countLabel: '1.6K' },
    ],
    gender: [
      { type: 'Male', percent: 64 },
      { type: 'Female', percent: 33 },
      { type: 'Other / Non-binary', percent: 3 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 38, viewers: '19.9K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 26, viewers: '13.6K' },
      { country: 'India', code: 'IN', flag: '🇮🇳', percent: 18, viewers: '9.4K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 10, viewers: '5.2K' },
      { country: 'Canada', code: 'CA', flag: '🇨🇦', percent: 8, viewers: '4.3K' },
    ],
    audienceCategories: [
      { category: 'Technology & Gadgets', percent: 44, description: 'Software developers, AI researchers, and tech enthusiasts' },
      { category: 'Travel & Nature Cinematography', percent: 28, description: 'Nature exploration and 4K aerial landscape lovers' },
      { category: 'Gaming & High-End PC Setup', percent: 18, description: 'PC builders and competitive gamer audiences' },
      { category: 'Education & Tutorials', percent: 10, description: 'Lifelong learners and productivity seekers' },
    ],
    deviceBreakdown: [
      { device: 'Desktop / PC', percent: 48, icon: '🖥️' },
      { device: 'Mobile Phones', percent: 39, icon: '📱' },
      { device: 'Smart TVs / Living Room', percent: 13, icon: '📺' },
    ],
    peakActiveHours: '7:00 PM – 11:00 PM (Local)',
  },

  facebook: {
    platform: 'facebook',
    platformName: 'Facebook Page & Reels',
    totalViews: '38,700',
    activeFollowers: '60.7K Followers',
    growth: '+14.2%',
    avgWatchTime: '1m 45s',
    retentionRate: '54.2%',
    primaryDemographicSummary: 'Broad family-oriented social community engaging with viral stories and travel reels.',
    ageGroups: [
      { range: '13–17', percent: 5, countLabel: '1.9K' },
      { range: '18–24', percent: 28, countLabel: '10.8K' },
      { range: '25–34', percent: 45, countLabel: '17.4K' },
      { range: '35–44', percent: 16, countLabel: '6.2K' },
      { range: '45+', percent: 6, countLabel: '2.4K' },
    ],
    gender: [
      { type: 'Male', percent: 55 },
      { type: 'Female', percent: 43 },
      { type: 'Other / Non-binary', percent: 2 },
    ],
    topLocations: [
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 42, viewers: '16.2K' },
      { country: 'India', code: 'IN', flag: '🇮🇳', percent: 24, viewers: '9.3K' },
      { country: 'Saudi Arabia & UAE', code: 'AE', flag: '🇦🇪', percent: 14, viewers: '5.4K' },
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 12, viewers: '4.6K' },
      { country: 'Malaysia', code: 'MY', flag: '🇲🇾', percent: 8, viewers: '3.2K' },
    ],
    audienceCategories: [
      { category: 'News & Viral Trends', percent: 38, description: 'Followers tracking trending viral topics and daily updates' },
      { category: 'Lifestyle & Community Vlogs', percent: 32, description: 'Audiences passionate about personal stories and travel' },
      { category: 'Tech & Career Tips', percent: 18, description: 'Freelancers, remote workers, and job skill seekers' },
      { category: 'Entertainment & Humor', percent: 12, description: 'Casual video consumers looking for entertaining reels' },
    ],
    deviceBreakdown: [
      { device: 'Mobile Phones (Android & iOS)', percent: 88, icon: '📱' },
      { device: 'Desktop Web', percent: 10, icon: '🖥️' },
      { device: 'Tablets / iPad', percent: 2, icon: '📟' },
    ],
    peakActiveHours: '8:00 PM – 12:00 AM (Local)',
  },

  instagram: {
    platform: 'instagram',
    platformName: 'Instagram Reels & Profile',
    totalViews: '22,100',
    activeFollowers: '28.9K Followers',
    growth: '+29.1%',
    avgWatchTime: '0m 42s',
    retentionRate: '79.2%',
    primaryDemographicSummary: 'Design-centric Gen-Z & millennial visual lovers consuming fast-paced aesthetics.',
    ageGroups: [
      { range: '13–17', percent: 14, countLabel: '3.1K' },
      { range: '18–24', percent: 52, countLabel: '11.5K' },
      { range: '25–34', percent: 26, countLabel: '5.7K' },
      { range: '35–44', percent: 6, countLabel: '1.3K' },
      { range: '45+', percent: 2, countLabel: '0.5K' },
    ],
    gender: [
      { type: 'Female', percent: 53 },
      { type: 'Male', percent: 44 },
      { type: 'Other / Non-binary', percent: 3 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 34, viewers: '7.5K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 22, viewers: '4.8K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 16, viewers: '3.5K' },
      { country: 'India', code: 'IN', flag: '🇮🇳', percent: 15, viewers: '3.3K' },
      { country: 'Germany', code: 'DE', flag: '🇩🇪', percent: 13, viewers: '2.9K' },
    ],
    audienceCategories: [
      { category: 'Aesthetic Visuals & Photography', percent: 45, description: 'Cinematic color grading, landscape reels, and drone shots' },
      { category: 'Travel Inspiration & Guides', percent: 30, description: 'Nomadic destinations, cozy cafe spots, and travel gear' },
      { category: 'Minimalist Tech & Workspace', percent: 16, description: 'Desk setups, gadgets, and aesthetic productivity tools' },
      { category: 'Fashion & Urban Lifestyle', percent: 9, description: 'City exploration and modern creator aesthetics' },
    ],
    deviceBreakdown: [
      { device: 'iPhone / iOS', percent: 62, icon: '🍏' },
      { device: 'Android', percent: 35, icon: '🤖' },
      { device: 'Web Desktop', percent: 3, icon: '🖥️' },
    ],
    peakActiveHours: '6:00 PM – 10:30 PM (Local)',
  },

  tiktok: {
    platform: 'tiktok',
    platformName: 'TikTok FYP & Creator Account',
    totalViews: '12,400',
    activeFollowers: '89.4K Followers',
    growth: '+38.5%',
    avgWatchTime: '0m 28s',
    retentionRate: '86.4%',
    primaryDemographicSummary: 'Rapid Gen-Z FYP scrollers responding heavily to trending audio hooks and transitions.',
    ageGroups: [
      { range: '13–17', percent: 26, countLabel: '3.2K' },
      { range: '18–24', percent: 56, countLabel: '6.9K' },
      { range: '25–34', percent: 14, countLabel: '1.7K' },
      { range: '35–44', percent: 3, countLabel: '0.4K' },
      { range: '45+', percent: 1, countLabel: '0.2K' },
    ],
    gender: [
      { type: 'Female', percent: 51 },
      { type: 'Male', percent: 46 },
      { type: 'Other / Non-binary', percent: 3 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 45, viewers: '5.6K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 20, viewers: '2.5K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 15, viewers: '1.9K' },
      { country: 'Canada', code: 'CA', flag: '🇨🇦', percent: 11, viewers: '1.4K' },
      { country: 'Australia', code: 'AU', flag: '🇦🇺', percent: 9, viewers: '1.1K' },
    ],
    audienceCategories: [
      { category: 'Viral Shorts & POV Clips', percent: 50, description: 'Relatable hooks, POV storytelling, and dynamic sound beats' },
      { category: 'Quick Tech Hacks & Tools', percent: 25, description: '15-second AI tool reveals and quick coding lifehacks' },
      { category: 'Cinematic Drone Transitions', percent: 15, description: 'High-speed speed ramps and hyperlapse eye-candy' },
      { category: 'Music & Trending Audios', percent: 10, description: 'Audios synced with beat drops and cinematic cuts' },
    ],
    deviceBreakdown: [
      { device: 'Smartphones (9:16 Full Screen)', percent: 97, icon: '📱' },
      { device: 'Tablets / iPad', percent: 2, icon: '📟' },
      { device: 'Desktop Web Browser', percent: 1, icon: '🖥️' },
    ],
    peakActiveHours: '9:00 PM – 1:00 AM (Local)',
  },

  x: {
    platform: 'x',
    platformName: 'X (Twitter) Feed & Video',
    totalViews: '8,900',
    activeFollowers: '14.2K Followers',
    growth: '+18.7%',
    avgWatchTime: '0m 52s',
    retentionRate: '61.0%',
    primaryDemographicSummary: 'Tech founders, software engineers, journalists, and venture creators seeking signal.',
    ageGroups: [
      { range: '13–17', percent: 4, countLabel: '0.4K' },
      { range: '18–24', percent: 32, countLabel: '2.8K' },
      { range: '25–34', percent: 48, countLabel: '4.3K' },
      { range: '35–44', percent: 12, countLabel: '1.1K' },
      { range: '45+', percent: 4, countLabel: '0.3K' },
    ],
    gender: [
      { type: 'Male', percent: 74 },
      { type: 'Female', percent: 22 },
      { type: 'Other / Non-binary', percent: 4 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 48, viewers: '4.3K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 16, viewers: '1.4K' },
      { country: 'India', code: 'IN', flag: '🇮🇳', percent: 14, viewers: '1.2K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 12, viewers: '1.1K' },
      { country: 'Germany', code: 'DE', flag: '🇩🇪', percent: 10, viewers: '0.9K' },
    ],
    audienceCategories: [
      { category: 'AI & Software Engineering', percent: 52, description: 'LLM researchers, full-stack builders, and open-source devs' },
      { category: 'Startups & Venture Capital', percent: 26, description: 'Tech founders, product managers, and early-stage angels' },
      { category: 'Crypto, Web3 & Tech Policy', percent: 14, description: 'Decentralized systems and digital economy watchers' },
      { category: 'Global Tech News & Commentary', percent: 8, description: 'Breaking tech announcements and product launches' },
    ],
    deviceBreakdown: [
      { device: 'Mobile App', percent: 68, icon: '📱' },
      { device: 'Desktop Browser', percent: 30, icon: '🖥️' },
      { device: 'Tablet', percent: 2, icon: '📟' },
    ],
    peakActiveHours: '12:00 PM – 4:00 PM & 8:00 PM – 11:00 PM (Local)',
  },

  linkedin: {
    platform: 'linkedin',
    platformName: 'LinkedIn Professional Network',
    totalViews: '6,300',
    activeFollowers: '8.4K Connections',
    growth: '+16.2%',
    avgWatchTime: '1m 20s',
    retentionRate: '72.4%',
    primaryDemographicSummary: 'Business leaders, HR recruiters, software managers, and enterprise directors.',
    ageGroups: [
      { range: '18–24', percent: 18, countLabel: '1.1K' },
      { range: '25–34', percent: 54, countLabel: '3.4K' },
      { range: '35–44', percent: 21, countLabel: '1.3K' },
      { range: '45+', percent: 7, countLabel: '0.5K' },
    ],
    gender: [
      { type: 'Male', percent: 59 },
      { type: 'Female', percent: 39 },
      { type: 'Other / Non-binary', percent: 2 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 40, viewers: '2.5K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 24, viewers: '1.5K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 16, viewers: '1.0K' },
      { country: 'India', code: 'IN', flag: '🇮🇳', percent: 12, viewers: '0.8K' },
      { country: 'Singapore', code: 'SG', flag: '🇸🇬', percent: 8, viewers: '0.5K' },
    ],
    audienceCategories: [
      { category: 'Career Development & Hiring', percent: 42, description: 'Software engineering recruitment and engineering management' },
      { category: 'Enterprise AI & Cloud Tech', percent: 34, description: 'Digital transformation leaders and solutions architects' },
      { category: 'Leadership & Productivity', percent: 16, description: 'Founders and executive management professionals' },
      { category: 'Tech Events & Keynotes', percent: 8, description: 'Conference attendees and keynote followers' },
    ],
    deviceBreakdown: [
      { device: 'Desktop / Work Laptop', percent: 64, icon: '🖥️' },
      { device: 'Mobile App', percent: 34, icon: '📱' },
      { device: 'Tablet', percent: 2, icon: '📟' },
    ],
    peakActiveHours: '9:00 AM – 2:00 PM (Workdays)',
  },

  pinterest: {
    platform: 'pinterest',
    platformName: 'Pinterest Visual Board',
    totalViews: '4,100',
    activeFollowers: '5.2K Pinners',
    growth: '+11.8%',
    avgWatchTime: '0m 35s',
    retentionRate: '65.0%',
    primaryDemographicSummary: 'Curators collecting aesthetic moodboards, travel ideas, and photography guides.',
    ageGroups: [
      { range: '18–24', percent: 38, countLabel: '1.6K' },
      { range: '25–34', percent: 44, countLabel: '1.8K' },
      { range: '35–44', percent: 13, countLabel: '0.5K' },
      { range: '45+', percent: 5, countLabel: '0.2K' },
    ],
    gender: [
      { type: 'Female', percent: 72 },
      { type: 'Male', percent: 24 },
      { type: 'Other / Non-binary', percent: 4 },
    ],
    topLocations: [
      { country: 'United States', code: 'US', flag: '🇺🇸', percent: 52, viewers: '2.1K' },
      { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', percent: 18, viewers: '0.7K' },
      { country: 'Canada', code: 'CA', flag: '🇨🇦', percent: 14, viewers: '0.6K' },
      { country: 'Australia', code: 'AU', flag: '🇦🇺', percent: 10, viewers: '0.4K' },
      { country: 'Bangladesh', code: 'BD', flag: '🇧🇩', percent: 6, viewers: '0.3K' },
    ],
    audienceCategories: [
      { category: 'Cinematic Wallpaper & Visuals', percent: 48, description: 'Nature backgrounds, color palettes, and 4K snapshots' },
      { category: 'Travel Destination Bucket-lists', percent: 32, description: 'Hidden gem spots and travel packing essentials' },
      { category: 'Creative Home & Workspace Decor', percent: 14, description: 'Desk aesthetics and interior lighting styles' },
      { category: 'Videography Presets & LUTs', percent: 6, description: 'Color presets and cinematography tips' },
    ],
    deviceBreakdown: [
      { device: 'Mobile App', percent: 84, icon: '📱' },
      { device: 'Desktop Web', percent: 14, icon: '🖥️' },
      { device: 'iPad / Tablet', percent: 2, icon: '📟' },
    ],
    peakActiveHours: '7:30 PM – 11:30 PM (Local)',
  },
};
