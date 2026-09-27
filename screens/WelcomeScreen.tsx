'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Play } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, t } = useApp();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020713]">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-sky-800/70">
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
          <div className="absolute bottom-3 right-5 w-10 h-10 rounded-xl bg-neutral-900 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold shadow-lg shadow-cyan-900/40">
            ♪
          </div>

          {/* Central Mock Phone Frame */}
          <div className="w-28 h-40 rounded-3xl bg-gradient-to-b from-[#0e2747] to-[#040e1f] border-4 border-sky-600/80 shadow-2xl shadow-cyan-500/20 flex flex-col items-center justify-center p-2 relative">
            <div className="w-8 h-1 rounded-full bg-sky-800 mb-2" />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
            <span className="text-[9px] font-bold text-cyan-300 mt-2">1-Click Viral</span>
            <div className="w-10 h-1 rounded-full bg-cyan-500/40 mt-1" />
          </div>
        </div>

        {/* Text Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {t('welcomeTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('welcomeDesc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Continue with Google */}
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('continueWithGoogle')}</span>
          </button>

          {/* Standard Log In / Get Started */}
          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigateTo('dashboard')}
            className="w-full py-3 px-4 rounded-xl bg-[#081a33] hover:bg-[#0c264c] border border-sky-800/80 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t('login')}
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-6 pt-4 border-t border-sky-900/50 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Official OAuth Security • End-to-end Encrypted</span>
        </div>
      </div>
    </div>
  );
};
