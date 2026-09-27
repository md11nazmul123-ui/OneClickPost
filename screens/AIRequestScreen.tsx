'use client';

import React from 'react';
import { AIRequestPanel } from '../components/AIRequestPanel';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sparkles, ShieldCheck, Database, Cpu } from 'lucide-react';

export const AIRequestScreen: React.FC = () => {
  const { navigateTo, user } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ড্যাশবোর্ডে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Features Hub</span>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-800/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Google Gemini AI Features</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900 text-blue-300 font-semibold">
                Smart Tools
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              স্মার্ট ভিডিও ক্যাপশন ও ভাইরাল হ্যাশট্যাগ তৈরির বিশেষ ফিচার সুবিধা।
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-300 text-xs">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> নিরাপদ যাচাইকরণ
          </span>
        </div>
      </div>

      {/* Render the Next.js Form Component directly */}
      <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <AIRequestPanel />
      </div>
    </div>
  );
};
