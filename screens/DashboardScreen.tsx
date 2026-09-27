'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { DailyBroadcastGoalsTracker } from '../components/DailyBroadcastGoalsTracker';
import {
  Video,
  Users2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileEdit,
  Layers,
  Cpu,
  Server,
  Database,
  BarChart3,
  Upload,
  MessageSquare,
  Cloud,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { user, accounts, posts, drafts, navigateTo, t, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';

  const connectedCount = accounts.filter((a) => a.connected).length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;

  return (
    <div className="max-w-5xl lg:max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-28 space-y-6">
      {/* Welcome Greeting & Quick Create CTA Banner */}
      <div className={`dashboard-welcome-banner relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all ${
        isSmooth
          ? 'bg-gradient-to-br from-white via-sky-50/70 to-indigo-50/80 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]'
          : 'bg-gradient-to-r from-[#092244] via-[#0b2952] to-[#12224d] border border-sky-700/60 shadow-2xl'
      }`}>
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isSmooth ? 'bg-sky-400/10' : 'bg-cyan-500/10'
        }`} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-1 ${
              isSmooth
                ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm'
                : 'bg-cyan-950/80 border border-cyan-800 text-cyan-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              One Upload. Every Platform.
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isSmooth ? '!text-slate-900' : '!text-white'
            }`} style={{ color: isSmooth ? '#0f172a' : '#ffffff' }}>
              {t('hello')}, {user.name.split(' ')[0]} 👋
            </h1>
            <p className={`text-sm max-w-md font-medium ${
              isSmooth ? '!text-slate-600' : '!text-slate-300'
            }`} style={{ color: isSmooth ? '#475569' : '#cbd5e1' }}>
              {t('dashSubtitle')}
            </p>
          </div>

          <div className="flex gap-2">
              <button
              onClick={() => navigateTo('inbox')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Inbox</span>
            </button>
            <button
              onClick={() => navigateTo('cloudImport')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Cloud Import</span>
            </button>
            <button
              onClick={() => navigateTo('bulk')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Bulk Upload</span>
            </button>
            <button
              onClick={() => navigateTo('create')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-95 cursor-pointer shrink-0"
            >
              <span className="text-white font-bold">{t('createPost')}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div
          onClick={() => navigateTo('scheduled')}
          className={`rounded-2xl p-3.5 sm:p-5 cursor-pointer relative overflow-hidden transition-all duration-200 group ${
            isSmooth
              ? 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-md hover:border-slate-300'
              : 'glass-card glass-card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${
              isSmooth ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {t('totalPosts')}
            </span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${
              isSmooth ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-500/10 text-blue-400'
            }`}>
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-3xl font-black transition-colors ${
            isSmooth ? 'text-slate-950 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
          }`}>
            {posts.length + 18}
          </div>
          <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${
            isSmooth ? 'text-emerald-700' : 'text-slate-400'
          }`}>
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            +8 this week
          </span>
        </div>

        <div
          onClick={() => navigateTo('accounts')}
          className={`rounded-2xl p-3.5 sm:p-5 cursor-pointer relative overflow-hidden transition-all duration-200 group ${
            isSmooth
              ? 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-md hover:border-slate-300'
              : 'glass-card glass-card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${
              isSmooth ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {t('connectedAccounts')}
            </span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${
              isSmooth ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-500/10 text-purple-400'
            }`}>
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-3xl font-black transition-colors ${
            isSmooth ? 'text-slate-950 group-hover:text-purple-600' : 'text-white group-hover:text-cyan-300'
          }`}>
            {connectedCount}
          </div>
          <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${
            isSmooth ? 'text-emerald-700' : 'text-emerald-400'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            Active Sync
          </span>
        </div>

        <div
          onClick={() => navigateTo('scheduled')}
          className={`rounded-2xl p-3.5 sm:p-5 cursor-pointer relative overflow-hidden transition-all duration-200 group ${
            isSmooth
              ? 'bg-white hover:bg-slate-50 border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] hover:shadow-md hover:border-slate-300'
              : 'glass-card glass-card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wider ${
              isSmooth ? 'text-slate-700' : 'text-slate-400'
            }`}>
              {t('scheduledPosts')}
            </span>
            <div className={`p-1.5 sm:p-2 rounded-xl ${
              isSmooth ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-cyan-500/10 text-cyan-400'
            }`}>
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-3xl font-black transition-colors ${
            isSmooth ? 'text-slate-950 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-300'
          }`}>
            {scheduledCount}
          </div>
          <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${
            isSmooth ? 'text-blue-700' : 'text-cyan-400'
          }`}>
            <Clock className="w-3 h-3" />
            Next tomorrow
          </span>
        </div>
      </div>

      {/* Visual Progress Tracker: Daily Broadcast Goals */}
      <DailyBroadcastGoalsTracker />

      {/* Analytics & Audience Insights Gateway Banner */}
      <div 
        onClick={() => navigateTo('analytics')}
        className={`p-4 sm:p-5 rounded-3xl transition-all cursor-pointer relative overflow-hidden group ${
          isSmooth
            ? 'bg-gradient-to-r from-sky-50/90 via-white to-purple-50/70 border border-slate-200/90 hover:border-blue-400 shadow-[0_2px_16px_-2px_rgba(15,23,42,0.06)] hover:shadow-md'
            : 'bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-purple-950/70 border border-sky-700/60 hover:border-cyan-500/80 shadow-xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl group-hover:scale-105 transition-transform ${
              isSmooth
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold transition-colors ${
                  isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
                }`}>
                  {t('analytics')} & Audience Insights
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  isSmooth
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                }`}>
                  Live Insights
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${
                isSmooth ? 'text-slate-600' : 'text-slate-300'
              }`}>
                Track video views, viewer age demographics, country distribution, and audience categories across all channels.
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0 ${
            isSmooth ? 'text-blue-600' : 'text-cyan-400'
          }`}>
            View Analytics <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className={`rounded-3xl p-5 sm:p-6 transition-all ${
        isSmooth
          ? 'bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)]'
          : 'glass-card border border-sky-800/60'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base sm:text-lg font-bold ${
              isSmooth ? 'text-slate-900' : 'text-white'
            }`}>
              {t('connectedAccounts')} & Channels
            </h3>
            <p className={`text-xs ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
              Live channels & multiple account IDs broadcasting your content
            </p>
          </div>
          <button
            onClick={() => navigateTo('accounts')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              isSmooth
                ? 'text-blue-600 hover:text-blue-700 bg-slate-50 border border-slate-200'
                : 'text-cyan-400 hover:text-cyan-300 bg-sky-950/60 border border-sky-800/60'
            }`}
          >
            {t('manageAll')} ({accounts.filter((a) => a.connected).length}) →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accounts.filter((a) => a.connected).slice(0, 4).map((acc) => (
            <div
              key={acc.id}
              onClick={() => navigateTo('accounts')}
              className={`p-3.5 rounded-2xl transition-all cursor-pointer group border ${
                isSmooth
                  ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/90'
                  : 'bg-[#051326] border-sky-900/60 hover:border-cyan-500/50 hover:bg-[#071c36]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <PlatformIcon platform={acc.platform} size="sm" />
                  <span className={`text-xs font-bold transition-colors truncate ${
                    isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {acc.name}
                  </span>
                </div>
                {acc.accountLabel && (
                  <span className={`text-[8px] font-mono px-1 rounded shrink-0 truncate max-w-[70px] ${
                    isSmooth
                      ? 'bg-slate-200 text-slate-700 border border-slate-300'
                      : 'bg-sky-950 border border-sky-800 text-cyan-300'
                  }`}>
                    {acc.accountLabel}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className={`truncate max-w-[85px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                  {acc.handle}
                </span>
                <span className={`font-semibold text-[10px] ${isSmooth ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  ● Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drafts Banner Shortcut */}
      {drafts.length > 0 && (
        <div
          onClick={() => navigateTo('drafts')}
          className={`p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all border ${
            isSmooth
              ? 'bg-gradient-to-r from-purple-50/80 via-white to-blue-50/80 border-purple-200 text-slate-900 hover:border-purple-300 shadow-sm'
              : 'bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-[#07172b] border-purple-800/40 hover:border-purple-600/60 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isSmooth ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-300'
            }`}>
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                You have {drafts.length} saved drafts
              </h4>
              <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                Continue editing "{drafts[0].title}"
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold ${isSmooth ? 'text-purple-700 hover:text-purple-900' : 'text-purple-400 hover:text-purple-300'}`}>
            Open Drafts →
          </span>
        </div>
      )}

      {/* Recent Activity List */}
      <div className={`rounded-3xl p-5 sm:p-6 transition-all ${
        isSmooth
          ? 'bg-white border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)]'
          : 'glass-card border border-sky-800/60'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base sm:text-lg font-bold ${
              isSmooth ? 'text-slate-900' : 'text-white'
            }`}>
              {t('recentActivity')}
            </h3>
            <p className={`text-xs ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time log of multi-channel publishing
            </p>
          </div>
          <button
            onClick={() => navigateTo('scheduled')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              isSmooth
                ? 'text-blue-600 hover:text-blue-700 bg-slate-50 border border-slate-200'
                : 'text-cyan-400 hover:text-cyan-300 bg-sky-950/60 border border-sky-800/60'
            }`}
          >
            {t('viewAll')} →
          </button>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isSmooth ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-[#051326] border-sky-950'
          }`}>
            <PlatformIcon platform="youtube" size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {t('videoUploadedTo')} YouTube 4K
              </p>
              <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                "Epic Drone Coastline Reveal" • 2 hours ago
              </span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
              isSmooth
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
            }`}>
              Published
            </span>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isSmooth ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-[#051326] border-sky-950'
          }`}>
            <PlatformIcon platform="facebook" size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {t('postPublishedOn')} Facebook
              </p>
              <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                "Sunset Time-lapse 4K" • 4 hours ago
              </span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
              isSmooth
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
            }`}>
              Published
            </span>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isSmooth ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-[#051326] border-sky-950'
          }`}>
            <PlatformIcon platform="instagram" size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {t('scheduledPostFor')} Instagram Reels
              </p>
              <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                "Nature Video | Beautiful World" • Scheduled for Sep 26, 10:30 AM
              </span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
              isSmooth
                ? 'text-sky-700 bg-sky-50 border-sky-200'
                : 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
            }`}>
              Scheduled
            </span>
          </div>

          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isSmooth ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-[#051326] border-sky-950'
          }`}>
            <PlatformIcon platform="tiktok" size="sm" />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {t('videoUploadedTo')} TikTok
              </p>
              <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                "Majestic Mountain Peaks" • 1 day ago
              </span>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
              isSmooth
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
            }`}>
              Published
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
