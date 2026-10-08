'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useMediaUpload } from '../context/MediaUploadContext';
import { validateVideoFile } from '../lib/media-upload';
import { PreviewPostModal } from '../components/PreviewPostModal';
import { Upload, Sparkles, Hash, ArrowRight, ArrowLeft, Bookmark, Video, Film, Eye, Loader2, X } from 'lucide-react';

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
    saveCurrentAsDraft,
    aiTone,
    setAiTone,
    aiLanguage,
    setAiLanguage,
    aiBusy,
    aiError,
    clearAiError,
    generateAICaption,
    generateAIHashtags,
    generateAITitle,
    selectedAccountIds,
    selectedPlatforms,
    platformSettings,
    accounts,
    navigateTo,
    goBack,
    t,
  } = useApp();

  const upload = useMediaUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // একই ফাইল আবার সিলেক্ট করা যাবে
    if (!file) return;

    // সার্ভারে পাঠানোর আগেই ব্রাউজারে যাচাই (সার্ভারেও আবার যাচাই হবে)
    const invalid = validateVideoFile(file);
    if (invalid) {
      setFileError(invalid);
      return;
    }
    setFileError(null);

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setVideoFileName(file.name);

    // আসল আপলোড শুরু (প্রোগ্রেস নিচে দেখাবে)
    void upload.startUpload(file);
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            title="Preview how this post looks on each selected platform"
          >
            <Eye className="w-4 h-4 text-white" />
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
            </div>

            {/* Video Player Box */}
            <div className="relative rounded-2xl overflow-hidden bg-black/95 border border-sky-800 group shadow-inner mx-auto flex items-center justify-center aspect-video w-full">
              {videoUrl ? (
                <video src={videoUrl} controls playsInline className="w-full h-full object-contain bg-black" />
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
                    Supports MP4, MOV, WebM up to 2 GB
                  </p>
                </div>
              )}
            </div>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Video Info & Change Media Buttons */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-[#040e1d] border border-sky-950 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-300 truncate max-w-[200px] font-medium">
                    {upload.fileName || videoFileName || 'Selected Video'}
                  </span>
                  {upload.status === 'uploading' && (
                    <span className="text-[10px] text-amber-300 font-mono">Uploading {upload.progress}%</span>
                  )}
                  {upload.status === 'ready' && (
                    <span className="text-[10px] text-emerald-400 font-mono">✓ Uploaded</span>
                  )}
                  {upload.status === 'error' && (
                    <span className="text-[10px] text-rose-400 font-mono">Failed</span>
                  )}
                  {upload.status === 'idle' && (
                    <span className="text-[10px] text-slate-500 font-mono">Not uploaded</span>
                  )}
                </div>

                {upload.status === 'uploading' && (
                  <div className="h-1.5 w-full rounded-full bg-sky-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}

                {(upload.status === 'error' || fileError) && (
                  <p role="alert" className="text-[11px] text-rose-400">
                    {fileError ?? upload.error}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0a2038] hover:bg-[#0f2c4d] border border-sky-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{videoUrl ? t('changeMedia') : t('uploadPrompt')}</span>
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
              <button
                type="button"
                onClick={() => void generateAITitle()}
                disabled={aiBusy !== null}
                className="text-xs font-bold text-blue-600 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Suggest a better title with AI"
              >
                {aiBusy === 'title' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{aiBusy === 'title' ? 'Writing…' : 'AI Title'}</span>
              </button>
            </div>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value.slice(0, 100))}
              placeholder="Give your video a clear title (max 100 characters)"
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
                    onClick={() => setAiTone(tItem.id)}
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

            {/* AI Language */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-400">AI Language:</span>
              <div className="flex gap-1.5">
                {([
                  { id: 'en', label: 'English' },
                  { id: 'bn', label: 'বাংলা' },
                ] as const).map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setAiLanguage(lang.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      aiLanguage === lang.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                        : 'bg-[#051326] text-slate-400 border-sky-900/60 hover:text-slate-200'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Generate Caption Button */}
            <button
              type="button"
              onClick={() => void generateAICaption()}
              disabled={aiBusy !== null}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {aiBusy === 'caption' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-yellow-300" />
              )}
              <span>{aiBusy === 'caption' ? 'AI is writing…' : 'Auto-Generate Caption with AI'}</span>
            </button>

            {aiError && (
              <div className="flex items-start justify-between gap-2 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
                <span>{aiError}</span>
                <button type="button" onClick={clearAiError} className="shrink-0 cursor-pointer" title="Close">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
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
                onClick={() => void generateAIHashtags()}
                disabled={aiBusy !== null}
                className="text-xs font-bold text-purple-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiBusy === 'hashtags' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{aiBusy === 'hashtags' ? 'Finding…' : t('aiGenerateHashtags')}</span>
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
                  No hashtags added yet. Type your tags below, separated by commas.
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
    </div>
  );
};
