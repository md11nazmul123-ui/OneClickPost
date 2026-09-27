'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Check,
  Sliders,
} from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    notificationSettings,
    updateNotificationSettings,
    markNotificationAsRead,
    markAllNotificationsRead,
    goBack,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');

  const getIcon = (type: string) => {
    switch (type) {
      case 'publish_success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'upload_failed':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'schedule_reminder':
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case 'account_connected':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 space-y-6">
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
              {t('notifications')}
            </h1>
            <p className="text-xs text-slate-400">
              System alerts, publish confirmations, and reminders
            </p>
          </div>
        </div>

        {activeTab === 'inbox' && notifications.some((n) => !n.isRead) && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 rounded-2xl bg-[#051326] border border-sky-900/60 max-w-xs">
        <button
          type="button"
          onClick={() => setActiveTab('inbox')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inbox'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inbox ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'inbox' ? (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-[#030e1d] border-sky-950 opacity-75'
                  : 'bg-[#071933] border-cyan-500/60 shadow-lg shadow-cyan-950/30'
              }`}
            >
              <div className="p-2 rounded-xl bg-sky-950 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {notif.time}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Notification Settings */
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-sky-800/70 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">
            Notification Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041122] border border-sky-900/60">
              <div>
                <span className="text-xs font-bold text-white block">
                  Publish Success
                </span>
                <span className="text-[11px] text-slate-400">
                  Instant alert when video goes live on all platforms
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    publishSuccess: !notificationSettings.publishSuccess,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  notificationSettings.publishSuccess ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.publishSuccess ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041122] border border-sky-900/60">
              <div>
                <span className="text-xs font-bold text-white block">
                  Upload Failed Alert
                </span>
                <span className="text-[11px] text-slate-400">
                  Get notified if a network API times out or rate limits
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    uploadFailed: !notificationSettings.uploadFailed,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  notificationSettings.uploadFailed ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.uploadFailed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041122] border border-sky-900/60">
              <div>
                <span className="text-xs font-bold text-white block">
                  Scheduled Reminders
                </span>
                <span className="text-[11px] text-slate-400">
                  Reminder 15 minutes before scheduled broadcast
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    scheduledReminder: !notificationSettings.scheduledReminder,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  notificationSettings.scheduledReminder ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.scheduledReminder ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#041122] border border-sky-900/60">
              <div>
                <span className="text-xs font-bold text-white block">
                  Account Connection Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  OAuth token renewal & security authorization notices
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateNotificationSettings({
                    newAccountConnected: !notificationSettings.newAccountConnected,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                  notificationSettings.newAccountConnected ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings.newAccountConnected ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
