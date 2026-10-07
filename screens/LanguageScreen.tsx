'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { ArrowLeft, Check, Globe, Search } from 'lucide-react';

export const LanguageScreen: React.FC = () => {
  const { language, setLanguage, goBack, t } = useApp();
  const [search, setSearch] = useState('');

  const options: {
    code: LanguageCode;
    name: string;
    localName: string;
    flag: string;
    country: string;
    banglaName: string;
  }[] = [
    {
      code: 'en',
      name: 'English',
      localName: 'English (US & Global)',
      flag: '🇺🇸',
      country: 'Global',
      banglaName: 'ইংরেজি',
    },
    {
      code: 'bn',
      name: 'Bengali',
      localName: 'বাংলা (বাংলাদেশ ও ভারত)',
      flag: '🇧🇩',
      country: 'বাংলাদেশ ও ভারত',
      banglaName: 'বাংলা',
    },
  ];

  const filteredOptions = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) ||
      opt.localName.toLowerCase().includes(search.toLowerCase()) ||
      opt.country.toLowerCase().includes(search.toLowerCase()) ||
      opt.banglaName.toLowerCase().includes(search.toLowerCase()) ||
      opt.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28 space-y-5">
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
            {t('language')}
          </h1>
          <p className="text-xs text-slate-400">
            {t('chooseLanguage')}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search country / language (চায়না, জাপান, মিশর, পর্তুগাল, ইত্যাদি)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#041122] border border-sky-900/80 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Language Options */}
      <div className="glass-card rounded-3xl p-4 border border-sky-800/70 shadow-2xl space-y-2.5">
        {filteredOptions.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <div
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#08203d] border-cyan-400 shadow-md shadow-cyan-950/40'
                  : 'bg-[#041122] border-sky-950 hover:border-sky-800'
              }`}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className="text-2xl shrink-0">{opt.flag}</span>
                <div className="truncate">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white block">
                      {opt.localName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-800/70 text-cyan-300 font-semibold">
                      {opt.banglaName}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block truncate">
                    {opt.name} • {opt.country}
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="w-7 h-7 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}

        {filteredOptions.length === 0 && (
          <div className="py-8 text-center text-xs text-slate-400">
            কোনো ভাষা পাওয়া যায়নি। অন্য বানান দিয়ে খুঁজুন।
          </div>
        )}
      </div>
    </div>
  );
};
