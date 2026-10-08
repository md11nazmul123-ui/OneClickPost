'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { scheduleTimeError } from '../lib/posts-api';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';

export const ScheduleScreen: React.FC = () => {
  const {
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    publishPostNow,
    schedulePostNow,
    goBack,
    t,
    posts,
  } = useApp();

  // বেছে নেওয়া তারিখ থেকে মাস/বছর (না থাকলে আজ)
  const initial = (() => {
    const [y, m, d] = scheduledDate.split('-').map(Number);
    if (y && m && d) return { year: y, month: m - 1, day: d };
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  })();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(initial.month);
  const [currentYear, setCurrentYear] = useState(initial.year);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const startingDayOffset = new Date(currentYear, currentMonthIndex, 1).getDay();

  // যে দিনগুলোতে আগে থেকে পোস্ট শিডিউল করা আছে
  const scheduledDays = new Set(
    posts
      .filter((p) => p.status === 'scheduled' && p.scheduledDate)
      .map((p) => p.scheduledDate as string)
  );

  // প্রতি ৩০ সেকেন্ডে "এখন" আপডেট — যাতে সময় পার হয়ে গেলে সাথে সাথে সতর্কবার্তা আসে
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timeError = scheduleTimeError(scheduledDate, scheduledTime, now);

  const changeMonth = (delta: number) => {
    const next = new Date(currentYear, currentMonthIndex + delta, 1);
    setCurrentYear(next.getFullYear());
    setCurrentMonthIndex(next.getMonth());
  };

  const handleDaySelect = (dayNum: number) => {
    const dayStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    const monthStr = currentMonthIndex + 1 < 10 ? `0${currentMonthIndex + 1}` : `${currentMonthIndex + 1}`;
    setScheduledDate(`${currentYear}-${monthStr}-${dayStr}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {t('schedulePost')}
          </h1>
          <p className="text-xs text-slate-400">
            {t('schedulePostDesc')}
          </p>
        </div>
      </div>

      {/* Interactive Calendar Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {months[currentMonthIndex]} {currentYear}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-xl bg-[#051428] border border-sky-900 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="p-2 rounded-xl bg-[#051428] border border-sky-900 text-slate-300 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty offset days */}
          {Array.from({ length: startingDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[44px]" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = scheduledDate === dateKey;
            const hasEvent = scheduledDays.has(dateKey);
            const isPast = dateKey < todayKey;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => handleDaySelect(dayNum)}
                disabled={isPast}
                className={`min-h-[44px] rounded-xl flex flex-col items-center justify-center p-1 text-xs font-bold transition-all relative border ${
                  isPast
                    ? 'opacity-35 cursor-not-allowed bg-[#041224] text-slate-500 border-sky-950'
                    : isSelected
                    ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/30'
                    : 'cursor-pointer bg-[#041224] text-slate-300 border-sky-950 hover:border-sky-700 hover:bg-[#071c36]'
                }`}
              >
                <span>{dayNum}</span>
                {hasEvent && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Time Picker and Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-sky-900/60">
          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              {t('selectTime')}
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Globe className="w-4 h-4 text-purple-400" />
              Target Timezone
            </label>
            <div className="px-3.5 py-2.5 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-300 font-mono flex items-center justify-between">
              <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
              <span className="text-cyan-400 font-bold">Auto</span>
            </div>
          </div>
        </div>

        {timeError && (
          <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">
            {timeError}
          </p>
        )}
      </div>

      {/* Action Buttons: Schedule Post OR Publish Now */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={schedulePostNow}
          disabled={!!timeError}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CalendarIcon className="w-5 h-5" />
          <span>{t('schedulePost')}</span>
        </button>

        <button
          type="button"
          onClick={publishPostNow}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#081a33] hover:bg-[#0c264c] border border-sky-800 text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 text-cyan-400" />
          <span>{t('publishNow')}</span>
        </button>
      </div>
    </div>
  );
};
