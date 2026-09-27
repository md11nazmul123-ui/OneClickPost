'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export const UploadingScreen: React.FC = () => {
  const {
    uploadProgress,
    platformUploadStatus,
    selectedPlatforms,
    accounts,
    videoFileName,
    navigateTo,
    t,
  } = useApp();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 max-w-lg mx-auto space-y-6">
      <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-sky-800/70 shadow-2xl text-center space-y-6">
        {/* Animated Circular Progress Gauge */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#071b33"
              strokeWidth="8"
            />
            {/* Gradient progress ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - uploadProgress / 100)}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {uploadProgress}%
            </span>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mt-0.5">
              {uploadProgress >= 100 ? 'Finalizing' : 'Uploading'}
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            {t('uploadingTitle')}
          </h2>
          <p className="text-xs text-slate-400">
            {videoFileName || 'Processing video file for multi-platform delivery'}
          </p>
        </div>

        {/* Platform Status Breakdown */}
        <div className="space-y-2 text-left bg-[#030e1d] p-4 rounded-2xl border border-sky-950">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Broadcasting Channels & Accounts:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              {Object.keys(platformUploadStatus).length} Total Destinations
            </span>
          </div>

          {Object.keys(platformUploadStatus).length > 0 ? (
            Object.entries(platformUploadStatus).map(([key, item]) => {
              const currentStatus = item.status || 'uploading';
              const isDone = currentStatus === 'published';
              const isFailed = currentStatus === 'failed';
              const account = accounts.find((a) => a.id === key);
              const platformId: any = account ? account.platform : key;
              const displayName = account ? `${account.name} (${account.handle})` : key.toUpperCase();
              const label = account?.accountLabel;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#06182c]/80 border border-sky-900/40 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <PlatformIcon platform={platformId} size="sm" />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 truncate">
                          {displayName}
                        </span>
                        {label && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-cyan-300 font-mono shrink-0">
                            {label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isDone ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{t('done')}</span>
                      </span>
                    ) : isFailed ? (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{t('failed')}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Transmitting...</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            selectedPlatforms.map((p) => {
              const currentStatus = platformUploadStatus[p]?.status || 'uploading';
              const isDone = currentStatus === 'published';
              const isFailed = currentStatus === 'failed';

              return (
                <div
                  key={p}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#06182c]/80 border border-sky-900/40 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <PlatformIcon platform={p} size="sm" />
                    <span className="font-semibold text-slate-200 capitalize">
                      {p}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{t('done')}</span>
                      </span>
                    ) : isFailed ? (
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{t('failed')}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-cyan-400 font-mono">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Transmitting...</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Manual Result button once progress is high */}
        {uploadProgress >= 60 && (
          <button
            type="button"
            onClick={() => navigateTo('success')}
            className="w-full py-3 px-4 rounded-xl bg-[#092244] hover:bg-[#0d2e5b] border border-sky-700/80 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{t('viewResult')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
