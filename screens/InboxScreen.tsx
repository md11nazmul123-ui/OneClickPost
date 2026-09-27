'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, MessageSquare, Youtube, Facebook, Instagram, Send, Check } from 'lucide-react';

interface Comment {
  id: string;
  platform: 'youtube' | 'facebook' | 'instagram';
  author: string;
  text: string;
  timestamp: string;
  replied: boolean;
}

export const InboxScreen: React.FC = () => {
  const { goBack } = useApp();
  const [activePlatform, setActivePlatform] = useState<'all' | 'youtube' | 'facebook' | 'instagram'>('all');
  const [replyText, setReplyText] = useState('');

  const mockComments: Comment[] = [
    { id: '1', platform: 'youtube', author: 'TechGuru', text: 'Great video!', timestamp: '2m ago', replied: false },
    { id: '2', platform: 'facebook', author: 'Sarah', text: 'Loved this travel tip!', timestamp: '1h ago', replied: true },
    { id: '3', platform: 'instagram', author: 'CoderLife', text: 'How do you do that?', timestamp: '3h ago', replied: false },
  ];

  const filteredComments = activePlatform === 'all' 
    ? mockComments 
    : mockComments.filter(c => c.platform === activePlatform);

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-white">Unified Social Inbox</h1>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'youtube', 'facebook', 'instagram'] as const).map(p => (
          <button 
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-4 py-2 rounded-xl capitalize font-bold ${activePlatform === p ? 'bg-cyan-600 text-white' : 'bg-[#07182c] text-slate-400'}`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredComments.map(comment => (
            <div key={comment.id} className="p-4 bg-[#07182c] border border-sky-900 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                {getPlatformIcon(comment.platform)}
                <span className="font-bold text-white text-sm">{comment.author}</span>
                <span className="text-slate-500 text-xs">{comment.timestamp}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{comment.text}</p>
              {comment.replied ? (
                <div className="flex items-center gap-1 text-green-400 text-xs font-bold"><Check className="w-3 h-3"/> Replied</div>
              ) : (
                <textarea 
                  className="w-full p-2 bg-[#040e1d] border border-sky-900 rounded-lg text-sm text-white"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
