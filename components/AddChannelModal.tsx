'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformId } from '../types';
import { Plus, X, ShieldCheck } from 'lucide-react';

interface AddChannelModalProps {
  isOpen: boolean;
  platform: PlatformId;
  onClose: () => void;
}

export const AddChannelModal: React.FC<AddChannelModalProps> = ({
  isOpen,
  platform,
  onClose,
}) => {
  const { addNewAccount } = useApp();
  const [handle, setHandle] = useState('');
  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    addNewAccount(
      platform,
      handle.trim(),
      label.trim() || `${platform.toUpperCase()} Channel`
    );
    setHandle('');
    setLabel('');
    onClose();
  };

  const getPlatformPlaceholder = () => {
    switch (platform) {
      case 'youtube':
        return { handle: '@MySecondChannel', label: 'e.g. Gaming Channel / English Hub' };
      case 'facebook':
        return { handle: 'My Brand Page', label: 'e.g. Official Page / Client Page' };
      case 'instagram':
        return { handle: '@my_lifestyle_reels', label: 'e.g. Photography / Personal Reel' };
      case 'tiktok':
        return { handle: '@my_viral_backup', label: 'e.g. Backup / Clips Account' };
      default:
        return { handle: '@handle', label: 'e.g. Channel or Page Name' };
    }
  };

  const placeholder = getPlatformPlaceholder();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#081a33] to-[#040e1f] border border-sky-700/60 p-6 shadow-2xl space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-sky-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Connect Another {platform.toUpperCase()} ID
            </h3>
            <p className="text-xs text-slate-400">
              Add multiple accounts/channels to broadcast simultaneously.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Account Handle / Name *
            </label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={placeholder.handle}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-sky-900 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Channel / Role Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={placeholder.label}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030e1d] border border-sky-900 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#020b17] border border-sky-950 flex items-start gap-2.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Connected via official OAuth token delegation. The same video will be published to both accounts.
            </span>
          </div>

          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-sky-900/70 text-slate-300 hover:bg-sky-900/30 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
            >
              Add Channel & Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
