'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Home, PlusCircle, Calendar, BarChart3, Users2 } from 'lucide-react';
import { ScreenId } from '../types';

export const BottomNav: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const { screen, navigateTo, t, theme } = useApp();
  const isSmooth = theme === 'smooth' || theme === 'light';

  // Hide bottom nav on splash, welcome, and uploading screens
  if (screen === 'splash' || screen === 'welcome' || screen === 'uploading') {
    return null;
  }

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; matchScreens: ScreenId[] }[] = [
    {
      id: 'dashboard',
      label: t('home'),
      icon: <Home className="w-5 h-5" />,
      matchScreens: ['dashboard'],
    },
    {
      id: 'create',
      label: t('create'),
      icon: <PlusCircle className="w-5 h-5" />,
      matchScreens: ['create', 'platforms', 'platformSettings'],
    },
    {
      id: 'scheduled',
      label: t('schedule'),
      icon: <Calendar className="w-5 h-5" />,
      matchScreens: ['scheduled', 'schedule', 'postDetail'],
    },
    {
      id: 'analytics',
      label: t('analytics'),
      icon: <BarChart3 className="w-5 h-5" />,
      matchScreens: ['analytics'],
    },
    {
      id: 'accounts',
      label: t('accounts'),
      icon: <Users2 className="w-5 h-5" />,
      matchScreens: ['accounts', 'connect', 'accountDetail'],
    },
  ];

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <nav
        className={`rounded-2xl px-2 py-2 flex items-center justify-around backdrop-blur-2xl transition-all duration-200 ${
          isSmooth
            ? 'bg-white/95 border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(15,23,42,0.14)]'
            : 'glass-card border border-sky-800/60 shadow-2xl shadow-black/80'
        }`}
      >
        {navItems.map((item) => {
          const isActive = item.matchScreens.includes(screen);
          const isCreate = item.id === 'create';

          if (isCreate) {
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? isSmooth
                      ? 'text-blue-700 font-extrabold'
                      : 'text-cyan-300 font-bold'
                    : isSmooth
                    ? 'text-slate-700 hover:text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-11 h-11 -mt-5 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white hover:scale-105 active:scale-95 transition-all ${
                    isSmooth ? 'ring-4 ring-white' : 'ring-4 ring-[var(--card-surface)]'
                  }`}
                >
                  <PlusCircle className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold mt-1 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? isSmooth
                    ? 'text-blue-700 font-black'
                    : 'text-cyan-400 font-bold'
                  : isSmooth
                  ? 'text-slate-700 hover:text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isSmooth
                        ? 'bg-blue-700 shadow-sm shadow-blue-400'
                        : 'bg-cyan-400 shadow-sm shadow-cyan-400'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
