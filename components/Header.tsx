'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { LanguageCode, ThemeMode } from '../types';
import { Bell, Globe, Sparkles, Moon, Sun, Shield, Check, Search, Command } from 'lucide-react';
import { SearchModal } from './SearchModal';

export const Header: React.FC = () => {
  const { screen, navigateTo, language, setLanguage, unreadNotifsCount, user, theme, setTheme, toggleTheme } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const isSmooth = theme === 'smooth' || theme === 'light';

  // Global keyboard shortcut (Ctrl+K or Cmd+K) to open Search Bar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Hide header on splash and welcome screens for clean native hero look
  if (screen === 'splash' || screen === 'welcome') {
    return null;
  }

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'bn', label: 'বাংলা (Bengali)', flag: '🇧🇩' },
    { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'ar-eg', label: 'مصر (Egyptian Ar)', flag: '🇪🇬' },
    { code: 'pt', label: 'Português (Portugal)', flag: '🇵🇹' },
    { code: 'fa', label: 'فারسی (Iran)', flag: '🇮🇷' },
    { code: 'ur', label: 'اردو (Pakistan)', flag: '🇵🇰' },
    { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'ar', label: 'العربية (Standard)', flag: '🇸🇦' },
  ];

  const themeOptions: { id: ThemeMode; label: string; bnLabel: string; icon: string; desc: string }[] = [
    {
      id: 'night',
      label: 'Night Mode',
      bnLabel: 'নাইট মোড',
      icon: '🌙',
      desc: 'OLED Deep Midnight, stark contrast & pure white crisp text',
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      bnLabel: 'ডার্ক মোড',
      icon: '🌑',
      desc: 'Classic Executive Studio Slate for comfortable editing',
    },
    {
      id: 'smooth',
      label: 'Smooth Mode',
      bnLabel: 'স্মুথ মোড',
      icon: '✨',
      desc: 'Eye-Care Soft Slate canvas with crystal clear dark typography',
    },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all ${
      isSmooth
        ? 'bg-white/95 border-b border-slate-200/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] text-slate-900'
        : 'bg-[#020713]/90 border-b border-sky-950/60 text-white'
    }`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Unique Original Logo and Brand - Stays Consistent across All Modes */}
        <button
          onClick={() => navigateTo('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 group text-left cursor-pointer outline-none shrink-0"
        >
          <AppLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm sm:text-lg font-black tracking-tight transition-colors ${
                isSmooth ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-300'
              }`}>
                OneClickPost
              </span>
              <span className={`hidden sm:inline-flex items-center gap-0.5 text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-full ${
                isSmooth
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'bg-cyan-950 text-cyan-400 border border-cyan-700/50 shadow-sm shadow-cyan-950/40'
              }`}>
                <Sparkles className="w-2.5 h-2.5" /> PRO
              </span>
            </div>
            <p className={`text-[11px] font-medium hidden sm:block ${
              isSmooth ? 'text-slate-600' : 'text-slate-400'
            }`}>
              One Upload. Every Platform.
            </p>
          </div>
        </button>

        {/* Search Bar Pill for Laptops, Desktops and Tablets */}
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          className={`hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl text-xs transition-all shadow-inner cursor-pointer max-w-sm w-56 lg:w-72 group ${
            isSmooth
              ? 'bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700'
              : 'bg-[#030d1d] hover:bg-[#071d3a] border border-sky-800/80 hover:border-cyan-500/70 text-slate-300'
          }`}
          title="Search posts, analytics, accounts, tags... (Ctrl+K)"
        >
          <Search className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform shrink-0 ${
            isSmooth ? 'text-blue-600' : 'text-cyan-400'
          }`} />
          <span className={`text-xs truncate ${
            isSmooth ? 'text-slate-500 group-hover:text-slate-900' : 'text-slate-400 group-hover:text-slate-200'
          }`}>
            Search posts, analytics, accounts...
          </span>
          <kbd className={`ml-auto px-1.5 py-0.5 rounded-md border font-mono text-[10px] shrink-0 ${
            isSmooth ? 'bg-white border-slate-300 text-slate-500' : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            ⌘K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile & Tablet Search Bar Icon */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className={`md:hidden p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60 text-cyan-300 hover:text-white'
            }`}
            title="Search posts, analytics & platforms"
            aria-label="Open search bar"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowThemeMenu(false);
              }}
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSmooth
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                  : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60 text-slate-300 hover:text-white'
              }`}
              title="Change Language"
            >
              <Globe className={`w-3.5 h-3.5 ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`} />
              <span className="hidden xs:inline uppercase">{language}</span>
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className={`absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 custom-scrollbar ${
                  isSmooth ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#07182c] border-sky-800/80 text-white'
                }`}>
                  <div className={`px-3 py-1.5 text-[11px] font-bold border-b sticky top-0 ${
                    isSmooth ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#07182c] border-sky-900/40 text-slate-400'
                  }`}>
                    Select Language / ভাষা
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setShowLangMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        language === l.code
                          ? isSmooth ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : isSmooth ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-200 hover:bg-sky-900/40'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <span className={isSmooth ? 'text-blue-600' : 'text-cyan-400'}>✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme Mode Selector (Night / Dark / Smooth) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowLangMenu(false);
              }}
              className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSmooth
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                  : theme === 'night'
                  ? 'bg-sky-950/80 hover:bg-sky-900 border-cyan-400/80 text-cyan-300 shadow-sm shadow-cyan-950/50'
                  : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/70 text-slate-300'
              }`}
              title="Switch Appearance: Night, Dark, or Smooth"
              aria-label="Theme mode switcher"
            >
              <span className="text-sm">
                {theme === 'night' ? '🌙' : isSmooth ? '✨' : '🌑'}
              </span>
              <span className="hidden sm:inline capitalize">
                {theme === 'night' ? 'Night' : isSmooth ? 'Smooth' : 'Dark'}
              </span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1 ${
                  isSmooth ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#07182c] border-sky-800/80 text-white'
                }`}>
                  <div className={`px-2 py-1 text-[11px] font-bold border-b mb-1 flex items-center justify-between ${
                    isSmooth ? 'border-slate-200 text-slate-600' : 'border-sky-900/50 text-slate-400'
                  }`}>
                    <span>Appearance & Contrast</span>
                    <span className={`text-[10px] font-mono ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`}>3 Modes</span>
                  </div>

                  {themeOptions.map((opt) => {
                    const isSelected = theme === opt.id || (opt.id === 'smooth' && theme === 'light');
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setTheme(opt.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? isSmooth
                              ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold shadow-sm'
                              : 'bg-cyan-500/20 text-white border border-cyan-500/40 shadow-sm'
                            : isSmooth
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-slate-300 hover:bg-sky-900/40'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-base mt-0.5">{opt.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">{opt.label}</span>
                              <span className={`text-[10px] font-mono ${isSmooth ? 'text-blue-600' : 'text-cyan-400'}`}>({opt.bnLabel})</span>
                            </div>
                            <span className={`text-[10px] leading-tight block mt-0.5 ${
                              isSmooth ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              {opt.desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isSmooth ? 'bg-blue-600 text-white' : 'bg-cyan-400 text-black'
                          }`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Notifications Button with unread badge */}
          <button
            onClick={() => navigateTo('notifications')}
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-colors cursor-pointer ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
                : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60 text-slate-300 hover:text-white'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-black font-extrabold text-[10px] flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Profile Button (Hidden on tiny mobile to save header space) */}
          <button
            onClick={() => navigateTo('profile')}
            className={`hidden sm:flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border group transition-all cursor-pointer ${
              isSmooth
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200'
                : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60'
            }`}
            title="Profile"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-lg object-cover ring-1 ring-cyan-500/50"
            />
            <span className={`text-xs font-bold max-w-[80px] truncate hidden md:inline ${
              isSmooth ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-200 group-hover:text-cyan-300'
            }`}>
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>

      {/* Universal Search Modal (Spotlight / Omnibar) */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </header>
  );
};
