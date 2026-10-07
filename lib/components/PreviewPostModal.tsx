'use client';

import React, { useState } from 'react';
import { AVATAR_PLACEHOLDER } from '../lib/placeholders';
import { PlatformId, SocialAccount } from '../types';
import { PlatformIcon } from './PlatformIcon';
import {
  X,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  MoreVertical,
  CheckCircle2,
  Maximize2,
  Sparkles,
  ExternalLink,
  Smartphone,
  Monitor,
  Heart,
  Volume2,
} from 'lucide-react';

interface PreviewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  selectedPlatforms: PlatformId[];
  accounts: SocialAccount[];
  selectedAccountIds: string[];
  platformSettings?: Partial<Record<PlatformId, { title?: string; description?: string; caption?: string; hashtags?: string[] }>>;
  t?: (key: string) => string;
}

export const PreviewPostModal: React.FC<PreviewPostModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  caption,
  hashtags,
  videoUrl,
  selectedPlatforms,
  accounts,
  selectedAccountIds,
  platformSettings = {},
  t,
}) => {
  // Available platforms to preview
  const displayPlatforms = selectedPlatforms.length > 0
    ? selectedPlatforms
    : (['youtube'] as PlatformId[]);

  const [activePlatform, setActivePlatform] = useState<PlatformId>(displayPlatforms[0] || 'youtube');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  if (!isOpen) return null;

  // Selected account for current platform if any
  const platformAccounts = accounts.filter(
    (a) => a.platform === activePlatform && a.connected && selectedAccountIds.includes(a.id)
  );
  const primaryAccount = platformAccounts[0] || accounts.find((a) => a.platform === activePlatform && a.connected) || {
    id: `temp-${activePlatform}`,
    name: activePlatform.toUpperCase(),
    handle: `@creator_${activePlatform}`,
    avatar: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e2e8f0'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%2394a3b8'/%3E%3Cpath d='M12 56c3-11 11-17 20-17s17 6 20 17' fill='%2394a3b8'/%3E%3C/svg%3E",
    accountLabel: 'Official Channel',
  };

  // Resolve platform-specific customized content or fallback to main caption & hashtags
  const specific = platformSettings[activePlatform];
  const postTitle = specific?.title || videoTitle || 'Untitled Video';
  const postCaption = specific?.caption || specific?.description || caption || 'Check out our latest video broadcast!';
  const postTags = specific?.hashtags && specific.hashtags.length > 0 ? specific.hashtags : hashtags;

  const fullCaptionWithTags = `${postCaption}\n\n${postTags.join(' ')}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-gradient-to-b from-[#07162c] to-[#030914] border border-sky-700/70 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sky-800/80 bg-[#061426]/90 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Post Broadcast Preview
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono">
                  Live Feed Simulator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect how your video and AI generated captions look across your selected networks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile / Desktop frame toggler */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#030d1d] border border-sky-900/80 text-xs">
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile Feed View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop Feed View"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-sky-900/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 py-3 border-b border-sky-950 bg-[#040e1d]/80 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Target Platform:
          </span>
          {displayPlatforms.map((plat) => {
            const isActive = plat === activePlatform;
            const channelCount = accounts.filter(
              (a) => a.platform === plat && a.connected && selectedAccountIds.includes(a.id)
            ).length;

            return (
              <button
                key={plat}
                type="button"
                onClick={() => setActivePlatform(plat)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-900 to-[#0a274c] text-white border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#030914] text-slate-400 border-sky-950 hover:text-slate-200 hover:border-sky-800'
                }`}
              >
                <PlatformIcon platform={plat} size="sm" />
                <span className="capitalize">{plat}</span>
                {channelCount > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                    {channelCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Platform Account Information Bar */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#030b17] border-b border-sky-950 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={primaryAccount.avatar || "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23e2e8f0'/%3E%3Ccircle cx='32' cy='25' r='11' fill='%2394a3b8'/%3E%3Cpath d='M12 56c3-11 11-17 20-17s17 6 20 17' fill='%2394a3b8'/%3E%3C/svg%3E"}
              alt={primaryAccount.name}
              className="w-6 h-6 rounded-full object-cover border border-cyan-500/40"
            />
            <span className="font-bold text-white">{primaryAccount.handle || primaryAccount.name}</span>
            {primaryAccount.accountLabel && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#07192f] border border-sky-800 text-slate-300">
                {primaryAccount.accountLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>Broadcast Aspect:</span>
            <span className="text-cyan-300 font-bold">
              {activePlatform === 'tiktok' || activePlatform === 'instagram' ? '9:16 Vertical Reel' : '16:9 Landscape Video'}
            </span>
          </div>
        </div>

        {/* Main Preview Container Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-[#02060f]">
          <div
            className={`w-full transition-all duration-300 ${
              deviceMode === 'mobile' ? 'max-w-md' : 'max-w-2xl'
            }`}
          >

            {/* ========================================================= */}
            {/* 1. YOUTUBE PREVIEW MOCKUP */}
            {/* ========================================================= */}
            {activePlatform === 'youtube' && (
              <div className="rounded-3xl bg-[#0f0f0f] border border-neutral-800 overflow-hidden shadow-2xl text-white">
                {/* Video Stage */}
                <div className="relative aspect-video w-full bg-black">
                  <video
                    src={videoUrl || undefined}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                    4K UHD
                  </span>
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-3">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-100 line-clamp-2 leading-snug">
                    {postTitle}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                    <span>18.4K views • Streamed 2 hours ago</span>
                    <span className="text-red-500 font-bold">#1 Trending</span>
                  </div>

                  {/* Channel Row */}
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={primaryAccount.avatar || AVATAR_PLACEHOLDER}
                        alt="Channel"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{primaryAccount.name || 'YouTube Creator'}</span>
                          <CheckCircle2 className="w-3 h-3 text-neutral-400" />
                        </div>
                        <span className="text-[10px] text-neutral-400">54.2K subscribers</span>
                      </div>
                    </div>

                    <button className="px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors">
                      Subscribe
                    </button>
                  </div>

                  {/* Description Box */}
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                    <p className="whitespace-pre-line leading-relaxed">
                      {postCaption}
                    </p>
                    {postTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {postTags.map((tag) => (
                          <span key={tag} className="text-blue-400 font-semibold text-[11px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. FACEBOOK PREVIEW MOCKUP */}
            {/* ========================================================= */}
            {activePlatform === 'facebook' && (
              <div className="rounded-3xl bg-[#18191a] border border-neutral-800 overflow-hidden shadow-2xl text-neutral-100 space-y-3 p-4">
                {/* Feed Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={primaryAccount.avatar || AVATAR_PLACEHOLDER}
                        alt={primaryAccount.name}
                        className="w-10 h-10 rounded-full object-cover border border-blue-500/50"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">
                        f
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                          {primaryAccount.handle || primaryAccount.name}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        <span>Just now</span>
                        <span>•</span>
                        <span>🌐 Public</span>
                      </div>
                    </div>
                  </div>

                  <MoreVertical className="w-4 h-4 text-neutral-400 cursor-pointer" />
                </div>

                {/* Post Caption Body */}
                <div className="text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
                  <p>{postCaption}</p>
                  {postTags.length > 0 && (
                    <p className="text-blue-400 font-medium mt-1">
                      {postTags.join(' ')}
                    </p>
                  )}
                </div>

                {/* Embedded Video */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-neutral-800">
                  <video
                    src={videoUrl || undefined}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Reaction Counters */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1 pt-1 border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
                    <span className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[9px] text-white">❤️</span>
                    <span className="ml-1 text-white font-semibold">1.2K</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>142 comments</span>
                    <span>58 shares</span>
                  </div>
                </div>

                {/* Interaction Action Buttons */}
                <div className="grid grid-cols-3 gap-1 pt-1 text-xs text-neutral-300 font-semibold">
                  <button className="py-2 rounded-xl hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-colors">
                    <ThumbsUp className="w-4 h-4" /> Like
                  </button>
                  <button className="py-2 rounded-xl hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-colors">
                    <MessageCircle className="w-4 h-4" /> Comment
                  </button>
                  <button className="py-2 rounded-xl hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. INSTAGRAM PREVIEW MOCKUP */}
            {/* ========================================================= */}
            {activePlatform === 'instagram' && (
              <div className="rounded-3xl bg-black border border-neutral-800 overflow-hidden shadow-2xl text-white">
                {/* Feed Profile Header */}
                <div className="flex items-center justify-between p-3.5 border-b border-neutral-900">
                  <div className="flex items-center gap-2.5">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <img
                        src={primaryAccount.avatar || AVATAR_PLACEHOLDER}
                        alt="IG Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-black"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {primaryAccount.handle || 'creator_official'}
                      </span>
                      <span className="text-[10px] text-neutral-400 block leading-none">
                        Original Audio • OneClickPost
                      </span>
                    </div>
                  </div>
                  <MoreVertical className="w-4 h-4 text-neutral-400" />
                </div>

                {/* 4:5 / 9:16 Instagram Reel Box */}
                <div className="relative aspect-[4/5] sm:aspect-square bg-neutral-950 w-full overflow-hidden">
                  <video
                    src={videoUrl || undefined}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white backdrop-blur">
                    <Volume2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* IG Action Bar */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 text-white cursor-pointer" />
                      <Share2 className="w-5 h-5 text-white cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 text-white cursor-pointer" />
                  </div>

                  <span className="text-xs font-bold text-white block">3,420 likes</span>

                  {/* Caption & Tags */}
                  <div className="text-xs space-y-1">
                    <p className="leading-relaxed">
                      <span className="font-bold mr-2 text-white">
                        {primaryAccount.handle || 'creator_official'}
                      </span>
                      <span className="text-neutral-200">{postCaption}</span>
                    </p>
                    {postTags.length > 0 && (
                      <p className="text-blue-400 font-medium">
                        {postTags.join(' ')}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">
                    2 hours ago • Verified Broadcast
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. TIKTOK PREVIEW MOCKUP */}
            {/* ========================================================= */}
            {activePlatform === 'tiktok' && (
              <div className="rounded-3xl bg-black border border-neutral-800 overflow-hidden shadow-2xl text-white relative aspect-[9/16] max-w-sm mx-auto flex flex-col justify-between p-4">
                {/* Background Fullscreen Video */}
                <video
                  src={videoUrl || undefined}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Top Nav Overlay */}
                <div className="relative z-10 flex items-center justify-center gap-4 text-xs font-bold text-neutral-400 pt-2">
                  <span className="text-white border-b-2 border-white pb-0.5">Following</span>
                  <span className="text-white font-extrabold border-b-2 border-white pb-0.5">For You</span>
                </div>

                {/* Right Action Rail (TikTok style) */}
                <div className="relative z-10 self-end flex flex-col items-center gap-4 pb-12 pr-1">
                  {/* Creator Avatar with follow badge */}
                  <div className="relative">
                    <img
                      src={primaryAccount.avatar || AVATAR_PLACEHOLDER}
                      alt="Creator"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                      +
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">42.8K</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">824</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                      <Bookmark className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">1,940</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold mt-1 text-white">512</span>
                  </div>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="relative z-10 p-3 rounded-2xl bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {primaryAccount.handle || '@viral_creator'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/40 text-cyan-200">
                      Creator
                    </span>
                  </div>

                  <p className="text-xs text-white line-clamp-2 leading-snug drop-shadow-md">
                    {postCaption}
                  </p>

                  {postTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[11px] font-bold text-white drop-shadow">
                      {postTags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[10px] text-neutral-300 pt-1">
                    <Music2 className="w-3 h-3 text-cyan-300 animate-spin" />
                    <span className="truncate">Original Sound - OneClickPost Studio Mix</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-[#051326] border-t border-sky-900/80 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Preview only — final look depends on each platform</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Done Previewing
          </button>
        </div>

      </div>
    </div>
  );
};
