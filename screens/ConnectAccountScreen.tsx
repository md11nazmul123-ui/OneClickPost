'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PlatformId } from '../types';
import { AddChannelModal } from '../components/AddChannelModal';
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

export const ConnectAccountScreen: React.FC = () => {
  const { accounts, openOAuthModal, goBack, t, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';
  const [addChannelPlatform, setAddChannelPlatform] = useState<PlatformId | null>(null);

  const platformGuides: {
    id: PlatformId;
    name: string;
    flowText: string;
    description: string;
  }[] = [
    {
      id: 'youtube',
      name: 'YouTube',
      flowText: 'Connect with OAuth',
      description: 'Upload 4K videos, shorts, and access channel analytics.',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      flowText: 'Connect Pages / Account',
      description: 'Publish videos directly to creator and brand pages.',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      flowText: 'Connect Professional Account',
      description: 'Post Reels and video feed posts with full insights.',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      flowText: 'Connect with OAuth',
      description: 'Direct publishing to TikTok with FYP sound and tags.',
    },
    {
      id: 'x',
      name: 'X / Twitter',
      flowText: 'Connect with OAuth',
      description: 'Share video clips and threads with media previews.',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      flowText: 'Connect with OAuth',
      description: 'Publish high-engagement Idea Pins and video pins.',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      flowText: 'Connect with OAuth',
      description: 'Broadcast corporate & creator updates to professionals.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
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
          <h1 className={`text-xl sm:text-2xl font-black ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
            {t('connectAccount')}
          </h1>
          <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('connectAccountDesc')}
          </p>
        </div>
      </div>

      {/* Official OAuth Security Note */}
      <div
        className={`p-4 rounded-3xl border flex items-start gap-3 shadow-xl ${
          isSmooth
            ? 'bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/80 border-blue-200/90'
            : 'bg-gradient-to-r from-blue-950/50 via-sky-950/40 to-[#07182c] border-sky-700/60'
        }`}
      >
        <div
          className={`p-2.5 rounded-2xl shrink-0 ${
            isSmooth ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-cyan-500/20 text-cyan-300'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className={`text-xs font-bold mb-0.5 ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
            100% Official OAuth 2.0 Security
          </h4>
          <p className={`text-[11px] leading-relaxed ${isSmooth ? 'text-slate-600' : 'text-slate-300'}`}>
            {t('officialOAuthNotice')}
          </p>
        </div>
      </div>

      {/* Platforms List */}
      <div className="space-y-3">
        {platformGuides.map((item) => {
          const existing = accounts.find((a) => a.platform === item.id);
          const isConnected = Boolean(existing?.connected);

          return (
            <div
              key={item.id}
              onClick={() => openOAuthModal(item.id)}
              className={`rounded-2xl p-4 border flex items-center justify-between gap-4 cursor-pointer group transition-all ${
                isSmooth
                  ? 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md'
                  : 'glass-card glass-card-hover border-sky-800/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <PlatformIcon platform={item.id} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold transition-colors ${
                      isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {item.name}
                    </span>
                    {isConnected && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        isSmooth
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                      }`}>
                        Connected
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium mt-0.5 ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`}>
                    {item.flowText}
                  </p>
                  <p className={`text-[11px] ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddChannelPlatform(item.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isSmooth
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        : 'bg-sky-950 hover:bg-sky-900 border-sky-800/80 text-cyan-300 hover:text-white'
                    }`}
                    title={`Add another ${item.name} channel or ID`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="hidden sm:inline">Add Another ID</span>
                  </button>
                )}
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    isSmooth
                      ? 'bg-slate-100 border-slate-200 text-slate-600 group-hover:bg-blue-600 group-hover:text-white'
                      : 'bg-sky-950 border-sky-800/60 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Additional Channel Modal */}
      {addChannelPlatform && (
        <AddChannelModal
          isOpen={Boolean(addChannelPlatform)}
          platform={addChannelPlatform}
          onClose={() => setAddChannelPlatform(null)}
        />
      )}
    </div>
  );
};
