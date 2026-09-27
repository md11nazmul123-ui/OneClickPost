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

    case 'x':
    case 'twitter':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white border border-slate-700/80 shadow-md shadow-black/30 shrink-0 transition-transform ${container} ${className}`}
          title="X (Twitter)"
        >
          {/* Official Mathematical Double-Struck 𝕏 Vector */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'linkedin':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#0A66C2', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-blue-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="LinkedIn"
        >
          {/* Official LinkedIn Typography Vector */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'pinterest':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#E60023', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-red-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="Pinterest"
        >
          {/* Authentic Pinterest Calligraphic 'P' */}
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.12-2.52.02-3.6.14-1.12.92-3.9 1.15-4.88.24-1 1.05-1.92 2.37-1.92 1.67 0 2.5 1.25 2.5 2.76 0 1.66-1.06 4.14-1.6 6.44-.44 1.88.94 3.42 2.8 3.42 3.36 0 5.95-3.54 5.95-8.65 0-4.52-3.25-7.68-7.89-7.68-5.38 0-8.53 4.03-8.53 8.2 0 1.62.62 3.36 1.4 4.3.15.19.17.36.13.55-.05.2-.18.73-.23.95-.08.3-.26.36-.6.22-2.22-1.03-3.6-4.27-3.6-6.88 0-5.6 4.07-10.74 11.73-10.74 6.16 0 10.95 4.39 10.95 10.26 0 6.12-3.86 11.05-9.22 11.05-1.8 0-3.5-0.94-4.08-2.05l-1.11 4.24c-.4 1.55-1.49 3.5-2.22 4.68A12 12 0 1 0 12 0z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'whatsapp':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#25D366', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-emerald-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="WhatsApp"
        >
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="#FFFFFF" />
          </svg>
        </div>
      );

    case 'telegram':
      return (
        <div
          data-platform-icon="true"
          style={{ backgroundColor: '#229ED9', color: '#ffffff' }}
          className={`preserve-brand grid place-items-center text-white shadow-md shadow-sky-950/20 shrink-0 transition-transform ${container} ${className}`}
          title="Telegram"
        >
          <svg className={svg} viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z" fill="#FFFFFF" />
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

