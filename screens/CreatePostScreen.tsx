'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_VIDEOS } from '../data/initialData';
import { PreviewPostModal } from '../components/PreviewPostModal';
import { VideoTrimmerModal } from '../components/VideoTrimmerModal';
import {
  Upload,
  Sparkles,
  Hash,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Check,
  Video,
  Film,
  Play,
  RotateCcw,
  Eye,
  Scissors,
  Smartphone,
  Monitor,
  Square,
  Clock,
} from 'lucide-react';

export const CreatePostScreen: React.FC = () => {
  const {
    videoTitle,
    setVideoTitle,
    videoUrl,
    setVideoUrl,
    videoFileName,
    setVideoFileName,
    caption,
    setCaption,
    hashtags,
    setHashtags,
    customHashtags,
    setCustomHashtags,
    videoDuration,
    videoAspectRatio,
    setVideoAspectRatio,
    videoFitMode,
    setVideoFitMode,
    videoTrimRange,
    setVideoTrimRange,
    selectSampleVideo,
    saveCurrentAsDraft,
    generateAICaption,
    generateAIHashtags,
    isGeneratingAI,
    aiTone,
    setAiTone,
    selectedAccountIds,
    selectedPlatforms,
    platformSettings,
    accounts,
    navigateTo,
    goBack,
    t,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTrimmerModal, setShowTrimmerModal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);
      setVideoFileName(file.name);
    }
  };

  const handleCustomHashtagsChange = (value: string) => {
    setCustomHashtags(value);
    const parsed = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
    setHashtags(parsed);
  };

  const removeHashtag = (tagToRemove: string) => {
    const nextTags = hashtags.filter((t) => t !== tagToRemove);
    setHashtags(nextTags);
    setCustomHashtags(nextTags.map((t) => t.replace('#', '')).join(', '));
  };

  const addPresetTag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      const nextTags = [...hashtags, tag];
      setHashtags(nextTags);
      setCustomHashtags(nextTags.map((t) => t.replace('#', '')).join(', '));
    }
  };

  const tones = [
    { id: 'viral', label: t('toneViral'), emoji: '🔥' },
    { id: 'engaging', label: t('toneEngaging'), emoji: '💬' },
    { id: 'professional', label: t('toneProfessional'), emoji: '💼' },
    { id: 'minimal', label: t('toneMinimal'), emoji: '✨' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 space-y-6">
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
              {t('createPost')}
            </h1>
            <p className="text-xs text-slate-400">
              {t('createPostDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-700/80 text-cyan-300 text-xs font-bold transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
            title="Preview how this post looks on each selected platform"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Preview Post</span>
          </button>

          <button
            onClick={saveCurrentAsDraft}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081b33] hover:bg-[#0c284c] border border-sky-800 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">{t('saveDraft')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-cyan-400" />
                {t('videoPreview')}
              </label>
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800">
                4K Ultra HD
              </span>
            </div>

            {/* Video Player Box with Live Aspect Ratio Formatting */}
            <div
              className={`relative rounded-2xl overflow-hidden bg-black/95 border border-sky-800 group shadow-inner mx-auto flex items-center justify-center transition-all duration-300 ${
                videoAspectRatio === '9:16'
                  ? 'aspect-[9/16] max-h-[380px] w-56'
                  : videoAspectRatio === '1:1'
                  ? 'aspect-square max-h-[340px] w-full'
                  : videoAspectRatio === '4:5'
                  ? 'aspect-[4/5] max-h-[360px] w-64'
                  : 'aspect-video w-full'
              }`}
            >
              {videoUrl ? (
                <>
                  {/* Blurred Background Layer (when contain-blur is chosen for vertical/square format) */}
                  {videoFitMode === 'contain-blur' && videoAspectRatio !== 'original' && (
                    <video
                      src={videoUrl}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-70 pointer-events-none"
                    />
                  )}

                  <video
                    src={videoUrl}
                    controls
                    className={`relative z-10 w-full h-full ${
                      videoFitMode === 'cover'
                        ? 'object-cover'
                        : videoFitMode === 'contain-blur'
                        ? 'object-contain'
                        : 'object-contain bg-black'
                    }`}
                    poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                  />

                  {/* Format & Trim Floating Badges */}
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-cyan-800/80 shadow-md">
                      {videoAspectRatio === '9:16'
                        ? '📱 9:16 Shorts'
                        : videoAspectRatio === '16:9'
                        ? '🖥️ 16:9 Wide'
                        : videoAspectRatio === '1:1'
                        ? '🔲 1:1 Square'
                        : videoAspectRatio === '4:5'
                        ? '📸 4:5 Portrait'
                        : '📐 Original'}
                    </span>
                    {videoDuration && (
                      <span className="px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-semibold text-purple-300 border border-purple-800/80">
                        ⏱️ {videoDuration}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-sky-950/20 transition-colors"
                >
                  <Upload className="w-12 h-12 text-cyan-400 mb-2" />
                  <p className="text-xs font-bold text-white mb-1">
                    {t('uploadPrompt')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports MP4, MOV, WebM up to 500MB
                  </p>
                </div>
              )}
            </div>

            {/* Quick Aspect Ratio Switcher Pills */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Format:
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('9:16')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    videoAspectRatio === '9:16'
                      ? 'bg-cyan-500 text-black shadow-sm shadow-cyan-500/30'
                      : 'bg-[#040e1e] hover:bg-[#07182c] border border-sky-900 text-slate-300'
                  }`}
                  title="9:16 Vertical for YouTube Shorts, Instagram Reels, TikTok"
                >
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>9:16 Shorts</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('16:9')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    videoAspectRatio === '16:9'
                      ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-[#040e1e] hover:bg-[#07182c] border border-sky-900 text-slate-300'
                  }`}
                  title="16:9 Widescreen for YouTube & Facebook"
                >
                  <Monitor className="w-2.5 h-2.5" />
                  <span>16:9 Wide</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('1:1')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    videoAspectRatio === '1:1'
                      ? 'bg-purple-500 text-white shadow-sm shadow-purple-500/30'
                      : 'bg-[#040e1e] hover:bg-[#07182c] border border-sky-900 text-slate-300'
                  }`}
                  title="1:1 Square for Instagram & X Feed"
                >
                  <Square className="w-2.5 h-2.5" />
                  <span>1:1</span>
                </button>

                <button
                  type="button"
                  onClick={() => setVideoAspectRatio('original')}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    videoAspectRatio === 'original'
                      ? 'bg-slate-200 text-black font-extrabold'
                      : 'bg-[#040e1e] hover:bg-[#07182c] border border-sky-900 text-slate-400'
                  }`}
                >
                  Raw
                </button>
              </div>
            </div>

            {/* Trimmer Launch CTA Button */}
            <button
              type="button"
              onClick={() => setShowTrimmerModal(true)}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-950 via-sky-900 to-indigo-950 hover:from-cyan-900 hover:to-indigo-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer group"
            >
              <Scissors className="w-4 h-4 text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              <span>✂️ Video Trimmer & Aspect Ratio Studio</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono">
                {videoAspectRatio}
              </span>
            </button>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Video Info & Change Media Buttons */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#040e1d] border border-sky-950 flex items-center justify-between text-xs">
                <span className="text-slate-300 truncate max-w-[200px] font-medium">
                  {videoFileName || 'Selected Video'}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Ready</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0a2038] hover:bg-[#0f2c4d] border border-sky-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('changeMedia')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSampleModal(true)}
                  className="py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/60 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Sample Videos</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Caption, Tone, and Hashtags */}
        <div className="lg:col-span-7 space-y-5">
          {/* Broadcast Title Box */}
          <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>Broadcast / Video Title</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Used for YouTube & AI Context
              </span>
            </div>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. 5 Game-Changing AI Tools That Will Replace Programmers in 2026"
              className="w-full px-4 py-3 rounded-2xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-medium transition-all"
            />
          </div>

          {/* Caption Box */}
          <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('caption')}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">
                  {caption.length} / 2200 {t('charCount')}
                </span>
              </div>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={t('captionPlaceholder')}
              rows={4}
              className="w-full p-3.5 rounded-2xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none transition-all leading-relaxed"
            />

            {/* AI Tone Picker */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">
                AI Generation Tone:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {tones.map((tItem) => (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => {
                      setAiTone(tItem.id);
                      generateAICaption(tItem.id);
                    }}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      aiTone === tItem.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-500/30'
                        : 'bg-[#051326] text-slate-400 border-sky-900/60 hover:text-slate-200'
                    }`}
                  >
                    <span>{tItem.emoji}</span>
                    <span className="truncate">{tItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Generate Caption Button */}
            <button
              type="button"
              onClick={() => generateAICaption()}
              disabled={isGeneratingAI}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin text-yellow-300' : 'text-yellow-300'}`} />
              <span>{isGeneratingAI ? 'Generating Smart Caption via AI...' : 'Auto-Generate Caption with AI'}</span>
            </button>
          </div>

          {/* Hashtags Box */}
          <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                <Hash className="w-4 h-4 text-purple-400" />
                {t('hashtags')}
              </label>

              <button
                type="button"
                onClick={() => generateAIHashtags()}
                disabled={isGeneratingAI}
                className="text-xs font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('aiGenerateHashtags')}</span>
              </button>
            </div>

            {/* Active Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#030d1d] border border-sky-900/80 min-h-[50px] items-center">
              {hashtags.length > 0 ? (
                hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-900/40 text-cyan-300 text-xs font-medium border border-sky-700/50 hover:bg-red-950/40 hover:text-red-300 hover:border-red-800/60 transition-colors cursor-pointer group"
                    onClick={() => removeHashtag(tag)}
                    title="Click to remove"
                  >
                    <span>{tag}</span>
                    <span className="text-[10px] opacity-60 group-hover:opacity-100">✕</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">
                  No hashtags added yet. Use AI button or type custom tags below.
                </span>
              )}
            </div>

            {/* Custom Hashtags Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">
                {t('customHashtags')}
              </label>
              <input
                type="text"
                value={customHashtags}
                onChange={(e) => handleCustomHashtagsChange(e.target.value)}
                placeholder={t('customHashtagsPlaceholder')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {/* Quick Popular Tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Viral Tags:</span>
              {['#nature', '#travel', '#fyp', '#viral', '#reels', '#cinematic', '#trending'].map(
                (quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => addPresetTag(quick)}
                    className="px-2 py-0.5 rounded-md bg-[#051428] hover:bg-cyan-950/60 hover:text-cyan-300 border border-sky-900/60 transition-colors cursor-pointer"
                  >
                    + {quick}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Primary Action Button: Choose Platforms & Preview Post */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="py-4 px-5 rounded-2xl bg-[#081f3b] hover:bg-[#0c2a50] border border-cyan-500/50 text-cyan-300 font-bold text-sm shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>Preview Post</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('platforms')}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer"
            >
              <span>
                {t('choosePlatforms')} & Channels ({selectedAccountIds.length} Selected)
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Sample Videos Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#06172e] border border-sky-700/80 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Select a 4K Sample Video
                </h3>
                <p className="text-xs text-slate-400">
                  Instantly test multi-platform broadcasting without downloading files
                </p>
              </div>
              <button
                onClick={() => setShowSampleModal(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {SAMPLE_VIDEOS.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    selectSampleVideo(sample);
                    setShowSampleModal(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#040e1d] hover:bg-[#092244] border border-sky-900/60 hover:border-cyan-500/60 transition-all cursor-pointer group"
                >
                  <img
                    src={sample.thumbnail}
                    alt={sample.name}
                    className="w-16 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                      {sample.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {sample.topic}
                    </p>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {sample.duration} • {sample.size}
                    </span>
                  </div>
                  <Play className="w-4 h-4 text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Post Modal */}
      <PreviewPostModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        videoTitle={videoTitle}
        caption={caption}
        hashtags={hashtags}
        videoUrl={videoUrl}
        selectedPlatforms={selectedPlatforms}
        accounts={accounts}
        selectedAccountIds={selectedAccountIds}
        platformSettings={platformSettings}
        t={t}
      />

      {/* Video Trimmer & Ratio Formatter Modal */}
      <VideoTrimmerModal
        isOpen={showTrimmerModal}
        onClose={() => setShowTrimmerModal(false)}
      />
    </div>
  );
};
