'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PlatformId } from '../types';
import { Video, Users2, Calendar, Sparkles, ArrowRight, CheckCircle2, FileEdit, Plus, AlertCircle } from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { user, accounts, posts, drafts, navigateTo, t, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';

  const connectedCount = accounts.filter((a) => a.connected).length;
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const connectedAccounts = accounts.filter((a) => a.connected);
  const recentPosts = posts.slice(0, 4);
  const firstName = (user.name || '').split(' ')[0];

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
              {t('hello')}{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className={`text-sm max-w-md font-medium ${
              isSmooth ? '!text-slate-600' : '!text-slate-300'
            }`} style={{ color: isSmooth ? '#475569' : '#cbd5e1' }}>
              {t('dashSubtitle')}
            </p>
          </div>

          <div className="flex gap-2">
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
            {posts.length}
          </div>
          <span className={`text-[10px] font-semibold flex items-center gap-1 mt-1 ${
            isSmooth ? 'text-emerald-700' : 'text-slate-400'
          }`}>
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            {publishedCount} published
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
            connectedCount > 0 ? (isSmooth ? 'text-emerald-700' : 'text-emerald-400') : (isSmooth ? 'text-amber-700' : 'text-amber-400')
          }`}>
            {connectedCount > 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {connectedCount > 0 ? 'Ready to publish' : 'Connect a channel'}
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
            <Calendar className="w-3 h-3" />
            Upcoming
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
              Channels your videos are published to
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
            {t('manageAll')} ({connectedCount}) →
          </button>
        </div>

        {connectedAccounts.length === 0 && (
          <button
            type="button"
            onClick={() => navigateTo('accounts')}
            className={`w-full p-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-sm font-bold cursor-pointer transition-colors ${
              isSmooth
                ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                : 'border-sky-700 text-cyan-300 hover:bg-sky-950/40'
            }`}
          >
            <Plus className="w-4 h-4" />
            Connect your YouTube channel
          </button>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {connectedAccounts.slice(0, 4).map((acc) => (
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
              Your latest posts
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
          {recentPosts.length === 0 && (
            <p className={`text-xs text-center py-6 ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
              No posts yet. Tap "{t('createPost')}" to publish your first video.
            </p>
          )}
          {recentPosts.map((post) => {
            const platform = (post.selectedPlatforms[0] ?? 'youtube') as PlatformId;
            const badge =
              post.status === 'published'
                ? { label: 'Published', cls: isSmooth ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' }
                : post.status === 'failed'
                ? { label: 'Failed', cls: isSmooth ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-rose-400 bg-rose-950/60 border-rose-800/60' }
                : { label: 'Scheduled', cls: isSmooth ? 'text-sky-700 bg-sky-50 border-sky-200' : 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
            return (
              <div
                key={post.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  isSmooth ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200' : 'bg-[#051326] border-sky-950'
                }`}
              >
                <PlatformIcon platform={platform} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                    {post.title}
                  </p>
                  <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.cls}`}>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
