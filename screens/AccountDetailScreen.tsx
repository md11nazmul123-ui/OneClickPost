'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import {
  ArrowLeft,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Video,
  Clock,
} from 'lucide-react';

export const AccountDetailScreen: React.FC = () => {
  const { selectedAccountDetail, disconnectAccount, openOAuthModal, goBack, t, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';

  if (!selectedAccountDetail) {
    return (
      <div className="p-8 text-center">
        <p className={`mb-4 ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>No account selected.</p>
        <button
          onClick={goBack}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
            isSmooth ? 'bg-blue-600 text-white' : 'bg-sky-950 text-cyan-300'
          }`}
        >
          Go Back
        </button>
      </div>
    );
  }

  const acc = selectedAccountDetail;

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
            {t('accountDetails')}
          </h1>
          <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
            {acc.name} • {acc.handle}
          </p>
        </div>
      </div>

      {/* Main Account Card */}
      <div
        className={`rounded-3xl p-6 border shadow-2xl space-y-5 transition-all ${
          isSmooth
            ? 'bg-white border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]'
            : 'glass-card border-sky-800/70'
        }`}
      >
        <div className="flex items-center gap-4">
          <PlatformIcon platform={acc.platform} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                {acc.name}
              </h2>
              {acc.accountLabel && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                    isSmooth
                      ? 'bg-slate-100 border-slate-200 text-slate-700 font-semibold'
                      : 'bg-sky-950 border-sky-800 text-cyan-300'
                  }`}
                >
                  {acc.accountLabel}
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  acc.connected
                    ? isSmooth
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60'
                    : isSmooth
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : 'text-rose-400 bg-rose-950/80 border-rose-800/60'
                }`}
              >
                ● {acc.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className={`text-xs font-mono mt-0.5 ${isSmooth ? 'text-blue-700 font-bold' : 'text-cyan-400'}`}>
              {acc.handle}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-3 gap-3 pt-3 border-t ${
          isSmooth ? 'border-slate-200' : 'border-sky-900/60'
        }`}>
          <div className={`p-3.5 rounded-2xl border text-center ${
            isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#030d1d] border-sky-950'
          }`}>
            <span className={`text-[10px] uppercase font-bold block mb-1 ${
              isSmooth ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Followers
            </span>
            <span className={`text-lg font-black ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
              {acc.followers}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center ${
            isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#030d1d] border-sky-950'
          }`}>
            <span className={`text-[10px] uppercase font-bold block mb-1 ${
              isSmooth ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Posts
            </span>
            <span className={`text-lg font-black font-mono ${isSmooth ? 'text-blue-700' : 'text-cyan-300'}`}>
              {acc.postsCount}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border text-center ${
            isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#030d1d] border-sky-950'
          }`}>
            <span className={`text-[10px] uppercase font-bold block mb-1 ${
              isSmooth ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Engagement
            </span>
            <span className={`text-lg font-black ${isSmooth ? 'text-emerald-700' : 'text-emerald-400'}`}>
              {acc.engagement}
            </span>
          </div>
        </div>

        {/* Scope Info */}
        <div className="space-y-2">
          <span className={`text-xs font-bold block ${isSmooth ? 'text-slate-800' : 'text-slate-300'}`}>
            Active OAuth Scopes:
          </span>
          <div className="space-y-1.5">
            {acc.scopes?.map((s, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 p-2 rounded-xl text-[11px] font-mono border ${
                  isSmooth
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-[#030e1d] border-transparent text-slate-300'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`} />
                <span>{s}</span>
              </div>
            )) || (
              <p className={`text-xs ${isSmooth ? 'text-slate-500' : 'text-slate-500'}`}>Standard publishing permissions granted.</p>
            )}
          </div>
        </div>

        {/* Token Expiry Status */}
        <div className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
          isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#041122] border-sky-900'
        }`}>
          <span className={isSmooth ? 'text-slate-600' : 'text-slate-400'}>OAuth Token Validity:</span>
          <span className={`font-mono font-bold ${isSmooth ? 'text-blue-700' : 'text-cyan-300'}`}>
            {acc.tokenExpiresIn || '60 days'}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {acc.connected ? (
            <button
              type="button"
              onClick={() => disconnectAccount(acc.id)}
              className={`flex-1 py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isSmooth
                  ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                  : 'bg-rose-950/40 hover:bg-rose-900/40 border-rose-800 text-rose-300'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('disconnect')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openOAuthModal(acc.platform, acc.id)}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Reconnect Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={goBack}
            className={`py-3 px-5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                : 'bg-[#081a33] hover:bg-[#0c264c] border-sky-800 text-slate-200'
            }`}
          >
            {t('back')}
          </button>
        </div>
      </div>
    </div>
  );
};
