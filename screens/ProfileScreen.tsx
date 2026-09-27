'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Mail, Sparkles, Check, Camera, Shield } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, goBack, t } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || 'Creating viral multi-platform short video content.');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, bio });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

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
            {t('profile')}
          </h1>
          <p className="text-xs text-slate-400">
            Manage your personal profile and subscription
          </p>
        </div>
      </div>

      {showSavedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 border border-sky-800/70 shadow-2xl space-y-5">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-xl"
            />
            <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{user.name}</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 mt-1">
              <Sparkles className="w-3 h-3" /> {user.plan} Account
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Creator Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>
        </div>

        {/* Plan Feature summary */}
        <div className="p-3.5 rounded-2xl bg-[#041224] border border-sky-900/60 text-xs text-slate-300 space-y-1.5">
          <div className="flex justify-between font-bold text-white">
            <span>Free Tier Quotas:</span>
            <span className="text-cyan-400">Unlimited Multi-Posts</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Includes AI Caption & Hashtag generator, 4K video previews, and automated scheduling.
          </p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          {t('save')}
        </button>
      </form>
    </div>
  );
};
