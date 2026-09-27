'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ANALYTICS_METRICS } from '../data/initialData';
import { PLATFORM_AUDIENCE_METRICS } from '../data/platformAudienceData';
import { PlatformIcon } from '../components/PlatformIcon';
import { PlatformId } from '../types';
import {
  exportSinglePlatformCSV,
  exportAllPlatformsComparisonCSV,
  exportComprehensiveAnalyticsCSV,
} from '../utils/exportCsv';
import {
  ArrowLeft,
  Eye,
  Heart,
  TrendingUp,
  Users2,
  Share2,
  MessageCircle,
  BarChart3,
  Calendar,
  Globe2,
  PieChart,
  Smartphone,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Filter,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { goBack, t, accounts, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';
  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'audience'>('audience');
  const [selectedAudiencePlatform, setSelectedAudiencePlatform] = useState<PlatformId>('youtube');
  const [isChangingPlatform, setIsChangingPlatform] = useState(false);
  const [filterView, setFilterView] = useState<'all' | 'connected'>('all');
  const [exportedToast, setExportedToast] = useState<string | null>(null);

  const handleSelectAudiencePlatform = (plat: PlatformId) => {
    if (plat === selectedAudiencePlatform || isChangingPlatform) return;
    setIsChangingPlatform(true);
    setTimeout(() => {
      setSelectedAudiencePlatform(plat);
      setIsChangingPlatform(false);
    }, 220);
  };

  const m = ANALYTICS_METRICS;
  const currentAudience = PLATFORM_AUDIENCE_METRICS[selectedAudiencePlatform] || PLATFORM_AUDIENCE_METRICS.youtube;

  // Available platforms list
  const allPlatforms: PlatformId[] = ['youtube', 'facebook', 'instagram', 'tiktok', 'x', 'linkedin', 'pinterest'];

  // Check which platforms have connected accounts in user profile
  const connectedPlatforms = Array.from(
    new Set(accounts.filter((a) => a.connected).map((a) => a.platform))
  );

  const displayPlatforms = filterView === 'connected' && connectedPlatforms.length > 0
    ? allPlatforms.filter((p) => connectedPlatforms.includes(p))
    : allPlatforms;

  const triggerToast = (msg: string) => {
    setExportedToast(msg);
    setTimeout(() => {
      setExportedToast(null);
    }, 2800);
  };

  const handleExportSinglePlatform = (e: React.MouseEvent, plat: PlatformId) => {
    e.stopPropagation();
    exportSinglePlatformCSV(plat);
    triggerToast(`Exported ${plat.toUpperCase()} view & audience data to CSV!`);
  };

  const handleExportComparison = () => {
    exportAllPlatformsComparisonCSV();
    triggerToast('Exported multi-platform engagement comparison to CSV!');
  };

  const handleExportComprehensive = () => {
    exportComprehensiveAnalyticsCSV();
    triggerToast('Exported comprehensive full analytics report to CSV!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Toast Notification */}
      {exportedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs font-bold shadow-2xl shadow-cyan-950/80 animate-in fade-in slide-in-from-top-3 backdrop-blur-md">
          <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-300">
            <Check className="w-4 h-4" />
          </div>
          <span>{exportedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#07182c] border-sky-800/80 text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-black ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {t('analytics')}
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                isSmooth
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                  : 'bg-cyan-950 border-cyan-800 text-cyan-400'
              }`}>
                Live Multi-Platform Sync
              </span>
            </div>
            <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
              Track platform reach, country demographics, viewer age groups, and audience categories
            </p>
          </div>
        </div>

        {/* Global Export & View Mode Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main CSV Export Action */}
          <button
            type="button"
            onClick={handleExportComprehensive}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer group border ${
              isSmooth
                ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-blue-500/20'
                : 'bg-cyan-950/70 hover:bg-cyan-900/80 border-cyan-700/80 text-cyan-300 shadow-cyan-950/40'
            }`}
            title="Download full cross-platform analytics and audience metrics in CSV format"
          >
            <Download className={`w-4 h-4 group-hover:translate-y-0.5 transition-transform ${
              isSmooth ? 'text-white' : 'text-cyan-400'
            }`} />
            <span className="hidden sm:inline">Export Full Report (CSV)</span>
            <span className="sm:hidden">Export CSV</span>
          </button>

          {/* View Mode Pills */}
          <div className={`flex p-1.5 rounded-2xl border self-start sm:self-auto ${
            isSmooth ? 'bg-slate-100 border-slate-200' : 'bg-[#051326] border-sky-900/60'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : isSmooth
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('overview')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('platforms')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'platforms'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : isSmooth
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('platformsTab')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audience')}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'audience'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : isSmooth
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>{t('audienceTab')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main 6 KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                {t('totalViews')}
              </span>
              <div className="text-2xl font-black text-white">{m.totalViews}</div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +18.4% vs last mo
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                {t('engagement')}
              </span>
              <div className="text-2xl font-black text-white">{m.totalEngagements}</div>
              <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 mt-1">
                <Heart className="w-3 h-3 fill-current" /> High conversion
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                {t('engagementRate')}
              </span>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {m.engagementRate}
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                Top 5% creator tier
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                {t('followersSubscribers')}
              </span>
              <div className="text-2xl font-black text-white">{m.followersTotal}</div>
              <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 mt-1">
                Across 5 active channels
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                {t('growth')}
              </span>
              <div className="text-2xl font-black text-emerald-400">
                {m.growthPercent}
              </div>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                Monthly trajectory
              </span>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-sky-800/60">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                Published Posts
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {m.publishedPostsCount}
              </div>
              <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 mt-1">
                100% broadcast rate
              </span>
            </div>
          </div>

          {/* Interactive Views Growth Chart */}
          <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t('viewsGrowth')}
                </h3>
                <p className="text-xs text-slate-400">
                  Daily aggregated video views across all connected platforms
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportComparison}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#091f3a] hover:bg-[#0c2b50] border border-cyan-800/80 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
                  title="Export 30-day views timeline and channel metrics to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>

                <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                  Last 30 Days
                </span>
              </div>
            </div>

            {/* Bar & Curve Graph */}
            <div className="h-56 w-full flex items-end justify-between gap-1 sm:gap-3 pt-6 pb-2 px-1">
              {m.monthlyViewsData.map((item, idx) => {
                const max = 15000;
                const heightPercent = Math.round((item.views / max) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex items-end justify-center h-44">
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-sky-950 border border-cyan-400 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                        {item.views.toLocaleString()} views
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-purple-700 via-blue-600 to-cyan-400 group-hover:brightness-125 transition-all shadow-md shadow-cyan-500/20"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PLATFORMS LIST WITH DIRECT AUDIENCE DEEP-DIVE TRIGGER */}
      {/* ========================================================================= */}
      {activeTab === 'platforms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              Click on any platform card to inspect its detailed age, location, and audience categories:
            </p>

            <button
              type="button"
              onClick={handleExportComparison}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-700/80 text-cyan-300 text-xs font-bold transition-all shadow-md shadow-cyan-950/40 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Comparison (CSV)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {m.platformBreakdown.map((item) => {
              const pData = PLATFORM_AUDIENCE_METRICS[item.platform as PlatformId];

              return (
                <div
                  key={item.platform}
                  onClick={() => {
                    setSelectedAudiencePlatform(item.platform as PlatformId);
                    setActiveTab('audience');
                  }}
                  className="glass-card rounded-3xl p-5 border border-sky-800/60 hover:border-cyan-500/70 shadow-xl space-y-4 transition-all cursor-pointer group hover:bg-[#071b36] relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-sky-900/60">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={item.platform as any} size="md" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white capitalize group-hover:text-cyan-300 transition-colors">
                            {item.platform} Channel
                          </h4>
                          <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Audience ↗
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Growth: {item.growth}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-cyan-300 font-mono">
                        {item.views} Views
                      </span>

                      {/* Card-level CSV Export Button */}
                      <button
                        type="button"
                        onClick={(e) => handleExportSinglePlatform(e, item.platform as PlatformId)}
                        className="p-1.5 rounded-lg bg-[#040e1d] hover:bg-cyan-950 border border-sky-900 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                        title={`Export ${item.platform} data as CSV`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3 Main Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-[#030d1d] border border-sky-950">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        <span className="text-[10px]">Likes</span>
                      </div>
                      <span className="font-bold text-white">{item.likes}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#030d1d] border border-sky-950">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                        <MessageCircle className="w-3 h-3 text-cyan-400" />
                        <span className="text-[10px]">Comments</span>
                      </div>
                      <span className="font-bold text-white">{item.comments}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#030d1d] border border-sky-950">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                        <Share2 className="w-3 h-3 text-purple-400" />
                        <span className="text-[10px]">Shares</span>
                      </div>
                      <span className="font-bold text-white">{item.shares}</span>
                    </div>
                  </div>

                  {/* Quick Demographic Preview Snippet */}
                  {pData && (
                    <div className="pt-2 border-t border-sky-950/70 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                        <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Top: {pData.topLocations[0]?.country} ({pData.topLocations[0]?.percent}%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300 font-semibold group-hover:underline flex items-center gap-0.5">
                          <span>Age & Categories</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PLATFORM-SPECIFIC AUDIENCE DEMOGRAPHICS */}
      {/* ========================================================================= */}
      {activeTab === 'audience' && (
        <div className="space-y-6">

          {/* Interactive Platform Selector Bar */}
          <div className={`rounded-3xl p-4 sm:p-5 border space-y-3 transition-all ${
            isSmooth
              ? 'bg-white border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]'
              : 'glass-card border-sky-800/80 shadow-2xl bg-gradient-to-r from-[#061935] via-[#051326] to-[#081a38]'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  isSmooth ? 'text-blue-700' : 'text-cyan-400'
                }`}>
                  <Filter className="w-3.5 h-3.5" />
                  Select Platform for Dedicated Audience Breakdown
                </span>
                <p className={`text-[11px] ${isSmooth ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                  Tap any platform to inspect exact age groups, countries, and audience interest categories:
                </p>
              </div>

              {/* Connected filter pill & Export Current Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleExportSinglePlatform(e, selectedAudiencePlatform)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                    isSmooth
                      ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white'
                      : 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-700/80 text-cyan-300 shadow-cyan-950/40'
                  }`}
                  title={`Export ${selectedAudiencePlatform} audience and engagement as CSV`}
                >
                  <Download className={`w-3.5 h-3.5 ${isSmooth ? 'text-white' : 'text-cyan-400'}`} />
                  <span>Export {selectedAudiencePlatform.toUpperCase()} (CSV)</span>
                </button>

                <div className={`flex items-center gap-1 text-[11px] p-1 rounded-xl border ${
                  isSmooth ? 'bg-slate-100 border-slate-200' : 'bg-[#030d1d] border-sky-900/60'
                }`}>
                  <button
                    type="button"
                    onClick={() => setFilterView('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterView === 'all'
                        ? isSmooth
                          ? 'bg-white text-blue-700 border border-slate-300 font-extrabold shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : isSmooth
                        ? 'text-slate-600 hover:text-slate-900 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterView('connected')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterView === 'connected'
                        ? isSmooth
                          ? 'bg-white text-blue-700 border border-slate-300 font-extrabold shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : isSmooth
                        ? 'text-slate-600 hover:text-slate-900 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Connected ({connectedPlatforms.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Selection Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1">
              {displayPlatforms.map((plat) => {
                const isSelected = plat === selectedAudiencePlatform;
                const pMetrics = PLATFORM_AUDIENCE_METRICS[plat];

                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => handleSelectAudiencePlatform(plat)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? isSmooth
                          ? 'bg-blue-50/90 text-slate-950 border-2 border-blue-600 shadow-md scale-[1.02]'
                          : 'bg-gradient-to-r from-sky-900 to-[#0c315e] text-white border-cyan-400 shadow-lg shadow-cyan-950/60 scale-[1.02]'
                        : isSmooth
                        ? 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                        : 'bg-[#030d1d] text-slate-300 border-sky-950 hover:bg-[#071d3d] hover:border-sky-800'
                    }`}
                  >
                    <PlatformIcon platform={plat} size="sm" />
                    <div className="text-left">
                      <div className={`capitalize flex items-center gap-1 font-bold ${
                        isSelected && isSmooth ? 'text-blue-900' : isSmooth ? 'text-slate-900' : 'text-white'
                      }`}>
                        <span>{plat}</span>
                        {isSelected && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isSmooth ? 'bg-blue-600' : 'bg-cyan-400'}`} />
                        )}
                      </div>
                      <span className={`text-[10px] font-mono font-medium ${
                        isSelected && isSmooth ? 'text-blue-700 font-bold' : isSmooth ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {pMetrics?.totalViews} views
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Platform Audience Insights with Smooth Entry & Exit Transition */}
          <div 
            key={selectedAudiencePlatform}
            className={`space-y-6 ${
              isChangingPlatform
                ? 'animate-audience-exit pointer-events-none'
                : 'animate-audience-enter'
            }`}
          >
            {/* Active Platform Header Banner with Export CSV Button */}
            <div className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              isSmooth
                ? 'bg-white border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]'
                : 'bg-gradient-to-r from-[#0a274c] via-[#06182e] to-[#082244] border-sky-700/60'
            } ${isChangingPlatform ? 'animate-kpi-exit' : 'animate-kpi-enter'}`}>
              <div className="flex items-center gap-3.5">
                <PlatformIcon platform={currentAudience.platform} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg font-black ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                      {currentAudience.platformName} Audience
                    </h2>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                      isSmooth
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-emerald-950/90 border-emerald-800 text-emerald-400'
                    }`}>
                      {currentAudience.growth} MoM
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isSmooth ? 'text-slate-700 font-semibold' : 'text-slate-300'}`}>
                    {currentAudience.primaryDemographicSummary}
                  </p>
                </div>
              </div>

              {/* Quick Stats Pill & Export Button */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                <div className={`flex items-center gap-3 shrink-0 p-2.5 rounded-2xl border text-xs ${
                  isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#030c1a]/90 border-sky-900'
                }`}>
                  <div className={`px-2 border-r ${isSmooth ? 'border-slate-200' : 'border-sky-900'}`}>
                    <span className={`text-[10px] uppercase block font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>Avg Watch</span>
                    <span className={`font-mono font-bold ${isSmooth ? 'text-blue-700' : 'text-cyan-300'}`}>{currentAudience.avgWatchTime}</span>
                  </div>
                  <div className={`px-2 border-r ${isSmooth ? 'border-slate-200' : 'border-sky-900'}`}>
                    <span className={`text-[10px] uppercase block font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>Retention</span>
                    <span className={`font-mono font-bold ${isSmooth ? 'text-emerald-700' : 'text-emerald-400'}`}>{currentAudience.retentionRate}</span>
                  </div>
                  <div className="px-2">
                    <span className={`text-[10px] uppercase block font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>Peak Hours</span>
                    <span className={`font-mono font-bold ${isSmooth ? 'text-slate-800' : 'text-slate-200'}`}>{currentAudience.peakActiveHours.split('(')[0]}</span>
                  </div>
                </div>

                {/* Dedicated Platform Export Button */}
                <button
                  type="button"
                  onClick={(e) => handleExportSinglePlatform(e, currentAudience.platform)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                    isSmooth
                      ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-blue-500/20'
                      : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/70 text-cyan-300 shadow-cyan-950/50'
                  }`}
                  title={`Export ${currentAudience.platformName} view & audience data to CSV`}
                >
                  <Download className={`w-4 h-4 ${isSmooth ? 'text-white' : 'text-cyan-400'}`} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Grid of 2 Main Demographic Cards: Age & Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 1. Age Demographics Box for Selected Platform */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-sky-900/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-cyan-400" />
                    <span>Age Demographics ({currentAudience.platformName})</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                      {currentAudience.ageGroups.reduce((a, b) => (a.percent > b.percent ? a : b)).range} Dominant
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleExportSinglePlatform(e, currentAudience.platform)}
                      className="p-1 rounded-lg bg-[#030d1d] hover:bg-cyan-950 border border-sky-900 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Export Age Demographics data to CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {currentAudience.ageGroups.map((age, idx) => (
                    <div 
                      key={`${selectedAudiencePlatform}-age-${age.range}`} 
                      className={`space-y-1.5 ${isChangingPlatform ? 'animate-stagger-row-exit' : 'animate-stagger-row'}`}
                      style={{ 
                        animationDelay: isChangingPlatform 
                          ? `${(currentAudience.ageGroups.length - 1 - idx) * 30}ms` 
                          : `${idx * 60}ms` 
                      }}
                    >
                      <div className="flex justify-between text-xs items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 font-bold">{age.range} years</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (~{age.countLabel} viewers)
                          </span>
                        </div>
                        <span className="text-cyan-300 font-mono font-extrabold text-sm">
                          {age.percent}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-900/90 overflow-hidden border border-sky-950 p-[1px]">
                        <div
                          style={{ 
                            width: `${age.percent}%`,
                            animationDelay: isChangingPlatform 
                              ? `${(currentAudience.ageGroups.length - 1 - idx) * 30}ms` 
                              : `${idx * 60 + 80}ms`
                          }}
                          className={`h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 shadow-md shadow-cyan-500/30 transition-all duration-700 ${
                            isChangingPlatform ? 'animate-demographic-bar-exit' : 'animate-demographic-bar'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gender Split within this platform */}
                <div className="pt-3 border-t border-sky-900/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Gender Split:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {currentAudience.gender.map((g) => (
                      <div key={g.type} className="p-2 rounded-xl bg-[#030d1d] border border-sky-950">
                        <span className="text-[10px] text-slate-400 block truncate">{g.type}</span>
                        <span className="font-bold text-white font-mono">{g.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Top Audience Locations (Countries) for Selected Platform */}
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-sky-900/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-purple-400" />
                    <span>Top Countries & Regions ({currentAudience.platformName})</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-purple-300">
                      5 Key Geographies
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleExportSinglePlatform(e, currentAudience.platform)}
                      className="p-1 rounded-lg bg-[#030d1d] hover:bg-cyan-950 border border-sky-900 text-slate-400 hover:text-cyan-300 transition-colors"
                      title="Export Country Demographics data to CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {currentAudience.topLocations.map((loc, idx) => (
                    <div
                      key={`${selectedAudiencePlatform}-loc-${loc.country}`}
                      className={`p-3 rounded-2xl bg-[#030d1d] hover:bg-[#071d3a] border border-sky-950 transition-colors text-xs space-y-2 ${
                        isChangingPlatform ? 'animate-stagger-row-exit' : 'animate-stagger-row'
                      }`}
                      style={{ 
                        animationDelay: isChangingPlatform 
                          ? `${(currentAudience.topLocations.length - 1 - idx) * 30}ms` 
                          : `${idx * 60}ms` 
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center text-slate-500 font-mono text-[10px]">
                            #{idx + 1}
                          </span>
                          <span className="text-xl leading-none">{loc.flag}</span>
                          <div>
                            <span className="font-bold text-slate-100 block">
                              {loc.country}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {loc.viewers} active audience
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-cyan-400 font-extrabold text-sm block">
                            {loc.percent}%
                          </span>
                          <span className="text-[9px] text-slate-500">share</span>
                        </div>
                      </div>

                      {/* Country Demographic Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-900/90 overflow-hidden border border-sky-950/80 p-[1px]">
                        <div
                          style={{ 
                            width: `${loc.percent}%`,
                            animationDelay: isChangingPlatform 
                              ? `${(currentAudience.topLocations.length - 1 - idx) * 30}ms` 
                              : `${idx * 60 + 100}ms`
                          }}
                          className={`h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ${
                            isChangingPlatform ? 'animate-demographic-bar-exit' : 'animate-demographic-bar'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Device Type Breakdown */}
                <div className="pt-2 border-t border-sky-900/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Viewer Device Types:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {currentAudience.deviceBreakdown.map((d) => (
                      <div key={d.device} className="p-2 rounded-xl bg-[#030d1d] border border-sky-950">
                        <span className="text-sm block">{d.icon}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{d.device}</span>
                        <span className="font-bold text-cyan-300 font-mono">{d.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Audience Interest & Category Breakdown (কোন ক্যাটাগরির অডিয়েন্স দেখছে) */}
            <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-sky-900/60">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <PieChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Audience Categories & Interests ({currentAudience.platformName})
                    </h3>
                    <p className="text-xs text-slate-400">
                      What specific categories, niches, and topics your viewers on {currentAudience.platformName} engage with most
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800">
                    AI Category Affinity
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleExportSinglePlatform(e, currentAudience.platform)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#030d1d] hover:bg-cyan-950 border border-sky-800 text-xs text-cyan-300 font-semibold transition-colors"
                    title="Export Categories data to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {currentAudience.audienceCategories.map((cat, idx) => (
                  <div
                    key={`${selectedAudiencePlatform}-cat-${cat.category}`}
                    className={`p-4 rounded-2xl bg-[#030d1d] border border-sky-950 hover:border-cyan-500/50 transition-all space-y-2 group ${
                      isChangingPlatform ? 'animate-stagger-row-exit' : 'animate-stagger-row'
                    }`}
                    style={{ 
                      animationDelay: isChangingPlatform 
                        ? `${(currentAudience.audienceCategories.length - 1 - idx) * 30}ms` 
                        : `${idx * 50 + 100}ms` 
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-[#071a33] text-cyan-400 flex items-center justify-center font-mono text-xs font-bold border border-sky-900">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {cat.category}
                        </span>
                      </div>
                      <span className="font-mono text-cyan-400 font-extrabold text-sm">
                        {cat.percent}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ 
                          width: `${cat.percent}%`,
                          animationDelay: isChangingPlatform 
                            ? `${(currentAudience.audienceCategories.length - 1 - idx) * 30}ms` 
                            : `${idx * 60 + 140}ms`
                        }}
                        className={`h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-700 ${
                          isChangingPlatform ? 'animate-demographic-bar-exit' : 'animate-demographic-bar'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
