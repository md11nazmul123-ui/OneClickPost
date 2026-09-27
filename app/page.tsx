'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { OAuthModal } from '../components/OAuthModal';

// Screens
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { SelectPlatformsScreen } from '../screens/SelectPlatformsScreen';
import { PlatformSettingsScreen } from '../screens/PlatformSettingsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { UploadingScreen } from '../screens/UploadingScreen';
import { PublishSuccessScreen } from '../screens/PublishSuccessScreen';
import { AccountsScreen } from '../screens/AccountsScreen';
import { ConnectAccountScreen } from '../screens/ConnectAccountScreen';
import { AccountDetailScreen } from '../screens/AccountDetailScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ScheduledPostsScreen } from '../screens/ScheduledPostsScreen';
import { PostDetailsScreen } from '../screens/PostDetailsScreen';
import { DraftsScreen } from '../screens/DraftsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { LanguageScreen } from '../screens/LanguageScreen';
import { HelpSupportScreen } from '../screens/HelpSupportScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { AIRequestScreen } from '../screens/AIRequestScreen';
import { BulkUploadScreen } from '../screens/BulkUploadScreen';
import { InboxScreen } from '../screens/InboxScreen';
import { CloudImportScreen } from '../screens/CloudImportScreen';

// এই অ্যাপটা মূলত একটা স্টেট-ড্রাইভেন SPA (URL রুট নয়, context-এ রাখা
// `screen` state দিয়ে স্ক্রিন বদলায়) — তাই কনভার্সনে সেই একই প্যাটার্ন
// বজায় রাখা হয়েছে, পুরো অ্যাপটা Next.js-এর একটা রুট ("/") এর মধ্যে চলে।
// ব্যাকএন্ড এখন Next.js এর নিজস্ব app/api/* Route Handler দিয়ে হবে,
// আগের server.ts (Express) এর বদলে।
const MainRouter: React.FC = () => {
  const { screen, theme } = useApp();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setIsNavVisible(false);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsNavVisible(true);
      }, 300);
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => {
      mainElement.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'create':
        return <CreatePostScreen />;
      case 'platforms':
        return <SelectPlatformsScreen />;
      case 'platformSettings':
        return <PlatformSettingsScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'uploading':
        return <UploadingScreen />;
      case 'success':
        return <PublishSuccessScreen />;
      case 'accounts':
        return <AccountsScreen />;
      case 'connect':
        return <ConnectAccountScreen />;
      case 'accountDetail':
        return <AccountDetailScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'scheduled':
        return <ScheduledPostsScreen />;
      case 'postDetail':
        return <PostDetailsScreen />;
      case 'drafts':
        return <DraftsScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'language':
        return <LanguageScreen />;
      case 'help':
        return <HelpSupportScreen />;
      case 'about':
        return <AboutScreen />;
      case 'fullstack':
        return <AnalyticsScreen />;
      case 'aiRequest':
        return <AIRequestScreen />;
      case 'bulk':
        return <BulkUploadScreen />;
      case 'inbox':
        return <InboxScreen />;
      case 'cloudImport':
        return <CloudImportScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const isLightOrSmooth = theme === 'smooth' || theme === 'light';

  return (
    <div
      data-app-theme={theme}
      data-app-branding="oneclickpost"
      className={`min-h-screen ${
        isLightOrSmooth ? 'bg-[#f8fafc] text-slate-950' : 'bg-[#020713] text-slate-100'
      } selection:bg-cyan-500 selection:text-black font-sans antialiased flex flex-col transition-colors duration-300`}
    >
      <svg
        id="app-brand-gradients"
        aria-hidden="true"
        className="sr-only absolute w-0 h-0 overflow-hidden pointer-events-none"
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
      >
        <defs>
          <linearGradient id="brandGradUnified" x1="10" y1="7.5" x2="15" y2="12.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00F0FF" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="brandGradHolo" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
      </svg>

      <Header />
      <main className="flex-1 w-full overflow-auto" ref={mainRef}>
        {renderScreen()}
      </main>
      <BottomNav isVisible={isNavVisible} />
      <OAuthModal />
    </div>
  );
};

export default function Home() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
