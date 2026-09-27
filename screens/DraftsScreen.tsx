'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { PlatformIcon } from '../components/PlatformIcon';
import { DraftItem } from '../types';
import {
  ArrowLeft,
  FileEdit,
  Trash2,
  Plus,
  Play,
  Clock,
} from 'lucide-react';

export const DraftsScreen: React.FC = () => {
  const { drafts, loadDraft, deleteDraft, navigateTo, goBack, t } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
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
              {t('savedDrafts')}
            </h1>
            <p className="text-xs text-slate-400">
              Continue working on your unpublished video drafts
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('create')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Video</span>
        </button>
      </div>

      {/* Drafts List */}
      <div className="space-y-3">
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="glass-card glass-card-hover rounded-2xl p-4 border border-sky-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div
                onClick={() => loadDraft(draft)}
                className="flex items-start sm:items-center gap-3.5 min-w-0 cursor-pointer flex-1"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-sky-900">
                  <img
                    src={draft.thumbnailUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
                    alt={draft.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white/80" />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {draft.caption || 'No caption entered yet'}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {draft.selectedPlatforms.map((p) => (
                        <PlatformIcon key={p} platform={p} size="sm" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {draft.lastEdited}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-sky-950">
                <button
                  type="button"
                  onClick={() => loadDraft(draft)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Edit Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteDraft(draft.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center glass-card rounded-3xl border border-sky-900/60 space-y-3">
            <FileEdit className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">
              No saved drafts yet.
            </p>
            <p className="text-xs text-slate-400">
              When creating a post, tap "Save Draft" to keep your work in progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
