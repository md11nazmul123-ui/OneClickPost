'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PlatformId } from '../types';
import { AddChannelModal } from '../components/AddChannelModal';
import { ArrowLeft, ArrowRight, Check, AlertCircle, Plus, Users } from 'lucide-react';

export const SelectPlatformsScreen: React.FC = () => {
  const {
    accounts,
    selectedPlatforms,
    selectedAccountIds,
    togglePlatform,
    toggleAccount,
    selectAllPlatforms,
    deselectAllPlatforms,
    openOAuthModal,
    navigateTo,
    goBack,
    t,
    theme,
  } = useApp();

  const isSmooth = theme === 'smooth' || theme === 'light';
  const [addChannelPlatform, setAddChannelPlatform] = useState<PlatformId | null>(null);

  const allSupported: { id: PlatformId; name: string }[] = [
    { id: 'youtube', name: 'YouTube' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'x', name: 'X (Twitter)' },
    { id: 'pinterest', name: 'Pinterest' },
    { id: 'linkedin', name: 'LinkedIn' },
  ];

  const totalConnectedChannels = accounts.filter((a) => a.connected).length;
  const totalSelectedChannels = selectedAccountIds.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
            isSmooth
              ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
              : 'bg-[#07182c] border-sky-800/80 text-slate-300 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-xl sm:text-2xl font-black ${isSmooth ? 'text-slate-950' : 'text-white'}`}>
            {t('selectPlatforms')} & Accounts
          </h1>
          <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
            Select specific channels or broadcast to multiple accounts in the same platform (e.g. 2 YouTube channels).
          </p>
        </div>
      </div>

      {/* Quick Select Buttons & Multi-Channel Stats Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs ${
          isSmooth
            ? 'bg-white border-slate-200 shadow-sm text-slate-700'
            : 'bg-[#06172d] border-sky-900/60 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
          <span>
            Selected Channels:{' '}
            <strong className={`font-bold ${isSmooth ? 'text-blue-700' : 'text-cyan-300'}`}>
              {totalSelectedChannels}
            </strong>{' '}
            of <strong className={isSmooth ? 'text-slate-900' : 'text-slate-400'}>{totalConnectedChannels}</strong> connected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAllPlatforms}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              isSmooth
                ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                : 'bg-sky-900/60 hover:bg-sky-800 border-sky-700 text-cyan-300'
            }`}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={deselectAllPlatforms}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer border ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400'
            }`}
          >
            Deselect All
          </button>
        </div>
      </div>

      {/* Platform List with Nested Multi-Account Cards */}
      <div className="space-y-4">
        {allSupported.map((item) => {
          const platformAccounts = accounts.filter((a) => a.platform === item.id);
          const connectedAccounts = platformAccounts.filter((a) => a.connected);
          const isPlatformActive = selectedPlatforms.includes(item.id);
          const hasConnected = connectedAccounts.length > 0;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all overflow-hidden ${
                isPlatformActive
                  ? isSmooth
                    ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-200'
                    : 'bg-[#06172d]/90 border-cyan-500/80 shadow-xl shadow-cyan-950/30'
                  : hasConnected
                  ? isSmooth
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#040f1f]/80 border-sky-900/70'
                  : isSmooth
                  ? 'bg-slate-50/80 border-slate-200 opacity-80'
                  : 'bg-[#030a16]/60 border-slate-900 opacity-75'
              }`}
            >
              {/* Platform Header Row */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div
                  onClick={() => {
                    if (!hasConnected) {
                      openOAuthModal(item.id);
                    } else {
                      togglePlatform(item.id);
                    }
                  }}
                  className="flex items-center gap-3.5 cursor-pointer flex-1"
                >
                  <PlatformIcon platform={item.id} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isSmooth ? 'text-slate-950' : 'text-white'}`}>
                        {item.name}
                      </span>
                      {hasConnected ? (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isSmooth
                              ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                              : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{connectedAccounts.length} Connected</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            isSmooth
                              ? 'text-slate-600 bg-slate-100 border-slate-200'
                              : 'text-slate-500 bg-slate-900 border-slate-800'
                          }`}
                        >
                          {t('notConnected')}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                      {hasConnected
                        ? `${connectedAccounts.length} account${connectedAccounts.length > 1 ? 's' : ''} available • Click to toggle all`
                        : 'Link via official OAuth'}
                    </p>
                  </div>
                </div>

                {/* Right Platform Actions */}
                <div className="flex items-center gap-2">
                  {hasConnected ? (
                    <>
                      {/* Add Another Channel / Account button */}
                      <button
                        type="button"
                        onClick={() => setAddChannelPlatform(item.id)}
                        className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isSmooth
                            ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                            : 'bg-sky-950 hover:bg-sky-900 border-sky-800/80 text-cyan-300 hover:text-white'
                        }`}
                        title={`Add another ${item.name} account/channel`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">+ Add Channel</span>
                      </button>

                      {/* Main Platform Master Toggle */}
                      <button
                        type="button"
                        onClick={() => togglePlatform(item.id)}
                        className={`w-12 h-6.5 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
                          isPlatformActive
                            ? isSmooth ? 'bg-blue-600' : 'bg-cyan-500'
                            : isSmooth ? 'bg-slate-300' : 'bg-slate-800'
                        }`}
                        title="Toggle all channels in this platform"
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-md ${
                            isPlatformActive ? 'translate-x-5.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openOAuthModal(item.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                        isSmooth
                          ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                          : 'bg-sky-950 hover:bg-sky-900 border-sky-700/60 text-cyan-300'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-Accounts List (Multi-Account Broadcasting Cards) */}
              {connectedAccounts.length > 0 && (
                <div className={`px-4 pb-4 sm:px-5 sm:pb-5 pt-0 space-y-2 border-t mt-1 ${
                  isSmooth ? 'border-slate-100' : 'border-sky-950/70'
                }`}>
                  <div className={`flex items-center justify-between text-[11px] font-semibold pt-2 ${
                    isSmooth ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Users className={`w-3.5 h-3.5 ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`} />
                      Broadcast Channels ({connectedAccounts.length})
                    </span>
                    <span className={`text-[10px] ${isSmooth ? 'text-blue-700' : 'text-cyan-400'}`}>
                      Uncheck to exclude specific channels
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {connectedAccounts.map((acc) => {
                      const isAccSelected = selectedAccountIds.includes(acc.id);

                      return (
                        <div
                          key={acc.id}
                          onClick={() => toggleAccount(acc.id)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                            isAccSelected
                              ? isSmooth
                                ? 'bg-blue-50/80 border-blue-300 shadow-sm'
                                : 'bg-[#092244] border-cyan-400/90 shadow-md'
                              : isSmooth
                              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 opacity-70'
                              : 'bg-[#030e1d] border-sky-950 hover:border-sky-800 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={acc.avatar}
                              alt={acc.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/40 shrink-0"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-bold truncate ${isSmooth ? 'text-slate-950' : 'text-white'}`}>
                                  {acc.handle}
                                </span>
                                {acc.accountLabel && (
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded border font-mono shrink-0 ${
                                      isSmooth
                                        ? 'bg-slate-200 border-slate-300 text-slate-800'
                                        : 'bg-sky-950 border-sky-800 text-cyan-300'
                                    }`}
                                  >
                                    {acc.accountLabel}
                                  </span>
                                )}
                              </div>
                              <span className={`text-[10px] ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                                {acc.followers} followers • {acc.postsCount} posts
                              </span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                              isAccSelected
                                ? isSmooth
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-cyan-500 border-cyan-400 text-black'
                                : isSmooth
                                ? 'border-slate-300 bg-white text-transparent'
                                : 'border-slate-700 bg-slate-900 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning if no platforms or accounts selected */}
      {selectedAccountIds.length === 0 && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please select at least one channel to broadcast your video.</span>
        </div>
      )}

      {/* Next Step Action Button */}
      <button
        type="button"
        disabled={selectedAccountIds.length === 0}
        onClick={() => navigateTo('platformSettings')}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>
          {t('next')} ({totalSelectedChannels} Channels Selected)
        </span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
      </button>

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
