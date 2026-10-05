'use client';

import React from 'react';

/**
 * OneClickPost brand logo.
 * Mark: one video (play) → three dots (every platform).
 * Same look in every theme (Day, Night, Dark, Smooth).
 */
export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
}

const SIZE_CLASS: Record<NonNullable<AppLogoProps['size']>, string> = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 sm:w-10 sm:h-10',
  lg: 'w-14 h-14 sm:w-16 sm:h-16',
  xl: 'w-24 h-24 sm:w-28 sm:h-28',
};

export const AppLogoMark: React.FC<{ className?: string }> = ({ className = '' }) => {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-label="OneClickPost"
      data-platform-icon="true"
    >
      <defs>
        <linearGradient id={`ocp-g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B63E6" />
          <stop offset="1" stopColor="#2140AD" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#ocp-g-${id})`} />
      <path
        d="M18 21.2c0-2.3 2.5-3.7 4.5-2.5l15.5 9.4c1.9 1.1 1.9 3.9 0 5l-15.5 9.4c-2 1.2-4.5-.2-4.5-2.5z"
        fill="#FFFFFF"
      />
      <circle cx="47" cy="19" r="3.4" fill="#FFFFFF" fillOpacity="0.7" />
      <circle cx="50" cy="31.5" r="3.4" fill="#FFFFFF" />
      <circle cx="47" cy="44" r="3.4" fill="#FFFFFF" fillOpacity="0.7" />
    </svg>
  );
};

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showWordmark = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <span
        className={`preserve-brand inline-flex shrink-0 rounded-[24%] shadow-sm transition-transform ${SIZE_CLASS[size] || SIZE_CLASS.md} ${
          onClick ? 'group-hover:scale-105' : ''
        }`}
        data-platform-icon="true"
      >
        <AppLogoMark className="w-full h-full" />
      </span>
      {showWordmark && (
        <span className="ocp-wordmark text-base sm:text-lg font-extrabold tracking-tight select-none">
          OneClick<span className="ocp-wordmark-accent">Post</span>
        </span>
      )}
    </div>
  );
};
