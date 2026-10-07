'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LanguageCode, ScreenId } from '../types';
import {
  ArrowLeft,
  User,
  Bell,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Check,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    navigateTo,
    goBack,
    language,
    setLanguage,
    theme,
    setTheme,
    t,
  } = useApp();
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await logout(); // সার্ভারে Token বাতিল + কুকি মুছে ফেলা; AuthGate Welcome-এ নিয়ে যাবে
    setLoggingOut(false);
  };

  const isSmooth = theme === 'smooth' || theme === 'light';
  const supportedLanguages: {
    code: LanguageCode;
    label: string;
    native: string;
    flag: string;
    country: string;
  }[] = [
    { code: 'en', label: 'English', native: 'English', flag: '🇺🇸', country: 'Global' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇧🇩', country: 'Bangladesh' },
  ];

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  const menuItems: {
    id: ScreenId;
    label: string;
    icon: React.ReactNode;
    subtitle: string;
  }[] = [
    {
      id: 'profile',
      label: t('profile'),
      icon: <User className="w-5 h-5 text-cyan-400" />,
      subtitle: t('profileDesc'),
    },
    {
      id: 'notifications',
      label: t('notifications'),
      icon: <Bell className="w-5 h-5 text-purple-400" />,
      subtitle: t('notificationsDesc'),
    },
    {
      id: 'help',
      label: t('helpSupport'),
      icon: <HelpCircle className="w-5 h-5 text-teal-400" />,
      subtitle: t('helpDesc'),
    },
    {
      id: 'about',
      label: t('aboutApp'),
      icon: <Info className="w-5 h-5 text-pink-400" />,
      subtitle: t('aboutDesc'),
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-6">
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
            {t('settings')}
          </h1>
          <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
            {t('settingsDesc')}
          </p>
        </div>
      </div>

      {/* Global Theme Mode Card (Night, Dark, Smooth) */}
      <div
        className={`rounded-3xl p-4 sm:p-5 border transition-all ${
          isSmooth
            ? 'bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.05)]'
            : 'glass-card border-sky-800/70 shadow-2xl'
        } space-y-4`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border text-lg ${
                isSmooth
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {theme === 'light' ? '☀️' : theme === 'night' ? '🌙' : theme === 'smooth' ? '✨' : '🌑'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold ${isSmooth ? 'text-slate-950' : 'text-white'}`}>
                  Appearance & Visual Contrast
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold capitalize ${
                    isSmooth
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                  }`}
                >
                  {theme === 'light' ? 'Day Mode' : theme === 'night' ? 'Night Mode' : theme === 'smooth' ? 'Smooth Mode' : 'Dark Mode'} (Active)
                </span>
              </div>
              <p className={`text-[11px] ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                Choose your preferred mode for crystal clear typography and eye comfort:
              </p>
            </div>
          </div>
        </div>

        {/* 4 Theme Mode Selector Buttons: Day (default), Night, Dark, Smooth */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* 0. Day Mode (Default) */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-md ring-1 ring-sky-400/50'
                : isSmooth
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                : 'bg-[#040e1e] border-sky-950 hover:border-sky-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">☀️</span>
              <div>
                <span className={`text-xs font-bold block ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                  Day (ডে) · Default
                </span>
                <span className={`text-[10px] block ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>Bright Daylight</span>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                theme === 'light'
                  ? 'bg-sky-500 border-sky-500 text-white'
                  : 'border-slate-400 bg-transparent text-transparent'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>

          {/* 1. Night Mode */}
          <button
            type="button"
            onClick={() => setTheme('night')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              theme === 'night'
                ? 'bg-[#030919] border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                : isSmooth
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                : 'bg-[#040e1e] border-sky-950 hover:border-sky-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌙</span>
              <div>
                <span className={`text-xs font-bold block ${theme === 'night' || !isSmooth ? 'text-white' : 'text-slate-900'}`}>
                  Night (নাইট)
                </span>
                <span className="text-[10px] text-slate-400 block">OLED Midnight</span>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                theme === 'night'
                  ? 'bg-cyan-400 border-cyan-400 text-black'
                  : 'border-slate-400 dark:border-slate-700 bg-transparent text-transparent'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>

          {/* 2. Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0e172a] border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                : isSmooth
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                : 'bg-[#040e1e] border-sky-950 hover:border-sky-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌑</span>
              <div>
                <span className={`text-xs font-bold block ${theme === 'dark' || !isSmooth ? 'text-white' : 'text-slate-900'}`}>
                  Dark (ডার্ক)
                </span>
                <span className="text-[10px] text-slate-400 block">Studio Slate</span>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                theme === 'dark'
                  ? 'bg-cyan-400 border-cyan-400 text-black'
                  : 'border-slate-400 dark:border-slate-700 bg-transparent text-transparent'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>

          {/* 3. Smooth Mode */}
          <button
            type="button"
            onClick={() => setTheme('smooth')}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              theme === 'smooth'
                ? 'bg-amber-50 border-amber-400 text-slate-900 shadow-md ring-1 ring-amber-400/50'
                : isSmooth
                ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                : 'bg-[#040e1e] border-sky-950 hover:border-sky-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✨</span>
              <div>
                <span className={`text-xs font-bold block ${isSmooth ? 'text-slate-900' : 'text-white'}`}>
                  Smooth (স্মুথ)
                </span>
                <span className={`text-[10px] block ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                  Eye-Care Clarity
                </span>
              </div>
            </div>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                theme === 'smooth'
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-400 bg-transparent text-transparent'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>
        </div>
      </div>

      {/* Integrated Language Switcher Card */}
      <div
        className={`rounded-3xl p-4 sm:p-5 border transition-all ${
          isSmooth
            ? 'bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.05)]'
            : 'glass-card border-sky-800/70 shadow-2xl'
        } space-y-4`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isSmooth
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
              }`}
            >
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold ${isSmooth ? 'text-slate-950' : 'text-white'}`}>
                  {t('language')}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                    isSmooth
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60'
                  }`}
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.native}</span>
                </span>
              </div>
              <p className={`text-[11px] ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('languageDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Language Select Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 pt-1">
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-2.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? isSmooth
                      ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-sm ring-1 ring-blue-300'
                      : 'bg-[#082245] border-cyan-400 text-white shadow-md'
                    : isSmooth
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-[#041122] border-sky-950 hover:border-sky-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-xl shrink-0">{lang.flag}</span>
                  <div className="truncate">
                    <span className="text-xs font-bold block truncate">
                      {lang.native}
                    </span>
                    <span className={`text-[10px] truncate block ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                      {lang.label} ({lang.country})
                    </span>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? isSmooth
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-cyan-400 border-cyan-400 text-black'
                      : 'border-slate-300 dark:border-slate-700 bg-transparent text-transparent'
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings Navigation List */}
      <div
        className={`rounded-3xl p-3 border transition-all ${
          isSmooth
            ? 'bg-white border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.05)]'
            : 'glass-card border-sky-800/70 shadow-2xl'
        } space-y-1`}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigateTo(item.id)}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-colors text-left group cursor-pointer ${
              isSmooth ? 'hover:bg-slate-50 text-slate-900' : 'hover:bg-[#071933] text-white'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`p-2.5 rounded-xl border ${
                  isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-sky-950/80 border-sky-900/60'
                }`}
              >
                {item.icon}
              </div>
              <div>
                <span
                  className={`text-sm font-bold transition-colors block ${
                    isSmooth ? 'text-slate-950 group-hover:text-blue-700' : 'text-white group-hover:text-cyan-300'
                  }`}
                >
                  {item.label}
                </span>
                <span className={`text-[11px] ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                  {item.subtitle}
                </span>
              </div>
            </div>
            <ChevronRight
              className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                isSmooth ? 'text-slate-400 group-hover:text-slate-800' : 'text-slate-500 group-hover:text-white'
              }`}
            />
          </button>
        ))}

        {/* Log Out */}
        <div className={`pt-2 border-t ${isSmooth ? 'border-slate-200' : 'border-sky-900/40'}`}>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-rose-600 disabled:opacity-60 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left cursor-pointer`}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <span className="text-sm font-bold block">{t('logout')}</span>
                <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                  Sign out of OneClickPost session
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
