'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { PostItem } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ScheduledPostsScreen: React.FC = () => {
  const { posts, setSelectedPostDetail, navigateTo, goBack, t } = useApp();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'published'>('upcoming');

  const upcomingPosts = posts.filter((p) => p.status === 'scheduled');
  const publishedPosts = posts.filter((p) => p.status === 'published');

  const handlePostClick = (post: PostItem) => {
    setSelectedPostDetail(post);
    navigateTo('postDetail');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {t('scheduledPosts')}
            </h1>
            <p className="text-xs text-slate-400">
              Manage automated queues and published history
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('create')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t('newPost')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-[#051326] border border-sky-900/60 max-w-xs">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('upcoming')} ({upcomingPosts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('published')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'published'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {t('publishedTab')} ({publishedPosts.length})
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {activeTab === 'upcoming' ? (
          upcomingPosts.length > 0 ? (
            upcomingPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="glass-card glass-card-hover rounded-2xl p-4 border border-sky-800/60 flex items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sky-900"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                      {post.title}
                    </h4>

                    {/* Platforms list */}
                    <div className="flex items-center gap-1.5 my-1.5">
                      {post.selectedPlatforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size="sm" />
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        {post.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        {post.scheduledTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800 hidden sm:inline">
                    Scheduled
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center glass-card rounded-3xl border border-sky-900/60 space-y-3">
              <Calendar className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">
                No upcoming scheduled posts.
              </p>
              <button
                type="button"
                onClick={() => navigateTo('create')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs"
              >
                Schedule Your Next Video
              </button>
            </div>
          )
        ) : publishedPosts.length > 0 ? (
          publishedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post)}
              className="glass-card glass-card-hover rounded-2xl p-4 border border-sky-800/60 flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-sky-900"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h4>

                  <div className="flex items-center gap-1.5 my-1.5">
                    {post.selectedPlatforms.map((p) => (
                      <PlatformIcon key={p} platform={p} size="sm" />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 truncate">
                    {post.viewsTotal ? `${post.viewsTotal.toLocaleString()} views • ` : ''}
                    Published on {post.selectedPlatforms.length} networks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 hidden sm:inline">
                  ✓ Published
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center glass-card rounded-3xl border border-sky-900/60 space-y-3">
            <p className="text-sm text-slate-300 font-semibold">
              No published posts recorded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
