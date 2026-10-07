'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PreviewPostModal } from '../components/PreviewPostModal';
import { PlatformId } from '../types';
import { ArrowLeft, ArrowRight, Sparkles, Copy, Check, SlidersHorizontal, Eye } from 'lucide-react';

export const PlatformSettingsScreen: React.FC = () => {
  const {
    videoTitle,
    videoUrl,
    selectedPlatforms,
    selectedAccountIds,
    accounts,
    platformSettings,
    updatePlatformSetting,
    applyContentToAll,
    caption,
    hashtags,
    navigateTo,
    goBack,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PlatformId>(
    selectedPlatforms[0] || 'youtube'
  );
  const [showApplyToast, setShowApplyToast] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleApplyToAll = () => {
    applyContentToAll(caption, hashtags);
    setShowApplyToast(true);
    setTimeout(() => setShowApplyToast(false), 2200);
  };

  // Safe active platform
  const currentPlatform = selectedPlatforms.includes(activeTab)
    ? activeTab
    : selectedPlatforms[0] || 'youtube';

  const currentSetting = platformSettings[currentPlatform] || {
    caption: caption,
    title: caption.slice(0, 60),
    description: caption,
    hashtags: hashtags,
  };

  const currentPlatformAccounts = accounts.filter(
    (a) => a.platform === currentPlatform && a.connected && selectedAccountIds.includes(a.id)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t('platformSettings')}
            </h1>
            <p className="text-xs text-slate-400">
              {t('platformSettingsDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Post Action */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            title="Preview how customized captions look on each platform"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>Preview Post</span>
          </button>

          {/* Apply to All Action */}
          <button
            onClick={handleApplyToAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            title="Sync caption and hashtags to all selected platforms"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t('applyToAll')}</span>
          </button>
        </div>
      </div>

      {showApplyToast && (
        <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-purple-400" />
          <span>Synced main caption & hashtags across all selected platforms!</span>
        </div>
      )}

      {/* Platform Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {selectedPlatforms.map((p) => {
          const isActive = p === currentPlatform;
          return (
            <button
              key={p}
              onClick={() => setActiveTab(p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#0a2342] text-cyan-300 border-cyan-400 shadow-md shadow-cyan-950/50'
                  : 'bg-[#041122] text-slate-400 border-sky-900/60 hover:text-slate-200'
              }`}
            >
              <PlatformIcon platform={p} size="sm" />
              <span className="capitalize">{p}</span>
            </button>
          );
        })}
      </div>

      {/* Active Platform Customizer Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-sky-900/60">
          <div className="flex items-center gap-2.5">
            <PlatformIcon platform={currentPlatform} size="md" />
            <div>
              <h3 className="text-base font-bold text-white capitalize">
                {currentPlatform} Customizer
              </h3>
              <p className="text-[11px] text-cyan-400 font-mono">
                Platform-optimized formatting
              </p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-semibold">
            Auto-formatted
          </span>
        </div>

        {/* Broadcasting Channels Pill Box */}
        {currentPlatformAccounts.length > 0 && (
          <div className="p-3 rounded-2xl bg-[#030e1d] border border-sky-950 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Broadcasting to ({currentPlatformAccounts.length}):
            </span>
            {currentPlatformAccounts.map((acc) => (
              <span
                key={acc.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#06172d] border border-sky-800/80 text-[11px] text-cyan-300 font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{acc.handle}</span>
                {acc.accountLabel && (
                  <span className="text-[9px] text-slate-400">({acc.accountLabel})</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* YouTube Specific Settings */}
        {currentPlatform === 'youtube' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('youtubeTitle')}
              </label>
              <input
                type="text"
                value={currentSetting.title || ''}
                onChange={(e) =>
                  updatePlatformSetting('youtube', { title: e.target.value })
                }
                placeholder="Video title (up to 100 characters)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('youtubeDesc')}
              </label>
              <textarea
                rows={4}
                value={currentSetting.description || ''}
                onChange={(e) =>
                  updatePlatformSetting('youtube', { description: e.target.value })
                }
                placeholder="Detailed YouTube description and timestamps..."
                className="w-full p-3.5 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* Facebook Specific Settings */}
        {currentPlatform === 'facebook' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('facebookCaption')}
              </label>
              <textarea
                rows={4}
                value={currentSetting.caption || caption}
                onChange={(e) =>
                  updatePlatformSetting('facebook', { caption: e.target.value })
                }
                placeholder="Engaging Facebook post caption..."
                className="w-full p-3.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* Instagram Specific Settings */}
        {currentPlatform === 'instagram' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('instagramCaption')}
              </label>
              <textarea
                rows={4}
                value={currentSetting.caption || caption}
                onChange={(e) =>
                  updatePlatformSetting('instagram', { caption: e.target.value })
                }
                placeholder="Hook-driven Reels caption..."
                className="w-full p-3.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* TikTok Specific Settings */}
        {currentPlatform === 'tiktok' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {t('tiktokCaption')}
              </label>
              <textarea
                rows={3}
                value={currentSetting.caption || caption}
                onChange={(e) =>
                  updatePlatformSetting('tiktok', { caption: e.target.value })
                }
                placeholder="Viral short caption with #fyp..."
                className="w-full p-3.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* Hashtags Preview */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Target Hashtags for {currentPlatform}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(currentSetting.hashtags?.length ? currentSetting.hashtags : hashtags).map(
              (tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-sky-950 text-cyan-300 text-xs font-medium border border-sky-800"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={() => navigateTo('schedule')}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer"
      >
        <span>{t('continue')}</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
      </button>

      {/* Preview Post Modal */}
      <PreviewPostModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        videoTitle={videoTitle}
        caption={caption}
        hashtags={hashtags}
        videoUrl={videoUrl}
        selectedPlatforms={selectedPlatforms}
        accounts={accounts}
        selectedAccountIds={selectedAccountIds}
        platformSettings={platformSettings}
        t={t}
      />
    </div>
  );
};
