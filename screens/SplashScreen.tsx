'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from '../components/AppLogo';
import { PlatformIcon } from '../components/PlatformIcon';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden bg-[#020713]">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Spacer / Mini Tag */}
      <div className="w-full flex justify-center pt-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-cyan-400 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          Unified Social Media Publishing
        </span>
      </div>

      {/* Center Hero */}
      <div className="flex flex-col items-center text-center max-w-md my-auto relative z-10">
        {/* Authentic Invariant Theme-Agnostic Application Logo */}
        <div className="relative group cursor-pointer mb-8">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 opacity-60 blur-xl group-hover:opacity-100 transition-opacity pointer-events-none" />
          <AppLogo size="xl" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
          OneClick<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Post</span>
        </h1>
        <p className="text-lg sm:text-xl font-bold text-cyan-300 mb-3 tracking-wide">
          {t('tagline')}
        </p>
        <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8">
          {t('splashSubtitle')}
        </p>

        {/* Social Platform Icons Row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 p-3 rounded-2xl bg-[#07172b]/60 border border-sky-900/40 backdrop-blur-lg">
          <PlatformIcon platform="youtube" size="md" />
          <PlatformIcon platform="facebook" size="md" />
          <PlatformIcon platform="instagram" size="md" />
          <PlatformIcon platform="tiktok" size="md" />
          <PlatformIcon platform="x" size="md" />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-md relative z-10 pb-6">
        <button
          onClick={() => navigateTo('welcome')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer"
        >
          <span>{t('getStarted')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-3">
          Version 1.0.0 • Free-first MVP Edition
        </p>
      </div>
    </div>
  );
};
