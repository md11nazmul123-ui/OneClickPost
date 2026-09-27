'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Mail,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const HelpSupportScreen: React.FC = () => {
  const { goBack, t } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    {
      q: 'How does OneClickPost publish to multiple platforms simultaneously?',
      a: 'When you tap "Publish Now", our backend takes your uploaded video and distributes it via official OAuth 2.0 APIs (YouTube Data API v3, Meta Graph API for Facebook/Instagram, and TikTok Content Posting API) concurrently using queue workers.',
    },
    {
      q: 'Are my social media passwords and API tokens safe?',
      a: 'Yes! We follow strict enterprise security guidelines: Client secrets, App secrets, and Refresh Tokens are strictly kept server-side in encrypted vaults. The web client only interacts with authorized session proxies.',
    },
    {
      q: 'How does the Gemini AI Caption & Hashtag generator work?',
      a: 'Our server uses Google Gemini 2.5 models to analyze your video title, theme, and tone (Viral, Engaging, Professional, Minimal) to craft tailored captions and high-engagement hashtags for each platform.',
    },
    {
      q: 'What if an upload fails on one platform (e.g. TikTok)?',
      a: 'OneClickPost provides granular per-platform status. If TikTok or any channel encounters a network timeout or temporary rate limit, the other platforms publish uninterrupted, and you can retry only the failed channel with a single click.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setContactSubject('');
      setContactMessage('');
    }, 2500);
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
            {t('helpSupport')}
          </h1>
          <p className="text-xs text-slate-400">
            Frequently asked questions and direct creator assistance
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-2xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#041122] border border-sky-900/60 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-400 leading-relaxed border-t border-sky-950 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="glass-card rounded-3xl p-5 border border-sky-800/70 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Send a Message to Support
        </h3>

        {messageSent ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Your support ticket was submitted successfully! Our creator operations team will respond to your email.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="e.g. YouTube 4K upload inquiry"
                className="w-full px-3 py-2 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Message Details
              </label>
              <textarea
                rows={3}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Describe your issue or feature suggestion..."
                required
                className="w-full p-3 rounded-xl bg-[#030d1d] border border-sky-900 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
