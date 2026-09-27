'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { SocialAccount, PlatformId } from '../types';
import { AddChannelModal } from '../components/AddChannelModal';
import {
  ArrowLeft,
  Plus,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const AccountsScreen: React.FC = () => {
  const {
    accounts,
    setSelectedAccountDetail,
    openOAuthModal,
    navigateTo,
    goBack,
    t,
    theme,
  } = useApp();

  const isSmooth = theme === 'smooth' || theme === 'light';
  const [addChannelPlatform, setAddChannelPlatform] = useState<PlatformId | null>(null);

  const handleSelectAccount = (acc: SocialAccount) => {
    setSelectedAccountDetail(acc);
    navigateTo('accountDetail');
  };

  const connectedAccounts = accounts.filter((a) => a.connected);
  const unconnectedAccounts = accounts.filter((a) => !a.connected);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
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
              {t('accounts')} & Channels
            </h1>
            <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
              Manage multiple IDs and channels per platform (YouTube, Facebook, etc.)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('connect')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Connect Channel</span>
        </button>
      </div>

      {/* Connect More Banner */}
      <div
        onClick={() => navigateTo('connect')}
        className={`rounded-3xl p-5 border flex items-center justify-between gap-4 cursor-pointer group shadow-xl transition-all ${
          isSmooth
            ? 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]'
            : 'glass-card border-cyan-500/40 hover:border-cyan-400'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h3 className={`text-base font-bold transition-colors ${
              isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
            }`}>
              {t('connectMoreAccounts')}
            </h3>
            <p className={`text-xs mt-0.5 ${isSmooth ? 'text-slate-600' : 'text-slate-300'}`}>
              Add second YouTube channel, client Facebook page, or TikTok profile.
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
          isSmooth ? 'text-blue-600' : 'text-cyan-400'
        }`} />
      </div>

      {/* Connected Accounts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isSmooth ? 'text-slate-700' : 'text-slate-400'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Connected Accounts & Channels ({connectedAccounts.length})
          </h3>
          <span className={`text-[11px] font-mono font-semibold ${
            isSmooth ? 'text-blue-700' : 'text-cyan-400'
          }`}>
            Simultaneous Multi-Post Ready
          </span>
        </div>

        <div className="space-y-2.5">
          {connectedAccounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => handleSelectAccount(acc)}
              className={`rounded-2xl p-4 border flex items-center justify-between gap-4 cursor-pointer group transition-all ${
                isSmooth
                  ? 'bg-white hover:bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md'
                  : 'glass-card glass-card-hover border-sky-800/60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <PlatformIcon platform={acc.platform} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold transition-colors ${
                      isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {acc.name}
                    </span>
                    {acc.accountLabel && (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${
                        isSmooth
                          ? 'bg-slate-100 border-slate-200 text-slate-700 font-semibold'
                          : 'bg-sky-950 border-sky-800 text-cyan-300'
                      }`}>
                        {acc.accountLabel}
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isSmooth
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                    }`}>
                      ● Active
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isSmooth ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                    {acc.handle} • {acc.followers} followers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddChannelPlatform(acc.platform);
                  }}
                  className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                    isSmooth
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                      : 'bg-sky-950/70 hover:bg-sky-900 border-sky-800/80 text-cyan-300'
                  }`}
                  title={`Add second ${acc.name} channel`}
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Add Another ID</span>
                </button>

                <div className="text-right hidden sm:block">
                  <span className={`text-xs font-mono font-bold block ${
                    isSmooth ? 'text-blue-700' : 'text-cyan-400'
                  }`}>
                    {acc.postsCount} Posts
                  </span>
                  <span className={`text-[10px] ${isSmooth ? 'text-slate-500' : 'text-slate-500'}`}>
                    Expiry: {acc.tokenExpiresIn}
                  </span>
                </div>
                <ChevronRight className={`w-5 h-5 group-hover:translate-x-0.5 transition-all ${
                  isSmooth ? 'text-slate-400 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-white'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available to Connect Section */}
      {unconnectedAccounts.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isSmooth ? 'text-slate-700 font-extrabold' : 'text-slate-400'
          }`}>
            <Plus className={`w-4 h-4 ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`} />
            Available to Connect ({unconnectedAccounts.length})
          </h3>

          <div className="space-y-2.5">
            {unconnectedAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => openOAuthModal(acc.platform, acc.id)}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                  isSmooth
                    ? 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
                    : 'bg-[#040e1f] hover:bg-[#071936] border-sky-950 hover:border-sky-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <PlatformIcon platform={acc.platform} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold block ${
                        isSmooth ? 'text-slate-900' : 'text-white'
                      }`}>
                        {acc.name}
                      </span>
                      {acc.accountLabel && (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${
                          isSmooth
                            ? 'bg-slate-100 border-slate-200 text-slate-700 font-semibold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}>
                          {acc.accountLabel}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs block mt-0.5 ${
                      isSmooth ? 'text-slate-600 font-medium' : 'text-slate-500'
                    }`}>
                      Connect via official OAuth
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openOAuthModal(acc.platform, acc.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSmooth
                      ? 'bg-blue-600 hover:bg-blue-700 border-blue-600 text-white shadow-sm'
                      : 'bg-sky-950 hover:bg-sky-900 border-sky-700/60 text-cyan-300'
                  }`}
                >
                  + Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Channel Modal */}
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

