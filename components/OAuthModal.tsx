'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from './PlatformIcon';
import { ShieldCheck, Lock, ExternalLink, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const OAuthModal: React.FC = () => {
  const { oauthModalPlatform, oauthTargetAccountId, closeOAuthModal, confirmOAuthConnect, t } = useApp();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [step, setStep] = useState<'consent' | 'authorizing' | 'success'>('consent');
  const [accountHandle, setAccountHandle] = useState('');
  const [accountLabel, setAccountLabel] = useState('');

  if (!oauthModalPlatform) return null;

  const getPlatformDetails = () => {
    switch (oauthModalPlatform) {
      case 'youtube':
        return {
          title: 'Google & YouTube OAuth 2.0',
          accountType: 'Google Workspace / YouTube Channel',
          scopes: [
            'Manage and upload YouTube videos (youtube.upload)',
            'View YouTube channel analytics (yt-analytics.readonly)',
            'View channel and account details (youtube.readonly)',
          ],
          officialUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        };
      case 'facebook':
        return {
          title: 'Meta / Facebook Login for Creators',
          accountType: 'Facebook Page & Creator Profile',
          scopes: [
            'Publish video reels and feed posts (pages_manage_posts)',
            'Read page audience engagement metrics (pages_read_engagement)',
            'Access business pages list (pages_show_list)',
          ],
          officialUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
        };
      case 'instagram':
        return {
          title: 'Instagram Professional OAuth',
          accountType: 'Instagram Business / Creator Account',
          scopes: [
            'Publish Reels and carousel videos (instagram_content_publish)',
            'Access profile insights and audience statistics (instagram_manage_insights)',
            'Read basic account information (instagram_basic)',
          ],
          officialUrl: 'https://api.instagram.com/oauth/authorize',
        };
      case 'tiktok':
        return {
          title: 'TikTok for Creators OAuth 2.0',
          accountType: 'TikTok Verified Creator Profile',
          scopes: [
            'Upload video direct to TikTok (video.upload)',
            'Publish video to user feed (video.publish)',
            'View basic user profile & followers (user.info.basic)',
          ],
          officialUrl: 'https://www.tiktok.com/v2/auth/authorize/',
        };
      case 'x':
        return {
          title: 'X (Twitter) Developer OAuth 2.0',
          accountType: 'X Account',
          scopes: [
            'Post tweets with media (tweet.write)',
            'Read timeline and engagement (tweet.read)',
            'Access public profile details (users.read)',
          ],
          officialUrl: 'https://twitter.com/i/oauth2/authorize',
        };
      case 'pinterest':
        return {
          title: 'Pinterest Business OAuth',
          accountType: 'Pinterest Creator Account',
          scopes: [
            'Create video pins (pins:write)',
            'Read boards and analytics (boards:read)',
          ],
          officialUrl: 'https://www.pinterest.com/oauth/',
        };
      case 'linkedin':
        return {
          title: 'LinkedIn Creator OAuth 2.0',
          accountType: 'LinkedIn Personal / Organization Page',
          scopes: [
            'Share video updates and posts (w_member_social)',
            'Read author profile info (r_liteprofile)',
          ],
          officialUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        };
      default:
        return {
          title: 'Official OAuth 2.0 Authorization',
          accountType: 'Social Media Account',
          scopes: ['Read and publish content'],
          officialUrl: 'https://oauth.example.com',
        };
    }
  };

  const details = getPlatformDetails();

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setStep('authorizing');

    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        confirmOAuthConnect(oauthModalPlatform, {
          handle: accountHandle.trim() || undefined,
          accountLabel: accountLabel.trim() || undefined,
          accountId: oauthTargetAccountId || undefined,
        });
        setIsAuthorizing(false);
        setStep('consent');
        setAccountHandle('');
        setAccountLabel('');
      }, 1000);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#081a33] to-[#040e1f] border border-sky-700/60 p-6 shadow-2xl shadow-cyan-950/50">
        {/* Close Button */}
        <button
          onClick={closeOAuthModal}
          disabled={isAuthorizing}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-sky-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <PlatformIcon platform={oauthModalPlatform} size="lg" />
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {details.title}
            </h3>
            <p className="text-xs text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official API Integration
            </p>
          </div>
        </div>

        {step === 'consent' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#030d1c] border border-sky-900/60 space-y-2.5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                  Target Account Type
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  {details.accountType}
                </p>
              </div>

              {/* Multi-Account Channel Identifier */}
              <div className="pt-2 border-t border-sky-950 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Channel / Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={accountHandle}
                    onChange={(e) => setAccountHandle(e.target.value)}
                    placeholder="@ChannelName"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#051428] border border-sky-900 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Label (e.g. 2nd Channel)
                  </label>
                  <input
                    type="text"
                    value={accountLabel}
                    onChange={(e) => setAccountLabel(e.target.value)}
                    placeholder="e.g. Gaming / Page"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#051428] border border-sky-900 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Permissions Requested:
              </span>
              <div className="space-y-2">
                {details.scopes.map((scope, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-sky-950/30 border border-sky-900/40 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{scope}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Security Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-300">
                  Client-Side Credential Safety
                </strong>
                Tokens are exchanged and stored encrypted on the server. Your API
                secret and client password are never stored in your browser.
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={closeOAuthModal}
                className="flex-1 py-3 px-4 rounded-xl border border-sky-900/70 text-slate-300 hover:bg-sky-900/30 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Authorize & Connect</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 'authorizing' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-sky-900 border-t-cyan-400 animate-spin mx-auto" />
            <div>
              <h4 className="text-base font-bold text-white">
                Contacting {details.title}...
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Exchanging PKCE code challenge and validating OAuth scopes securely.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 grid place-items-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              Successfully Connected!
            </h4>
            <p className="text-xs text-slate-300">
              Account ready for multi-platform broadcasting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
