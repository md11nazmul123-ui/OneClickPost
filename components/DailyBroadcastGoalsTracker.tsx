'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from './PlatformIcon';
import {
  Target,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Flame,
  ArrowRight,
  Check,
  RotateCcw,
} from 'lucide-react';

interface DailyBroadcastGoalsTrackerProps {
  className?: string;
}

export const DailyBroadcastGoalsTracker: React.FC<DailyBroadcastGoalsTrackerProps> = ({
  className = '',
}) => {
  const {
    dailyBroadcastGoal,
    setDailyBroadcastGoal,
    todayBroadcastsCount,
    incrementTodayBroadcasts,
    decrementTodayBroadcasts,
    resetTodayBroadcasts,
    navigateTo,
    theme,
  } = useApp();

  const isSmooth = theme === 'smooth' || theme === 'light';
  const [customInputVal, setCustomInputVal] = useState<string>(dailyBroadcastGoal.toString());

  // Keep local input in sync with external goal changes
  useEffect(() => {
    setCustomInputVal(dailyBroadcastGoal.toString());
  }, [dailyBroadcastGoal]);

  // Quick preset targets
  const presetGoals = [2, 3, 5, 8, 10];

  const target = Math.max(1, dailyBroadcastGoal);
  const completed = Math.max(0, todayBroadcastsCount);
  const remaining = Math.max(0, target - completed);
  const progressPercent = Math.min(100, Math.round((completed / target) * 100));
  const isGoalAchieved = completed >= target;
  const isOverachieved = completed > target;

  // SVG Circular Gauge Calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius; // ~301.59
  const strokeDashoffset = circumference - (Math.min(100, progressPercent) / 100) * circumference;

  // Animation states for initial page load draw and live value updates
  const [animatedOffset, setAnimatedOffset] = useState<number>(circumference);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Initial page load smooth draw transition
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setAnimatedOffset(strokeDashoffset);
      setHasMounted(true);
    }, 150);
    return () => clearTimeout(loadTimer);
  }, []);

  // Live value update transition
  useEffect(() => {
    if (hasMounted) {
      setAnimatedOffset(strokeDashoffset);
      setIsUpdating(true);
      const updateTimer = setTimeout(() => {
        setIsUpdating(false);
      }, 700);
      return () => clearTimeout(updateTimer);
    }
  }, [strokeDashoffset, hasMounted]);

  const handlePresetSelect = (val: number) => {
    setDailyBroadcastGoal(val);
    setCustomInputVal(val.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomInputVal(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
      setDailyBroadcastGoal(parsed);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(customInputVal, 10);
    if (isNaN(parsed) || parsed < 1) {
      setDailyBroadcastGoal(1);
      setCustomInputVal('1');
    } else if (parsed > 50) {
      setDailyBroadcastGoal(50);
      setCustomInputVal('50');
    } else {
      setDailyBroadcastGoal(parsed);
    }
  };

  const handleStepDown = () => {
    if (target > 1) {
      const next = target - 1;
      setDailyBroadcastGoal(next);
      setCustomInputVal(next.toString());
    }
  };

  const handleStepUp = () => {
    if (target < 50) {
      const next = target + 1;
      setDailyBroadcastGoal(next);
      setCustomInputVal(next.toString());
    }
  };

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden border ${
        isSmooth
          ? 'bg-white border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)]'
          : 'glass-card border-sky-800/60 shadow-2xl'
      } ${className}`}
    >
      {/* Background ambient lighting accent */}
      <div
        className={`absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isGoalAchieved
            ? isSmooth
              ? 'bg-emerald-400/10'
              : 'bg-emerald-500/15'
            : isSmooth
            ? 'bg-sky-400/10'
            : 'bg-cyan-500/10'
        }`}
      />

      {/* Header Zone: Title & Streak Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`p-1.5 rounded-lg border ${
                isGoalAchieved
                  ? isSmooth
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : isSmooth
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
              }`}
            >
              <Target className="w-4 h-4" />
            </div>
            <h2
              className={`text-base sm:text-lg font-black tracking-tight ${
                isSmooth ? 'text-slate-950' : 'text-white'
              }`}
            >
              Daily Broadcast Goal
            </h2>
            <span
              className={`text-[11px] font-bold tracking-wide px-2 py-0.5 rounded-full border ${
                isGoalAchieved
                  ? isSmooth
                    ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                    : 'text-emerald-300 bg-emerald-950/70 border-emerald-700/60'
                  : isSmooth
                  ? 'text-blue-800 bg-blue-50 border-blue-200'
                  : 'text-cyan-300 bg-sky-950/70 border-sky-700/60'
              }`}
            >
              {isGoalAchieved ? '✓ Target Met' : 'Active Goal'}
            </span>
          </div>
          <p className={`text-xs ${isSmooth ? 'text-slate-600' : 'text-slate-300'}`}>
            Set your daily posting target and see how many broadcasts remain to complete your schedule.
          </p>
        </div>

        {/* Header Right Actions: Streak */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
              isSmooth
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-amber-950/50 border-amber-800/50 text-amber-300'
            }`}
            title="Consistent daily publishing streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>4-Day Streak</span>
          </div>
        </div>
      </div>

      {/* Target Setting Input Bar: Directly visible on the dashboard card */}
      <div
        className={`relative z-10 mb-5 p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isSmooth
            ? 'bg-slate-50/90 border-slate-200'
            : 'bg-[#040f21] border-sky-900/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isSmooth ? 'text-slate-800' : 'text-slate-200'}`}>
            Set Daily Target:
          </span>
          {/* Stepper with Number Input */}
          <div
            className={`flex items-center rounded-xl border shadow-sm ${
              isSmooth ? 'bg-white border-slate-300' : 'bg-[#07172b] border-sky-800'
            }`}
          >
            <button
              type="button"
              onClick={handleStepDown}
              disabled={target <= 1}
              className={`p-1.5 rounded-l-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors ${
                isSmooth ? 'text-slate-700' : 'text-slate-200'
              }`}
              title="Decrease target by 1"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              max="50"
              value={customInputVal}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className={`w-12 text-center text-xs font-mono font-bold bg-transparent outline-none py-1 ${
                isSmooth ? 'text-slate-950' : 'text-white'
              }`}
              title="Type your custom daily post target"
            />
            <button
              type="button"
              onClick={handleStepUp}
              disabled={target >= 50}
              className={`p-1.5 rounded-r-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors ${
                isSmooth ? 'text-slate-700' : 'text-slate-200'
              }`}
              title="Increase target by 1"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className={`text-[11px] font-semibold ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
            posts / day
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
            Presets:
          </span>
          {presetGoals.map((preset) => {
            const isActive = target === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? isSmooth
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-extrabold'
                    : isSmooth
                    ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-[#071a33] hover:bg-[#0c294d] border-sky-900/60 text-slate-300'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visual Progress Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Visual Column: Radial Circular Progress Ring */}
        <div className="lg:col-span-4 flex items-center justify-center sm:justify-start gap-4">
          <div className="relative flex items-center justify-center shrink-0">
            {/* Ambient Pulse Glow on update or goal achieved */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 pointer-events-none ${
                isGoalAchieved
                  ? 'bg-emerald-500/25 scale-110'
                  : isUpdating
                  ? 'bg-cyan-500/25 scale-105'
                  : 'bg-transparent scale-95'
              }`}
            />

            <svg
              className={`w-28 h-28 transform -rotate-90 transition-transform duration-500 ${
                isGoalAchieved
                  ? 'progress-ring-achieved'
                  : isUpdating
                  ? 'progress-ring-animating scale-105'
                  : 'scale-100'
              }`}
              viewBox="0 0 116 116"
              aria-label={`Daily goal progress: ${progressPercent}%`}
            >
              {/* Background Track Circle with explicit high-contrast stroke */}
              <circle
                cx="58"
                cy="58"
                r={radius}
                stroke={isSmooth ? '#e2e8f0' : '#0c223f'}
                strokeWidth="10"
                fill="transparent"
              />

              {/* Progress Foreground Gradient Circle with smooth CSS animation */}
              <circle
                cx="58"
                cy="58"
                r={radius}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={animatedOffset}
                strokeLinecap="round"
                fill="transparent"
                className="progress-ring-circle"
                style={{
                  filter: isGoalAchieved
                    ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
                    : isUpdating
                    ? 'drop-shadow(0 0 7px rgba(6, 182, 212, 0.65))'
                    : 'drop-shadow(0 0 3px rgba(6, 182, 212, 0.35))',
                }}
                stroke={
                  isGoalAchieved
                    ? 'url(#goalAchievedGrad)'
                    : 'url(#goalProgressGrad)'
                }
              />

              <defs>
                <linearGradient id="goalProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="goalAchievedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring Metrics Display with transition animation */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center select-none transition-transform duration-300 ${
                isUpdating ? 'scale-110' : 'scale-100'
              }`}
            >
              <div className="flex items-baseline justify-center">
                <span
                  className={`font-mono text-2xl font-black tabular-nums tracking-tight transition-colors duration-300 ${
                    isSmooth ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {completed}
                </span>
                <span className={`font-mono text-xs font-bold ml-0.5 ${isSmooth ? 'text-slate-500' : 'text-slate-400'}`}>
                  /{target}
                </span>
              </div>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  isGoalAchieved
                    ? isSmooth
                      ? 'text-emerald-700 font-extrabold'
                      : 'text-emerald-400'
                    : isSmooth
                    ? 'text-blue-700 font-bold'
                    : 'text-cyan-400'
                }`}
              >
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Quick Stat Summary Beside Ring */}
          <div className="space-y-1">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider block ${
                isSmooth ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              Today's Broadcasts
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-black font-mono tabular-nums ${
                  isSmooth ? 'text-slate-950' : 'text-white'
                }`}
              >
                {completed}
              </span>
              <span className={`text-xs font-medium ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                of {target} target
              </span>
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${
              isGoalAchieved
                ? isSmooth ? 'text-emerald-700' : 'text-emerald-400'
                : isSmooth ? 'text-blue-700' : 'text-cyan-400'
            }`}>
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>
                {isGoalAchieved ? 'Target achieved!' : `${remaining} post${remaining > 1 ? 's' : ''} left`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Main Column: Target Callout, Milestone Track & Actions */}
        <div className="lg:col-span-8 space-y-4">
          {/* Status & Remaining Callout Box */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isGoalAchieved
                ? isSmooth
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                : isSmooth
                ? 'bg-slate-50/90 border-slate-200 text-slate-900'
                : 'bg-[#07172b]/90 border-sky-900/60 text-slate-200'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {isGoalAchieved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-bold">
                  {isOverachieved ? (
                    <>
                      Target Exceeded by{' '}
                      <span className="font-mono font-extrabold tabular-nums">
                        {completed - target}
                      </span>{' '}
                      bonus post{completed - target > 1 ? 's' : ''}! 🎉
                    </>
                  ) : isGoalAchieved ? (
                    <>Daily Target Achieved! All {target} broadcasts published. 🌟</>
                  ) : (
                    <>
                      <span
                        className={`font-mono font-extrabold tabular-nums ${
                          isSmooth ? 'text-blue-700' : 'text-cyan-400'
                        }`}
                      >
                        {remaining}
                      </span>{' '}
                      post{remaining === 1 ? '' : 's'} left to reach today's target
                    </>
                  )}
                </span>
              </div>
              <p
                className={`text-[11px] pl-6 ${
                  isGoalAchieved
                    ? isSmooth
                      ? 'text-emerald-800'
                      : 'text-emerald-300'
                    : isSmooth
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
              >
                {isGoalAchieved
                  ? `Great job! Your multi-channel broadcast goal has been met for today.`
                  : `Publish or schedule ${remaining} more post${remaining > 1 ? 's' : ''} to complete your daily goal.`}
              </p>
            </div>

            {/* Quick Action to Create Post */}
            <div className="flex items-center gap-2 shrink-0 pl-6 sm:pl-0">
              <button
                type="button"
                onClick={() => navigateTo('create')}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-white ${
                  isGoalAchieved
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95'
                }`}
              >
                <span>Broadcast Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Segmented Milestone Progress Track */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className={`font-bold ${isSmooth ? 'text-slate-700' : 'text-slate-300'}`}>
                Broadcast Milestones
              </span>
              <span className={`font-mono tabular-nums font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                {completed} of {target} ({remaining} remaining)
              </span>
            </div>

            {/* If target <= 10, render discrete milestone tiles */}
            {target <= 10 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {Array.from({ length: target }).map((_, idx) => {
                  const postIndex = idx + 1;
                  const isDone = postIndex <= completed;
                  const isNext = postIndex === completed + 1;

                  return (
                    <div
                      key={postIndex}
                      className={`p-2 rounded-xl border text-center transition-all flex items-center justify-between gap-1.5 ${
                        isDone
                          ? isSmooth
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                          : isNext
                          ? isSmooth
                            ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm'
                            : 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                          : isSmooth
                          ? 'bg-slate-100/80 border-slate-200 text-slate-500'
                          : 'bg-[#040e1d] border-sky-950 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-bold font-mono">#{postIndex}</span>
                      <span className="text-[10px] truncate">
                        {isDone ? 'Finished' : isNext ? 'Up Next' : 'Pending'}
                      </span>
                      {isDone ? (
                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      ) : isNext ? (
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full border border-slate-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Continuous Progress Track when target > 10 */
              <div
                className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                  isSmooth ? 'bg-slate-100 border-slate-200' : 'bg-[#040e1d] border-sky-950'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isGoalAchieved
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Footer Sub-bar: Testing Controls & Active Connected Channels */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 dark:border-sky-950 text-[11px]">
            {/* Left: Connected Distribution Channels */}
            <div className="flex items-center gap-1.5">
              <span className={`hidden sm:inline font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                Active Networks:
              </span>
              <div className="flex items-center gap-1.5">
                <PlatformIcon platform="youtube" size="sm" />
                <PlatformIcon platform="facebook" size="sm" />
                <PlatformIcon platform="instagram" size="sm" />
                <PlatformIcon platform="tiktok" size="sm" />
              </div>
            </div>

            {/* Right: Quick Test Steppers */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold ${isSmooth ? 'text-slate-600' : 'text-slate-400'}`}>
                Test Tracker:
              </span>
              <button
                type="button"
                onClick={decrementTodayBroadcasts}
                disabled={completed <= 0}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSmooth
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60 text-slate-300'
                }`}
                title="Subtract 1 test post"
              >
                -1 Post
              </button>
              <button
                type="button"
                onClick={incrementTodayBroadcasts}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  isSmooth
                    ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-cyan-950/80 hover:bg-cyan-900/80 border-cyan-800 text-cyan-300'
                }`}
                title="Log 1 test broadcast"
              >
                +1 Post
              </button>
              <button
                type="button"
                onClick={() => resetTodayBroadcasts(0)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isSmooth
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                    : 'bg-[#07172b] hover:bg-[#0c2442] border-sky-900/60 text-slate-400 hover:text-slate-200'
                }`}
                title="Reset counter to 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
