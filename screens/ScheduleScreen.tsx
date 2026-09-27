'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Repeat,
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
    repeat,
    setRepeat,
    publishPostNow,
    schedulePostNow,
    goBack,
    t,
  } = useApp();

  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(26);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = 30; // September has 30 days
  const startingDayOffset = 2; // Tuesday start for Sep 2026

  const handleDaySelect = (dayNum: number) => {
    setSelectedDay(dayNum);
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
              onClick={() => setCurrentMonthIndex((m) => Math.max(0, m - 1))}
              className="p-2 rounded-xl bg-[#051428] border border-sky-900 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonthIndex((m) => Math.min(11, m + 1))}
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
            const isSelected = selectedDay === dayNum;
            const hasEvent = [5, 12, 21, 26].includes(dayNum);

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => handleDaySelect(dayNum)}
                className={`min-h-[44px] rounded-xl flex flex-col items-center justify-center p-1 text-xs font-bold transition-all relative cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white border-cyan-300 shadow-lg shadow-cyan-500/30'
                    : 'bg-[#041224] text-slate-300 border-sky-950 hover:border-sky-700 hover:bg-[#071c36]'
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
              <span>Asia/Dhaka (GMT+6)</span>
              <span className="text-cyan-400 font-bold">Auto</span>
            </div>
          </div>
        </div>

        {/* Repeat Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041122] border border-sky-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-950 text-cyan-400">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {t('repeatOptional')}
              </span>
              <span className="text-[11px] text-slate-400">
                Automatically repost or repeat broadcast schedule
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRepeat(!repeat)}
            className={`w-12 h-6.5 rounded-full p-1 transition-colors relative flex items-center cursor-pointer ${
              repeat ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-md ${
                repeat ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons: Schedule Post OR Publish Now */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={schedulePostNow}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 group transition-all transform active:scale-[0.99] cursor-pointer"
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
