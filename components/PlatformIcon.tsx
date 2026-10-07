'use client';

import React from 'react';
import { PlatformId } from '../types';

interface PlatformIconProps {
  platform: PlatformId | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({
  platform,
  size = 'md',
  className = '',
  showBadge = false,
}) => {
  const sizeMap = {
    xs: {
      container: 'w-5 h-5 rounded-md',
      svg: 'w-3 h-3',
    },
    sm: {
      container: 'w-7 h-7 rounded-lg',
      svg: 'w-4 h-4',
    },
    md: {
      container: 'w-9 h-9 rounded-xl',
      svg: 'w-5 h-5',
    },
    lg: {
      container: 'w-11 h-11 rounded-2xl',
      svg: 'w-6 h-6',
    },
    xl: {
      container: 'w-14 h-14 rounded-2xl',
      svg: 'w-8 h-8',
    },
  };

  const { container, svg } = sizeMap[size] || sizeMap.md;
  const normalized = platform.toLowerCase();

  switch (normalized) {
    case 'youtube':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#FF0000', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-red-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="YouTube"
        >
          {/* Authentic YouTube Screen & Play Triangle */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'facebook':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#1877F2', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-blue-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="Facebook"
        >
          {/* Authentic Facebook 'f' Vector */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'instagram':
      return (
        <div
          data-platform-icon="true"
          style={{
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            color: '#ffffff',
          }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-pink-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="Instagram"
        >
          {/* Authentic Instagram Camera Glyph with explicit strokes so it never turns into a solid blob */}
          <svg className={svg} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
            <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="2.2" fill="none" />
            <circle cx="17.5" cy="6.5" r="1.4" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'tiktok':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white border border-slate-700/80 shadow-md shadow-black/30 shrink-0 transition-transform relative overflow-hidden ${container} ${className}`}
          title="TikTok"
        >
          {/* Authentic TikTok Musical Note with crisp paths */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-6.62 6.32 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.28 8.28 0 0 0 4.99 1.66V7.27a4.83 4.83 0 0 1-1.8-.58z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          style={{ backgroundColor: '#334155', color: '#38bdf8' }}
          className={`grid place-items-center bg-slate-700 text-sky-400 font-black shadow-md shrink-0 transition-transform ${container} ${className}`}
        >
          <span className="uppercase text-xs font-mono">{normalized.slice(0, 2)}</span>
        </div>
      );
  }
};

