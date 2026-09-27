'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoAspectRatio, VideoFitMode } from '../types';
import {
  Scissors,
  Check,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Square,
  Sparkles,
  Maximize2,
  X,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface VideoTrimmerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTrimmerModal: React.FC<VideoTrimmerModalProps> = ({ isOpen, onClose }) => {
  const {
    videoUrl,
    videoFileName,
    videoAspectRatio,
    setVideoAspectRatio,
    videoFitMode,
    setVideoFitMode,
    videoTrimRange,
    setVideoTrimRange,
    videoDuration,
    setVideoDuration,
    theme,
  } = useApp();

  const isSmooth = theme === 'smooth' || theme === 'light';

  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  // Local working states
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(videoAspectRatio || 'original');
  const [fitMode, setFitMode] = useState<VideoFitMode>(videoFitMode || 'contain-blur');
  const [startSec, setStartSec] = useState<number>(videoTrimRange?.[0] || 0);
  const [endSec, setEndSec] = useState<number>(videoTrimRange?.[1] || 60);
  const [totalDuration, setTotalDuration] = useState<number>(60);
  const [currentTime, setCurrentTime] = useState<number>(videoTrimRange?.[0] || 0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from context whenever opened
  useEffect(() => {
    if (isOpen) {
      setAspectRatio(videoAspectRatio || 'original');
      setFitMode(videoFitMode || 'contain-blur');
      setStartSec(videoTrimRange?.[0] || 0);
      setEndSec(videoTrimRange?.[1] || 60);
      setCurrentTime(videoTrimRange?.[0] || 0);
      setIsPlaying(false);
    }
  }, [isOpen, videoAspectRatio, videoFitMode, videoTrimRange]);

  // Read actual video duration from element
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const d = videoRef.current.duration;
      if (!isNaN(d) && d > 0) {
        const rounded = Math.round(d * 10) / 10;
        setTotalDuration(rounded);
        if (endSec > rounded || endSec === 60) {
          setEndSec(rounded);
        }
      }
    }
  };

  // Keep playback looped within [startSec, endSec]
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Also sync background video if blur mode is active
      if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - cur) > 0.3) {
        bgVideoRef.current.currentTime = cur;
      }

      if (cur >= endSec) {
        videoRef.current.currentTime = startSec;
        if (bgVideoRef.current) bgVideoRef.current.currentTime = startSec;
        setCurrentTime(startSec);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      if (bgVideoRef.current) bgVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime < startSec || videoRef.current.currentTime >= endSec) {
        videoRef.current.currentTime = startSec;
        if (bgVideoRef.current) bgVideoRef.current.currentTime = startSec;
      }
      videoRef.current.play();
      if (bgVideoRef.current) bgVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleStartChange = (val: number) => {
    const clamped = Math.max(0, Math.min(val, endSec - 1));
    setStartSec(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
      if (bgVideoRef.current) bgVideoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    }
  };

  const handleEndChange = (val: number) => {
    const clamped = Math.min(totalDuration, Math.max(val, startSec + 1));
    setEndSec(clamped);
  };

  // Quick Preset Handlers
  const applyPreset = (presetSec: number, name: string) => {
    const targetEnd = Math.min(totalDuration, startSec + presetSec);
    setEndSec(targetEnd);
    showToast(`Applied ${name} limit (${presetSec}s)`);
  };

  const resetToFull = () => {
    setStartSec(0);
    setEndSec(totalDuration);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
    showToast('Reset to full video duration');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Save changes to Global AppContext
  const handleApply = () => {
    setVideoAspectRatio(aspectRatio);
    setVideoFitMode(fitMode);
    setVideoTrimRange([startSec, endSec]);

    const trimmedLength = Math.round((endSec - startSec) * 10) / 10;
    const m = Math.floor(trimmedLength / 60);
    const s = Math.round(trimmedLength % 60);
    setVideoDuration(`${m}:${s.toString().padStart(2, '0')}`);

    onClose();
  };

  if (!isOpen) return null;

  const clipDuration = Math.max(0.1, Math.round((endSec - startSec) * 10) / 10);

  // Aspect ratio visual dimensions
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] w-64 max-w-full';
      case '16:9':
        return 'aspect-[16/9] w-full max-w-lg';
      case '1:1':
        return 'aspect-square w-72 max-w-full';
      case '4:5':
        return 'aspect-[4/5] w-72 max-w-full';
      case 'original':
      default:
        return 'aspect-[16/9] w-full max-w-md';
    }
  };

  const ratios: { id: VideoAspectRatio; label: string; icon: React.ReactNode; badge: string; desc: string }[] = [
    {
      id: '9:16',
      label: '9:16 Vertical',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
      badge: 'Shorts • Reels • TikTok',
      desc: 'Mobile-first vertical format for maximum reach & retention',
    },
    {
      id: '16:9',
      label: '16:9 Landscape',
      icon: <Monitor className="w-4 h-4 text-blue-400" />,
      badge: 'YouTube • Facebook',
      desc: 'Standard widescreen presentation for desktop & TV feeds',
    },
    {
      id: '1:1',
      label: '1:1 Square',
      icon: <Square className="w-4 h-4 text-purple-400" />,
      badge: 'Instagram • X (Twitter)',
      desc: 'Square tile format optimized for feed timeline scrolling',
    },
    {
      id: '4:5',
      label: '4:5 Portrait',
      icon: <Maximize2 className="w-4 h-4 text-emerald-400" />,
      badge: 'Instagram Feed',
      desc: 'Tall portrait format covering maximum mobile screen area',
    },
    {
      id: 'original',
      label: 'Original Ratio',
      icon: <Layers className="w-4 h-4 text-amber-400" />,
      badge: 'Raw Source',
      desc: 'Keeps unmodified source dimensions without alteration',
    },
  ];

  const fitModes: { id: VideoFitMode; label: string; emoji: string; desc: string }[] = [
    {
      id: 'contain-blur',
      label: 'Smart Blur Ambient',
      emoji: '✨',
      desc: 'Cinematic blurred motion backdrop fills empty edges',
    },
    {
      id: 'cover',
      label: 'Center Zoom & Crop',
      emoji: '🔍',
      desc: 'Fills entire aspect frame, cropping edges evenly',
    },
    {
      id: 'contain-black',
      label: 'Cinema Letterbox',
      emoji: '⬛',
      desc: 'Full video visible with clean OLED black padding',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto transition-all ${
          isSmooth
            ? 'bg-white border border-slate-200 text-slate-900 shadow-2xl'
            : 'bg-[#030914] border border-sky-800/80 text-white shadow-cyan-950/40'
        }`}
      >
        {/* Modal Top Header */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#051124] border-sky-900/60'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  Video Trimmer & Ratio Formatter
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-700/60">
                  Auto-Fit Studio
                </span>
              </div>
              <p className={`text-xs ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                {videoFileName || 'Selected Video'} • Format for Shorts, Reels, TikTok & YouTube
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSmooth ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-sky-900/50 text-slate-400'
            }`}
            aria-label="Close trimmer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Player Canvas, Right Controls */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Visual Video Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            <div
              className={`w-full h-80 sm:h-96 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden border ${
                isSmooth ? 'bg-slate-100 border-slate-200' : 'bg-black/95 border-sky-900/70'
              }`}
            >
              {/* Dynamic Aspect Ratio Box */}
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center ${getAspectRatioClasses()}`}
                style={{ maxHeight: '100%' }}
              >
                {/* Blur Background Layer (when contain-blur mode is chosen) */}
                {fitMode === 'contain-blur' && aspectRatio !== 'original' && (
                  <video
                    ref={bgVideoRef}
                    src={videoUrl}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-70 pointer-events-none"
                  />
                )}

                {/* Primary Video Element */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  className={`relative z-10 w-full h-full transition-all ${
                    fitMode === 'cover'
                      ? 'object-cover'
                      : fitMode === 'contain-blur'
                      ? 'object-contain'
                      : 'object-contain bg-black'
                  }`}
                />

                {/* Aspect Badge Overlay */}
                <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-sm">
                  <span>{aspectRatio}</span>
                  <span className="text-cyan-400">• {fitMode === 'contain-blur' ? 'Blur Canvas' : fitMode}</span>
                </div>

                {/* Center Play Overlay Trigger */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`absolute inset-0 z-20 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group cursor-pointer ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </div>
                </button>

                {/* Bottom Video Controls Overlay */}
                <div className="absolute bottom-2 left-2 right-2 z-20 px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <span>{formatTime(currentTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Trim: {formatTime(clipDuration)}</span>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Aspect & Trim Status Summary Pill */}
            <div
              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#040e1e] border-sky-900/60'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Selected Duration:</span>
                <span className="font-mono font-bold text-cyan-400">{clipDuration}s</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <span>Start: {formatTime(startSec)}</span>
                <span>•</span>
                <span>End: {formatTime(endSec)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Controls, Aspect Ratio Formatter & Timeline Trimmer */}
          <div className="lg:col-span-6 space-y-5">
            {/* 1. Aspect Ratio Formatter Picker */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>1. Select Aspect Ratio (Auto-Crop)</span>
                <span className="text-[10px] text-cyan-400 font-mono">1-Click Convert</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ratios.map((r) => {
                  const isSelected = aspectRatio === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setAspectRatio(r.id);
                        showToast(`Switched to ${r.label}`);
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? isSmooth
                            ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
                            : 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                          : isSmooth
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : 'bg-[#040e1e] border-sky-900 hover:border-sky-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          {r.icon}
                          <span>{r.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate font-mono">{r.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Background Fill Style (Visible when not Original) */}
            {aspectRatio !== 'original' && (
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>2. Background Canvas Style</span>
                  <span className="text-[10px] text-slate-400">For ratio conversions</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {fitModes.map((m) => {
                    const isSelected = fitMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFitMode(m.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? isSmooth
                              ? 'bg-blue-50 border-blue-500 font-bold text-blue-700'
                              : 'bg-cyan-950/70 border-cyan-400 font-bold text-cyan-300'
                            : isSmooth
                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'bg-[#040e1e] border-sky-900 text-slate-300 hover:bg-sky-950/40'
                        }`}
                      >
                        <div className="text-sm mb-0.5">{m.emoji}</div>
                        <div className="text-[11px] font-bold truncate">{m.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Timeline Scrubber & Trimmer Sliders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Timeline Trimmer (Start & End)</span>
                </label>
                <button
                  type="button"
                  onClick={resetToFull}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Full</span>
                </button>
              </div>

              {/* Visual Multi-Handle Range Bar */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#020713] border border-sky-900 shadow-inner">
                {/* Timeline Strip */}
                <div className="relative h-9 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center border border-slate-800">
                  {/* Active Highlighted Trim Window */}
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/40 to-cyan-500/30 border-y border-cyan-400 pointer-events-none"
                    style={{
                      left: `${(startSec / totalDuration) * 100}%`,
                      width: `${((endSec - startSec) / totalDuration) * 100}%`,
                    }}
                  />

                  {/* Playhead Cursor */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md shadow-white pointer-events-none z-10"
                    style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                  />

                  {/* Tick Marks (0s, 15s, 30s, 45s, 60s) */}
                  <div className="absolute inset-0 flex justify-between px-2 items-center pointer-events-none text-[9px] font-mono text-slate-500">
                    <span>0s</span>
                    <span>15s</span>
                    <span>30s</span>
                    <span>45s</span>
                    <span>{Math.round(totalDuration)}s</span>
                  </div>
                </div>

                {/* Range Sliders */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-300 w-12">Start:</span>
                    <input
                      type="range"
                      min={0}
                      max={totalDuration}
                      step={0.5}
                      value={startSec}
                      onChange={(e) => handleStartChange(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-white font-bold w-16 text-right">
                      {formatTime(startSec)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-purple-300 w-12">End:</span>
                    <input
                      type="range"
                      min={0}
                      max={totalDuration}
                      step={0.5}
                      value={endSec}
                      onChange={(e) => handleEndChange(parseFloat(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-white font-bold w-16 text-right">
                      {formatTime(endSec)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Social Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Quick Platform Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset(15, 'Story / Teaser')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors"
                  >
                    ⚡ 15s Story
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(30, 'Shorts / TikTok')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 cursor-pointer transition-colors"
                  >
                    🔥 30s Viral
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(60, 'Full Shorts')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800 cursor-pointer transition-colors"
                  >
                    📱 60s Shorts
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(90, 'Instagram Reels')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 cursor-pointer transition-colors"
                  >
                    📸 90s Reels
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(140, 'X (Twitter)')}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-neutral-900 hover:bg-neutral-800 text-slate-300 border border-neutral-700 cursor-pointer transition-colors"
                  >
                    🐦 140s X
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-t ${
            isSmooth ? 'bg-slate-50 border-slate-200' : 'bg-[#051124] border-sky-900/60'
          }`}
        >
          {/* Notification Toast */}
          <div className="text-xs font-semibold text-cyan-400 truncate max-w-xs">
            {toastMessage && (
              <span className="flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="w-3.5 h-3.5" />
                {toastMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isSmooth
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-[#040e1e] border-sky-900 text-slate-300 hover:bg-sky-950'
              }`}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Formatting & Trim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
