'use client';

import React from 'react';

/**
 * Universal Theme-Agnostic Application Logo
 * Maintains an invariant high-contrast dark studio appearance across
 * Night, Dark, Smooth, and Light modes without shifting during theme toggling.
 */
export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
  onClick,
}) => {
  const sizeConfig = {
    sm: {
      box: 'w-8 h-8 rounded-lg',
      inner: 'rounded-[6px]',
      svg: 'w-4 h-4',
    },
    md: {
      box: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl',
      inner: 'rounded-[10px]',
      svg: 'w-5 h-5',
    },
    lg: {
      box: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl',
      inner: 'rounded-[14px]',
      svg: 'w-7 h-7 sm:w-8 sm:h-8',
    },
    xl: {
      box: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl',
      inner: 'rounded-[22px]',
      svg: 'w-12 h-12 sm:w-14 sm:h-14',
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* High-Contrast Theme-Agnostic Logo Box */}
      <div
        data-app-logo="true"
        data-platform-icon="true"
        className={`app-brand-logo preserve-brand ${config.box} bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-md shadow-cyan-500/25 shrink-0 transition-transform ${
          onClick ? 'group-hover:scale-105' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 50%, #06b6d4 100%)',
        }}
      >
        <div
          className={`brand-logo-inner w-full h-full ${config.inner} flex items-center justify-center relative overflow-hidden`}
          style={{ backgroundColor: '#040e1e', background: '#040e1e' }}
        >
          {/* Unique Broadcast Prism Emblem - Invariant High-Contrast Vector */}
          <svg
            className={`${config.svg} shrink-0`}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ color: '#00F0FF' }}
          >
            <rect x="2" y="3" width="20" height="13" rx="3.5" stroke="#00F0FF" strokeWidth="2" />
            <path d="M10 7.5L15 10L10 12.5V7.5Z" fill="url(#brandGradUnified)" />
            <path d="M7 20H17" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 16V20" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="6.5" r="1.5" fill="#EF4444" />
          </svg>
        </div>
      </div>

      {showWordmark && (
        <span className="text-base sm:text-lg font-black tracking-tight text-white select-none">
          OneClick<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Post</span>
        </span>
      )}
    </div>
  );
};