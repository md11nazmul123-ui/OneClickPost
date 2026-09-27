'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, HardDrive, Cloud, FileVideo } from 'lucide-react';

export const CloudImportScreen: React.FC = () => {
  const { goBack } = useApp();

  const services = [
    { id: 'gdrive', name: 'Google Drive', icon: Cloud },
    { id: 'dropbox', name: 'Dropbox', icon: HardDrive },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-white">Import from Cloud</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(service => (
          <button 
            key={service.id}
            className="flex flex-col items-center gap-4 p-8 bg-[#07182c] border border-sky-900 rounded-3xl hover:border-cyan-600 transition-all"
            onClick={() => alert(`${service.name} integration coming soon!`)}
          >
            <service.icon className="w-16 h-16 text-cyan-400" />
            <span className="text-white font-bold text-lg">{service.name}</span>
            <span className="text-slate-400 text-sm text-center">Connect your account to import videos directly.</span>
          </button>
        ))}
      </div>
    </div>
  );
};
