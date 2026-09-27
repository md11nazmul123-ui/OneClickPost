'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformId, ScreenId } from '../types';
import { PlatformIcon } from './PlatformIcon';
import {
  Search,
  X,
  TrendingUp,
  Calendar,
  PlusCircle,
  BarChart3,
  Users2,
  Settings,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Command,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'feature' | 'platform' | 'post' | 'analytics';
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { navigateTo, accounts, posts, setSelectedPostDetail, language, theme } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSmooth = theme === 'smooth' || theme === 'light';

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (Escape to close, Arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : Math.max(filteredItems.length - 1, 0)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIdx]) {
          filteredItems[selectedIdx].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIdx, query]);

  if (!isOpen) return null;

  // Platforms registry
  const platformList: { id: PlatformId; name: string; desc: string }[] = [
    { id: 'youtube', name: 'YouTube', desc: '4K Shorts & Long-form Videos' },
    { id: 'facebook', name: 'Facebook', desc: 'Reels, Pages & Groups Distribution' },
    { id: 'instagram', name: 'Instagram', desc: 'Reels, Grid Posts & Stories' },
    { id: 'tiktok', name: 'TikTok', desc: 'Vertical Video & Sound Sync' },
    { id: 'x', name: 'X (Twitter)', desc: 'Broadcast Threads & Media' },
    { id: 'linkedin', name: 'LinkedIn', desc: 'Professional Thought Leadership' },
    { id: 'pinterest', name: 'Pinterest', desc: 'Idea Pins & Visual Storytelling' },
  ];

  // Core system actions & screens
  const allSearchableItems: SearchItem[] = [
    {
      id: 'feat-create',
      title: 'Create & Publish New Video',
      subtitle: 'Upload once, auto-generate captions, and dispatch to 7 platforms',
      category: 'feature',
      icon: <PlusCircle className="w-4 h-4 text-cyan-400" />,
      action: () => navigateTo('create'),
      badge: 'Publish',
      badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    },
    {
      id: 'feat-analytics',
      title: 'Audience Demographics & Analytics',
      subtitle: 'View age distributions, top countries, retention & CSV exports',
      category: 'analytics',
      icon: <BarChart3 className="w-4 h-4 text-purple-400" />,
      action: () => navigateTo('analytics'),
      badge: 'Insights',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    },
    {
      id: 'feat-scheduled',
      title: 'Scheduled Queue & Broadcast Calendar',
      subtitle: 'Review pending broadcasts, optimal timing, and post history',
      category: 'feature',
      icon: <Calendar className="w-4 h-4 text-emerald-400" />,
      action: () => navigateTo('scheduled'),
      badge: 'Calendar',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    },
    {
      id: 'feat-accounts',
      title: 'Connected Accounts & Channels',
      subtitle: 'Manage authorized OAuth 2.0 social accounts and tokens',
      category: 'feature',
      icon: <Users2 className="w-4 h-4 text-blue-400" />,
      action: () => navigateTo('accounts'),
      badge: 'OAuth 2.0',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    },
    {
      id: 'feat-ai-smart',
      title: 'AI Smart Captions & Optimization',
      subtitle: 'Generate viral captions, hashtags, and title recommendations',
      category: 'feature',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => navigateTo('create'),
      badge: 'AI Smart',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    },
    {
      id: 'feat-settings',
      title: 'App Settings & Appearance',
      subtitle: 'Switch Night, Dark, and Smooth modes, language and notifications',
      category: 'feature',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      action: () => navigateTo('settings'),
      badge: 'Preferences',
      badgeColor: 'bg-slate-900 text-slate-300 border-slate-700',
    },
    {
      id: 'feat-help',
      title: 'Help & Support Desk',
      subtitle: 'Guides, multi-platform publishing FAQs, and system setup',
      category: 'feature',
      icon: <HelpCircle className="w-4 h-4 text-rose-400" />,
      action: () => navigateTo('help'),
      badge: 'FAQ',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    },
    // Platforms
    ...platformList.map((plat) => {
      const isConnected = accounts.some((a) => a.platform === plat.id && a.connected);
      return {
        id: `plat-${plat.id}`,
        title: `${plat.name} Platform Insights`,
        subtitle: `${plat.desc} • ${isConnected ? 'Account Connected' : 'Ready to Connect'}`,
        category: 'platform' as const,
        icon: <PlatformIcon platform={plat.id} size="sm" />,
        action: () => navigateTo('analytics'),
        badge: isConnected ? 'Connected' : 'Available',
        badgeColor: isConnected
          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
          : 'bg-slate-900 text-slate-400 border-slate-800',
      };
    }),
    // User Posts & Videos
    ...posts.map((post) => ({
      id: `post-${post.id}`,
      title: post.title,
      subtitle: `${post.status.toUpperCase()} • ${post.selectedPlatforms?.length || 0} platforms • ${post.caption.slice(0, 48)}...`,
      category: 'post' as const,
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setSelectedPostDetail(post);
        navigateTo('postDetail');
      },
      badge: post.status,
      badgeColor:
        post.status === 'published'
          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
          : post.status === 'scheduled'
          ? 'bg-sky-950 text-sky-300 border-sky-800'
          : 'bg-slate-900 text-slate-300 border-slate-800',
    })),
  ];

  // Filter items based on query
  const q = query.trim().toLowerCase();
  const filteredItems = q
    ? allSearchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          (item.badge && item.badge.toLowerCase().includes(q))
      )
    : allSearchableItems.slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border ${
        isSmooth 
          ? 'bg-white border-slate-200 shadow-slate-900/10' 
          : 'bg-[#030914] border-sky-700/80 shadow-black/90'
      }`}>
        
        {/* Search Input Bar */}
        <div className={`p-3.5 sm:p-4 border-b flex items-center gap-3 ${
          isSmooth 
            ? 'bg-slate-50 border-slate-200' 
            : 'bg-[#061426]/90 border-sky-900/60'
        }`}>
          <div className={`p-2 rounded-xl shrink-0 ${
            isSmooth
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
          }`}>
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Search videos, platforms, analytics, accounts, tags..."
            className={`w-full bg-transparent text-sm sm:text-base font-semibold focus:outline-none ${
              isSmooth 
                ? 'text-slate-900 placeholder:text-slate-400' 
                : 'text-white placeholder:text-slate-400'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                isSmooth ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
              isSmooth
                ? 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none ${
          isSmooth 
            ? 'bg-slate-100/70 border-slate-200' 
            : 'bg-[#020713] border-sky-950/60'
        }`}>
          <span className={`font-bold shrink-0 ${isSmooth ? 'text-slate-600' : 'text-slate-500'}`}>
            Quick jump:
          </span>
          {[
            { label: 'All', q: '' },
            { label: 'Analytics', q: 'analytics' },
            { label: 'YouTube', q: 'youtube' },
            { label: 'TikTok', q: 'tiktok' },
            { label: 'Instagram', q: 'instagram' },
            { label: 'Facebook', q: 'facebook' },
            { label: 'Scheduled', q: 'scheduled' },
            { label: 'Accounts', q: 'accounts' },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => {
                setQuery(chip.q);
                inputRef.current?.focus();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                query.toLowerCase() === chip.q
                  ? isSmooth
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : isSmooth
                  ? 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto p-2 sm:p-3 space-y-1.5 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className={`w-8 h-8 mx-auto ${isSmooth ? 'text-slate-400' : 'text-slate-600'}`} />
              <p className={`text-sm font-bold ${isSmooth ? 'text-slate-800' : 'text-slate-300'}`}>
                No matching results found for "{query}"
              </p>
              <p className={`text-xs ${isSmooth ? 'text-slate-500' : 'text-slate-500'}`}>
                Try searching for "YouTube", "Analytics", "Captions", or "Publish"
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                    isSelected
                      ? isSmooth
                        ? 'bg-blue-50/90 text-slate-900 border-blue-300 shadow-sm translate-x-1'
                        : 'bg-gradient-to-r from-sky-950 via-[#071d3a] to-[#041224] text-white border-cyan-400/80 shadow-md shadow-cyan-950/40 translate-x-1'
                      : isSmooth
                      ? 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 border-slate-200/80'
                      : 'bg-slate-950/50 hover:bg-slate-900/60 text-slate-300 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSmooth
                        ? 'bg-white border border-slate-200 text-blue-600 shadow-xs'
                        : 'bg-slate-900 border border-slate-800 text-cyan-400'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected 
                            ? isSmooth ? 'text-blue-700 font-extrabold' : 'text-cyan-300 font-extrabold' 
                            : isSmooth ? 'text-slate-900' : 'text-white'
                        }`}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-semibold border ${
                            item.badgeColor || (isSmooth ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-900 text-slate-300 border-slate-700')
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${
                        isSmooth ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                    isSmooth ? 'text-blue-600' : 'text-cyan-400'
                  } ${isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Nav Legend */}
        <div className={`px-4 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] ${
          isSmooth 
            ? 'bg-slate-50 border-slate-200 text-slate-500' 
            : 'bg-[#020610] border-sky-950/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isSmooth ? 'bg-white border-slate-300 text-slate-700 shadow-xs' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}>↑↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isSmooth ? 'bg-white border-slate-300 text-slate-700 shadow-xs' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}>↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                isSmooth ? 'bg-white border-slate-300 text-slate-700 shadow-xs' : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}>esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <span className={`font-mono font-semibold hidden sm:inline ${
            isSmooth ? 'text-blue-600' : 'text-cyan-400'
          }`}>
            OneClickPost Unified Search
          </span>
        </div>

      </div>
    </div>
  );
};
