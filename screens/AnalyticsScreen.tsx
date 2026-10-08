'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyticsApi, formatCount, timeAgo, type AnalyticsSummary } from '../lib/analytics-api';
import { AVATAR_PLACEHOLDER } from '../lib/placeholders';
import { ArrowLeft, Eye, Heart, MessageCircle, RefreshCw, Users, ExternalLink, Video, Loader2 } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { goBack, navigateTo } = useApp();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    analyticsApi
      .get()
      .then((summary) => active && setData(summary))
      .catch((e: unknown) => active && setError(e instanceof Error ? e.message : 'Could not load stats.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      setData(await analyticsApi.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not refresh stats.');
    } finally {
      setRefreshing(false);
    }
  };

  const maxDaily = Math.max(1, ...(data?.daily_views.map((d) => d.views) ?? [0]));
  const topPosts = [...(data?.posts ?? [])].sort((a, b) => b.views - a.views);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">YouTube Stats</h1>
            <p className="text-xs text-slate-400">Updated {timeAgo(data?.synced_at ?? null)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing || loading}
          className="px-3.5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Updating…' : 'Refresh'}
        </button>
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <div className="glass-card rounded-3xl p-10 border border-sky-800/70 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading stats…
        </div>
      ) : !data || data.channels.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 border border-sky-800/70 text-center space-y-3">
          <p className="text-sm text-slate-300">Connect your YouTube channel to see views, likes and subscribers.</p>
          <button
            type="button"
            onClick={() => navigateTo('accounts')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
          >
            Connect YouTube
          </button>
        </div>
      ) : (
        <>
          {/* Totals for videos published from the app */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Views', value: data.totals.views, icon: Eye },
              { label: 'Likes', value: data.totals.likes, icon: Heart },
              { label: 'Comments', value: data.totals.comments, icon: MessageCircle },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-4 border border-sky-800/70">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
                  <item.icon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-white">{formatCount(item.value)}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 -mt-3">
            From {data.totals.posts} video{data.totals.posts === 1 ? '' : 's'} published with OneClickPost (last 90 days).
          </p>

          {/* Daily new views */}
          <div className="glass-card rounded-3xl p-5 border border-sky-800/70 space-y-3">
            <h3 className="text-sm font-bold text-white">New views per day (last 14 days)</h3>
            <div className="flex items-end gap-1 h-28">
              {data.daily_views.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.views} views`}>
                  <div
                    className="w-full rounded-t-md bg-blue-500/80"
                    style={{ height: `${Math.max(2, Math.round((d.views / maxDaily) * 100))}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{data.daily_views[0]?.date.slice(5)}</span>
              <span>Today</span>
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white">Channels</h3>
            {data.channels.map((ch) => (
              <div key={ch.account_id} className="glass-card rounded-2xl p-4 border border-sky-800/70 flex items-center gap-3.5">
                <img
                  src={ch.avatar_url || AVATAR_PLACEHOLDER}
                  alt={ch.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{ch.name}</div>
                  {ch.status !== 'active' && (
                    <div className="text-[11px] text-amber-500 font-semibold">Reconnect this channel to update stats</div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center shrink-0">
                  <div>
                    <Users className="w-3.5 h-3.5 mx-auto text-slate-400" />
                    <div className="text-sm font-black text-white">{formatCount(ch.subscribers)}</div>
                    {ch.subscribers_change_7d !== null && ch.subscribers_change_7d !== 0 && (
                      <div className={`text-[10px] font-bold ${ch.subscribers_change_7d > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {ch.subscribers_change_7d > 0 ? '+' : ''}
                        {ch.subscribers_change_7d} / 7d
                      </div>
                    )}
                  </div>
                  <div>
                    <Eye className="w-3.5 h-3.5 mx-auto text-slate-400" />
                    <div className="text-sm font-black text-white">{formatCount(ch.total_views)}</div>
                  </div>
                  <div>
                    <Video className="w-3.5 h-3.5 mx-auto text-slate-400" />
                    <div className="text-sm font-black text-white">{formatCount(ch.video_count)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Videos */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-white">Your videos</h3>
            {topPosts.length === 0 ? (
              <p className="text-xs text-slate-400">No videos published from the app yet.</p>
            ) : (
              topPosts.map((p) => (
                <div key={p.post_id + (p.url ?? '')} className="glass-card rounded-2xl p-4 border border-sky-800/70 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{p.title || 'Untitled video'}</div>
                    <div className="text-[11px] text-slate-400">
                      {p.published_at ? new Date(p.published_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-white">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" />{formatCount(p.views)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-slate-400" />{formatCount(p.likes)}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-slate-400" />{formatCount(p.comments)}</span>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-500" title="Open on YouTube">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Stats update automatically every 3 hours. Private videos usually have 0 views.
          </p>
        </>
      )}
    </div>
  );
};
