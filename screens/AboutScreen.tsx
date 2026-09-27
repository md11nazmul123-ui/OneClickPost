'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/AppLogo';
import { PlatformIcon } from '../components/PlatformIcon';
import { ArrowLeft, Shield, Sparkles, Code2, Server, Database } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const { goBack, t } = useApp();

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t('aboutApp')}
          </h1>
          <p className="text-xs text-slate-400">
            System specifications and platform mission
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-800/70 shadow-2xl space-y-6 text-center">
        {/* App Logo */}
        <div className="flex justify-center mx-auto mb-2">
          <AppLogo size="lg" />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">OneClickPost</h2>
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-1">
            {t('tagline')}
          </p>
          <span className="inline-block mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-sky-950 border border-sky-800 text-slate-300">
            Version 1.0.0 (Production Release)
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed text-left bg-[#030d1d] p-4 rounded-2xl border border-sky-950">
          OneClickPost eliminates creator friction. Upload your video once to automatically broadcast optimized titles, descriptions, and hashtags to YouTube, Facebook, Instagram, TikTok, and X simultaneously.
        </p>

        {/* Platform Capabilities Overview */}
        <div className="text-left space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Core Platform Features:
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#041122] border border-sky-900/60">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Platform</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simultaneous upload to 5+ global networks
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#041122] border border-sky-900/60">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Captions</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Platform-optimized titles & viral hashtags
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#041122] border border-sky-900/60">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Analytics Sync</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audience demographics & viewer reports
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#041122] border border-sky-900/60">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Account Security</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official OAuth 2.0 PKCE Protected
              </p>
            </div>
          </div>
        </div>

        {/* Supported Platforms icons */}
        <div className="pt-2 border-t border-sky-900/50 flex items-center justify-center gap-3">
          <PlatformIcon platform="youtube" size="sm" />
          <PlatformIcon platform="facebook" size="sm" />
          <PlatformIcon platform="instagram" size="sm" />
          <PlatformIcon platform="tiktok" size="sm" />
          <PlatformIcon platform="x" size="sm" />
        </div>
      </div>
    </div>
  );
};
