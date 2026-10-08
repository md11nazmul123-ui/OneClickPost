'use client';

import React, { useEffect, useState } from 'react';
import { analyticsApi, formatCount, type AnalyticsPost } from '../lib/analytics-api';
import { THUMB_PLACEHOLDER } from '../lib/placeholders';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Trash2,
  RotateCcw,
  Edit,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';

export const PostDetailsScreen: React.FC = () => {
  const {
    selectedPostDetail,
    deletePost,
    retryPost,
    navigateTo,
    goBack,
    t,
  } = useApp();

  // এই ভিডিওর YouTube হিসাব (পাবলিশ হওয়া পোস্টে)
  const [videoStats, setVideoStats] = useState<AnalyticsPost | null>(null);
  const detailId = selectedPostDetail?.id ?? '';
  const isServerPublished = selectedPostDetail?.status === 'published' && detailId.startsWith('post-');
  useEffect(() => {
    setVideoStats(null);
    if (!isServerPublished) return;
    let active = true;
    const serverId = detailId.slice(5);
    analyticsApi
      .get()
      .then((summary) => {
        if (active) setVideoStats(summary.posts.find((p) => p.post_id === serverId) ?? null);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [detailId, isServerPublished]);

  if (!selectedPostDetail) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400 mb-4">Post not found.</p>
        <button
          onClick={goBack}
          className="px-4 py-2 rounded-xl bg-sky-950 text-cyan-300 text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const post = selectedPostDetail;
  const isScheduled = post.status === 'scheduled';

  // শিডিউল করা পোস্ট মুছলে সার্ভারেও বাতিল হয় — তাই আগে নিশ্চিত হওয়া
  const handleDelete = () => {
    const question = isScheduled
      ? 'Cancel this scheduled post? It will not be published.'
      : 'Remove this post from the list? (It stays on YouTube.)';
    if (window.confirm(question)) deletePost(post.id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
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
              {t('postDetails')}
            </h1>
            <p className="text-xs text-slate-400">
              {post.status === 'scheduled' ? 'Scheduled broadcast' : 'Published post'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 transition-colors cursor-pointer"
          title={isScheduled ? 'Cancel scheduled post' : 'Delete Post'}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Details Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-2xl space-y-5">
        {/* Video Preview */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/80 border border-sky-900 relative">
          <video
            src={post.videoUrl || undefined}
            controls
            poster={post.thumbnailUrl || THUMB_PLACEHOLDER}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Caption */}
        <div>
          <h2 className="text-lg font-bold text-white mb-2">{post.title}</h2>
          <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed p-3 rounded-2xl bg-[#030d1d] border border-sky-950">
            {post.caption}
          </p>
        </div>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-sky-950 text-cyan-300 text-xs font-mono border border-sky-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Target Platforms & Schedule Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sky-900/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Target Networks:
            </span>
            <div className="flex flex-wrap gap-2">
              {post.selectedPlatforms.map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#041122] border border-sky-900 text-xs text-slate-200"
                >
                  <PlatformIcon platform={p} size="sm" />
                  <span className="capitalize">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Broadcast Time:
            </span>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>
                {post.scheduledDate ? `${post.scheduledDate} at ${post.scheduledTime}` : 'Published Immediately'}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Status Results */}
        {post.platformResults && (
          <div className="space-y-2 pt-2 border-t border-sky-900/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Network Delivery Results ({Object.keys(post.platformResults).length} Destinations):
            </span>
            <div className="space-y-1.5">
              {Object.entries(post.platformResults).map(([key, res]) => {
                if (!res) return null;
                const displayName = res.accountHandle ? `${res.accountName || ''} (${res.accountHandle})` : key.toUpperCase();

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#030e1d] text-xs"
                  >
                    <span className="font-semibold text-slate-300">
                      {displayName}
                    </span>
                    {res.status === 'published' ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : res.status === 'failed' ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    ) : (
                      <span className="text-cyan-400">{isScheduled ? 'Scheduled' : 'In queue'}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* YouTube Stats */}
        {videoStats && (
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Views', value: videoStats.views, icon: Eye },
              { label: 'Likes', value: videoStats.likes, icon: Heart },
              { label: 'Comments', value: videoStats.comments, icon: MessageCircle },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-3 bg-[#030e1d] border border-sky-950 text-center">
                <item.icon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                <div className="text-lg font-black text-white">{formatCount(item.value)}</div>
                <div className="text-[10px] font-semibold text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          {!isScheduled && (
          <button
            type="button"
            onClick={() => retryPost(post.id)}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('retryUpload')}</span>
          </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="py-3 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isScheduled ? 'Cancel schedule' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
