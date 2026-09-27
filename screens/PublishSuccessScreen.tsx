'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PlatformId } from '../types';
import {
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Check,
  XCircle,
  Home,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const PublishSuccessScreen: React.FC = () => {
  const {
    lastPublishedPost,
    platformUploadStatus,
    accounts,
    retryPlatformUpload,
    navigateTo,
    setSelectedPostDetail,
    t,
  } = useApp();

  const results = platformUploadStatus;
  const resultKeys = Object.keys(results);

  const hasFailed = resultKeys.some((k) => results[k]?.status === 'failed');

  const handleViewPost = () => {
    if (lastPublishedPost) {
      setSelectedPostDetail(lastPublishedPost);
      navigateTo('postDetail');
    } else {
      navigateTo('scheduled');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-28 space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-800/70 shadow-2xl text-center space-y-6">
        {/* Success Icon with Glow */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-[3px] shadow-lg shadow-emerald-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#03131e] rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div>
          <h2 className="text-2xl font-black text-white mb-1.5">
            {lastPublishedPost?.publishType === 'schedule'
              ? 'Scheduled Successfully!'
              : t('publishedSuccess')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('publishedSuccessDesc')}
          </p>
        </div>

        {/* Platform-wise Outcomes */}
        <div className="space-y-2.5 text-left bg-[#030e1d] p-4 rounded-2xl border border-sky-950">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Multi-Channel Broadcast Status:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {resultKeys.length} channels updated
            </span>
          </div>

          {resultKeys.map((key) => {
            const res = results[key];
            const isSuccess = res?.status === 'published';
            const isFailed = res?.status === 'failed';
            const account = accounts.find((a) => a.id === key);
            const platformId: any = account ? account.platform : key;
            const displayName = account ? `${account.name} (${account.handle})` : key.toUpperCase();
            const label = account?.accountLabel;

            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#06182c] border border-sky-900/50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <PlatformIcon platform={platformId} size="sm" />
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate block">
                        {displayName}
                      </span>
                      {label && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-cyan-300 font-mono shrink-0">
                          {label}
                        </span>
                      )}
                    </div>
                    {res?.error && (
                      <span className="text-[10px] text-rose-400">
                        {res.error}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSuccess && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{t('published')}</span>
                    </span>
                  )}

                  {isFailed && (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-800/60">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('failed')}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => retryPlatformUpload(key)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-900/80 hover:bg-sky-800 text-cyan-300 text-xs font-semibold transition-colors cursor-pointer"
                        title="Retry upload on failed channel"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}

                  {!isSuccess && !isFailed && (
                    <span className="text-xs text-cyan-400 font-medium">
                      Queued
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleViewPost}
            className="w-full py-3.5 px-4 rounded-xl bg-[#081f3b] hover:bg-[#0c2c54] border border-sky-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t('viewPost')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t('done')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
