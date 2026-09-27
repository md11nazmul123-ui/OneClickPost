'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, ArrowLeft, Plus, Trash2, Calendar, Send } from 'lucide-react';

export const BulkUploadScreen: React.FC = () => {
  const { goBack } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleBulkUpload = async () => {
    setUploading(true);
    // Here you would implement the bulk upload logic to the backend
    console.log('Uploading', selectedFiles.length, 'files');
    setTimeout(() => {
      setUploading(false);
      alert('Bulk upload started!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goBack} className="p-2.5 rounded-xl bg-[#07182c] border border-sky-800 text-slate-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-white">Bulk Video Uploader</h1>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-sky-800/70 space-y-6">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-sky-800 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors"
        >
          <Upload className="w-12 h-12 text-cyan-400 mb-4" />
          <p className="text-white font-bold">Click to select 5-10 videos</p>
          <p className="text-slate-400 text-sm">MP4, MOV supported</p>
          <input type="file" ref={fileInputRef} multiple accept="video/*" className="hidden" onChange={handleFilesSelected} />
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Selected Files ({selectedFiles.length})</h2>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#040e1d] rounded-xl border border-sky-900">
                <span className="text-sm text-slate-300">{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button 
              onClick={handleBulkUpload}
              disabled={uploading}
              className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2"
            >
              {uploading ? 'Processing...' : <><Send className="w-4 h-4" /> Start Bulk Scheduling</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
