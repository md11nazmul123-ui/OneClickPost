'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)] relative z-10 border border-slate-200">
        {/* Visual Phone / Floating Art */}
        <div className="relative h-48 w-full flex items-center justify-center mb-6">
          {/* Floating Platform Badges */}
          <div className="absolute top-3 left-4 w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-900/50 animate-bounce duration-1000">
            ▶
          </div>
          <div className="absolute top-2 right-6 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50 animate-pulse">
            f
          </div>
          <div className="absolute bottom-4 left-6 w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/50">
            ◎
          </div>
          <div className="absolute bottom-3 right-5 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-lg shadow-blue-500/20">
            ♪
          </div>

          {/* Central Mock Phone Frame */}
          <div className="w-28 h-40 rounded-3xl bg-gradient-to-b from-white to-sky-50 border-4 border-sky-400/70 shadow-2xl shadow-sky-500/20 flex flex-col items-center justify-center p-2 relative">
            <div className="w-8 h-1 rounded-full bg-slate-300 mb-2" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <span className="text-[9px] font-bold text-blue-600 mt-2">1-Click Viral</span>
            <div className="w-10 h-1 rounded-full bg-blue-500/30 mt-1" />
          </div>
        </div>

        {/* Text Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-2">
            {t('welcomeTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('welcomeDesc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Create account */}
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t('login')}
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Official OAuth Security • Encrypted Tokens</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-semibold text-slate-500">
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};
