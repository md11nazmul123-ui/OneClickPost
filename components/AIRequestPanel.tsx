'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { StatusDistributionPieChart } from './StatusDistributionPieChart';

// TypeScript Type Definitions
export interface AIFeatureOption {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
}

export interface FormState {
  fullName: string;
  email: string;
  selectedFeatures: string[];
  usagePurpose: string;
  dailyUsageEstimate: 'low' | 'medium' | 'high';
}

export interface AIRequestHistoryItem {
  id: number;
  full_name: string;
  email: string;
  requested_features: string[] | string;
  usage_purpose: string;
  daily_usage_estimate: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected';
  assigned_daily_quota?: number;
  created_at: string;
}

export interface RedisQuotaData {
  remaining_tokens: number;
  reset_in_seconds: number;
  rate_limit_active: boolean;
  rate_limit_reset_in_seconds: number;
}

export function AIRequestPanel() {
  const { user } = useApp();

  // Tabs: 'form' | 'history'
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [userRole, setUserRole] = useState<string>(user?.role || 'creator');

  const [formData, setFormData] = useState<FormState>({
    fullName: user?.name || '',
    email: user?.email || '',
    selectedFeatures: ['ai_caption'],
    usagePurpose: 'social_media',
    dailyUsageEstimate: 'low',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // History & Redis Quota State
  const [historyItems, setHistoryItems] = useState<AIRequestHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [redisQuota, setRedisQuota] = useState<RedisQuotaData | null>(null);

  // Local Search & Filter State for Request History
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFeatureFilter, setSelectedFeatureFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Available AI features from Google AI Studio / Gemini Integration
  const aiFeatures: AIFeatureOption[] = [
    { id: 'ai_caption', name: '✨ AI Caption & Hashtags', description: 'Auto-generate captions & hashtags for social posts', isFree: true },
    { id: 'ai_image', name: '🎨 AI Image Generation', description: 'Create and edit thumbnails or post images', isFree: false },
    { id: 'ai_music', name: '🎵 AI Music Generation (Lyria)', description: 'Generate background music for videos', isFree: false },
    { id: 'ai_video', name: '🎥 AI Video Generation (Veo 3)', description: 'Turn text/photos into short video clips', isFree: false },
    { id: 'ai_chatbot', name: '🗣️ Voice & Gemini Chatbot', description: 'Automated assistant and voice interactions', isFree: true },
  ];

  // Fetch History and Redis Quota based on current user email
  const fetchUserHistory = useCallback(async (targetEmail: string) => {
    if (!targetEmail.trim()) return;
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await fetch(`/api/v1/ai-requests?email=${encodeURIComponent(targetEmail.trim())}`, {
        headers: { Accept: 'application/json' },
      });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setHistoryItems(resData.data || []);
        if (resData.quota) {
          setRedisQuota(resData.quota);
        }
      } else {
        setHistoryError(resData.message || 'ইতিহাস লোড করতে ব্যর্থ হয়েছে।');
      }
    } catch {
      setHistoryError('সার্ভার থেকে ইতিহাস আনতে ব্যর্থ হয়েছে। সংযোগ চেক করুন।');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Sync form data and user role with AppContext user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
      if (user.role) {
        setUserRole(user.role);
      }
    }
  }, [user]);

  // Fetch on mount or email change
  useEffect(() => {
    const targetEmail = formData.email || user?.email;
    if (targetEmail) {
      fetchUserHistory(targetEmail);
    }
  }, [fetchUserHistory, formData.email, user?.email]);

  const handleCheckboxChange = (featureId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedFeatures.includes(featureId);
      return {
        ...prev,
        selectedFeatures: exists
          ? prev.selectedFeatures.filter((id) => id !== featureId)
          : [...prev.selectedFeatures, featureId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Send request to Laravel Backend API
      const response = await fetch('/api/v1/ai-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          requested_features: formData.selectedFeatures,
          usage_purpose: formData.usagePurpose,
          daily_usage_estimate: formData.dailyUsageEstimate,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setMessage({
          type: 'success',
          text: `আপনার AI ফিচার রিকোয়েস্টটি সফলভাবে জমা হয়েছে! (Assigned Redis Quota: ${resData.data?.assigned_daily_quota || 10} tokens)`,
        });
        // Refresh history view and switch to history tab
        await fetchUserHistory(formData.email);
        setTimeout(() => setActiveTab('history'), 1200);
      } else {
        setMessage({ type: 'error', text: resData.message || 'সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
      }
    } catch {
      setMessage({ type: 'error', text: 'সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।' });
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (seconds: number) => {
    if (seconds <= 0) return 'Expired / Ready';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} ঘণ্টা ${mins} মিনিট` : `${mins} মিনিট ${seconds % 60} সেকেন্ড`;
  };

  // Filter past requests by date, search term, feature type, or status
  const filteredHistoryItems = useMemo(() => {
    return historyItems.filter((item) => {
      // 1. Status dropdown filter
      if (selectedStatusFilter !== 'all' && item.status !== selectedStatusFilter) {
        return false;
      }

      // 2. Feature type dropdown filter
      const features: string[] = Array.isArray(item.requested_features)
        ? item.requested_features
        : typeof item.requested_features === 'string'
        ? (() => {
            try {
              const parsed = JSON.parse(item.requested_features);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [item.requested_features];
            }
          })()
        : [];

      if (selectedFeatureFilter !== 'all' && !features.includes(selectedFeatureFilter)) {
        return false;
      }

      // 3. Search query (matches date, feature name, status, purpose, or request id)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const dateStr = new Date(item.created_at).toLocaleDateString().toLowerCase();
        const isoDate = new Date(item.created_at).toISOString().toLowerCase();
        const idStr = String(item.id);
        const statusStr = item.status.toLowerCase();
        const purposeStr = (item.usage_purpose || '').toLowerCase();
        const featuresStr = features.join(' ').toLowerCase();

        const matches =
          dateStr.includes(query) ||
          isoDate.includes(query) ||
          idStr.includes(query) ||
          statusStr.includes(query) ||
          purposeStr.includes(query) ||
          featuresStr.includes(query);

        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [historyItems, searchQuery, selectedFeatureFilter, selectedStatusFilter]);

  // Reset to first page whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFeatureFilter, selectedStatusFilter]);

  // Total pages and paginated slice of items
  const totalPages = Math.max(1, Math.ceil(filteredHistoryItems.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedHistoryItems = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return filteredHistoryItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistoryItems, validCurrentPage, itemsPerPage]);

  const handleExportCSV = () => {
    const itemsToExport = filteredHistoryItems.length > 0 ? filteredHistoryItems : historyItems;
    if (!itemsToExport || itemsToExport.length === 0) {
      alert('এক্সপোর্ট করার মতো কোনো রিকোয়েস্ট ইতিহাস নেই।');
      return;
    }

    // CSV Headers
    const headers = [
      'Request ID',
      'Full Name',
      'Email',
      'Requested Features',
      'Usage Purpose',
      'Daily Usage Tier',
      'Assigned Daily Quota (Tokens)',
      'Status',
      'Created At',
    ];

    // CSV Rows
    const rows = historyItems.map((item) => {
      const features = Array.isArray(item.requested_features)
        ? item.requested_features.join(', ')
        : typeof item.requested_features === 'string'
        ? (() => {
            try {
              const parsed = JSON.parse(item.requested_features);
              return Array.isArray(parsed) ? parsed.join(', ') : item.requested_features;
            } catch {
              return item.requested_features;
            }
          })()
        : '';

      const quota =
        item.assigned_daily_quota ||
        (item.daily_usage_estimate === 'high' ? 100 : item.daily_usage_estimate === 'medium' ? 50 : 10);

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      return [
        escapeCSV(item.id),
        escapeCSV(item.full_name),
        escapeCSV(item.email),
        escapeCSV(features),
        escapeCSV(item.usage_purpose),
        escapeCSV(item.daily_usage_estimate),
        escapeCSV(quota),
        escapeCSV(item.status),
        escapeCSV(new Date(item.created_at).toISOString()),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ai_feature_requests_${formData.email || 'export'}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Robust CSV Parser that handles commas inside quotes
  const parseCSVText = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) return [];

    const parseLine = (line: string) => {
      const result: string[] = [];
      let current = '';
      let insideQuote = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (insideQuote && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            insideQuote = !insideQuote;
          }
        } else if (char === ',' && !insideQuote) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headerCols = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    // Find index positions
    const nameIdx = headerCols.findIndex((h) => h.includes('name'));
    const emailIdx = headerCols.findIndex((h) => h.includes('email'));
    const featuresIdx = headerCols.findIndex((h) => h.includes('feature'));
    const purposeIdx = headerCols.findIndex((h) => h.includes('purpose'));
    const tierIdx = headerCols.findIndex((h) => h.includes('tier') || h.includes('usage'));
    const quotaIdx = headerCols.findIndex((h) => h.includes('quota') || h.includes('token'));
    const statusIdx = headerCols.findIndex((h) => h.includes('status'));
    const dateIdx = headerCols.findIndex((h) => h.includes('date') || h.includes('created'));

    const parsedItems: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseLine(lines[i]);
      if (row.length === 0 || !row.some((cell) => cell.length > 0)) continue;

      const emailVal = (emailIdx !== -1 ? row[emailIdx] : row[2]) || formData.email;
      const nameVal = (nameIdx !== -1 ? row[nameIdx] : row[1]) || formData.fullName || 'User';
      const featuresRaw = (featuresIdx !== -1 ? row[featuresIdx] : row[3]) || 'ai_caption';
      const purposeVal = (purposeIdx !== -1 ? row[purposeIdx] : row[4]) || 'social_media';
      const tierVal = (tierIdx !== -1 ? row[tierIdx] : row[5]) || 'low';
      const quotaVal = quotaIdx !== -1 ? parseInt(row[quotaIdx], 10) : undefined;
      const statusVal = (statusIdx !== -1 ? row[statusIdx] : row[7]) || 'pending';
      const dateVal = (dateIdx !== -1 ? row[dateIdx] : row[8]) || new Date().toISOString();

      if (!emailVal || !nameVal) continue;

      parsedItems.push({
        full_name: nameVal,
        email: emailVal,
        requested_features: featuresRaw,
        usage_purpose: purposeVal,
        daily_usage_estimate: ['low', 'medium', 'high'].includes(tierVal.toLowerCase())
          ? tierVal.toLowerCase()
          : 'low',
        status: ['pending', 'approved', 'rejected'].includes(statusVal.toLowerCase())
          ? statusVal.toLowerCase()
          : 'pending',
        assigned_daily_quota: isNaN(quotaVal as number) ? undefined : quotaVal,
        created_at: dateVal,
      });
    }

    return parsedItems;
  };

  // Import CSV File Handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const parsedItems = parseCSVText(text);

      if (parsedItems.length === 0) {
        setMessage({
          type: 'error',
          text: 'CSV ফাইলে কোনো বৈধ রিকোয়েস্ট রেকর্ড পাওয়া যায়নি। সঠিক ফরম্যাট যাচাই করুন।',
        });
        return;
      }

      // Send to Backend API
      const response = await fetch('/api/v1/ai-requests/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ items: parsedItems }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setMessage({
          type: 'success',
          text: `সফল! ${resData.count || parsedItems.length}টি রেকর্ড ডাটাবেজে রিস্টোর/ইমপোর্ট করা হয়েছে।`,
        });
        // Refresh the list to reflect newly imported items
        await fetchUserHistory(formData.email);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({
          type: 'error',
          text: resData.message || 'CSV ডেটা ইমপোর্ট করতে সমস্যা হয়েছে।',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'CSV ফাইল রিড বা আপলোড করতে ত্রুটি হয়েছে।',
      });
    } finally {
      setIsImporting(false);
      // Reset input value so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Admin Status Quick Toggle via PATCH API
  const handleToggleStatus = async (item: AIRequestHistoryItem) => {
    const isAdmin = userRole === 'admin' || userRole.toLowerCase().includes('admin');
    if (!isAdmin) {
      alert('শুধুমাত্র অ্যাডমিনরা স্ট্যাটাস পরিবর্তন করতে পারবেন।');
      return;
    }

    // Cycle: pending -> approved -> rejected -> pending
    const statusCycle: Record<'pending' | 'approved' | 'rejected', 'pending' | 'approved' | 'rejected'> = {
      pending: 'approved',
      approved: 'rejected',
      rejected: 'pending',
    };

    const nextStatus = statusCycle[item.status] || 'approved';
    setUpdatingStatusId(item.id);

    try {
      const response = await fetch(`/api/v1/ai-requests/${item.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        // Optimistically/Confirmed update state
        setHistoryItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
        );
        setMessage({
          type: 'success',
          text: `Request #${item.id} স্ট্যাটাস পরিবর্তন করে '${nextStatus.toUpperCase()}' করা হয়েছে।`,
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: 'error',
          text: resData.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।',
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Delete AI Request item
  const handleDeleteRequest = async (id: number) => {
    const confirmDelete = window.confirm(
      `আপনি কি নিশ্চিত যে Request #${id} মুছে ফেলতে চান?`
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/v1/ai-requests/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        // Update history state locally upon success
        setHistoryItems((prev) => prev.filter((item) => item.id !== id));
        setMessage({
          type: 'success',
          text: `Request #${id} সফলভাবে মুছে ফেলা হয়েছে।`,
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({
          type: 'error',
          text: resData.message || 'রিকোয়েস্ট মুছে ফেলতে ব্যর্থ হয়েছে।',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। আবার চেষ্টা করুন।',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (item: AIRequestHistoryItem) => {
    const status = item.status;
    const isAdmin = userRole === 'admin' || userRole.toLowerCase().includes('admin');
    const isUpdating = updatingStatusId === item.id;

    let badgeContent = null;
    switch (status) {
      case 'approved':
        badgeContent = (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Approved</span>
          </span>
        );
        break;
      case 'rejected':
        badgeContent = (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-950 border border-rose-600 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Rejected</span>
          </span>
        );
        break;
      case 'pending':
      default:
        badgeContent = (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950 border border-amber-600 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Pending</span>
          </span>
        );
        break;
    }

    if (!isAdmin) {
      return badgeContent;
    }

    // Admin Interactive Hover & Quick Toggle Button
    return (
      <button
        type="button"
        onClick={() => handleToggleStatus(item)}
        disabled={isUpdating}
        className="group/badge relative inline-flex items-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
        title="Admin: Click to cycle status (Pending -> Approved -> Rejected)"
      >
        {badgeContent}

        {/* Hover overlay hint badge for Admin */}
        <span className="absolute inset-0 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-[10px] font-bold flex items-center justify-center gap-1 opacity-0 group-hover/badge:opacity-100 transition-all shadow-md">
          {isUpdating ? (
            <span className="animate-spin text-xs">⟳</span>
          ) : (
            <>
              <span>🔄</span>
              <span>Toggle</span>
            </>
          )}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-6">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header Title */}
        <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
              <span className="text-2xl">🤖</span>
              <span>AI Feature Access & Quota Control</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Google AI Studio API কোটা, Redis রেট-লিমিটিং ও ব্যবহারকারীর রিকোয়েস্ট হিস্ট্রি।
            </p>
          </div>

          {/* User Email Pill */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-mono text-cyan-300 flex items-center gap-2 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[200px]">{formData.email || user?.email || 'user@oneclickpost.com'}</span>
          </div>
        </div>

        {/* Redis Real-Time Quota Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#071933] border border-cyan-500/30 shadow-lg">
          {/* Daily Token Quota */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>Redis Daily Quota</span>
              <span className="text-amber-400 font-mono">⚡ Active</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-cyan-400">
                {redisQuota ? redisQuota.remaining_tokens : 10}
              </span>
              <span className="text-xs text-slate-400">tokens / day</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Reset in: {redisQuota ? formatSeconds(redisQuota.reset_in_seconds) : '24h'}
            </p>
          </div>

          {/* Redis 24h Rate Limit */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>24h Submission Guard</span>
              <span className="font-mono text-cyan-400">Redis Key</span>
            </div>
            <div>
              {redisQuota?.rate_limit_active ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Rate Limited (cooldown)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Available to Request
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              {redisQuota?.rate_limit_active
                ? `Available in: ${formatSeconds(redisQuota.rate_limit_reset_in_seconds)}`
                : '1 request per 24 hours allowed'}
            </p>
          </div>

          {/* Requests Made */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span>History Total</span>
              <span className="text-indigo-400 font-mono">PostgreSQL</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-purple-400">{historyItems.length}</span>
              <span className="text-xs text-slate-400">requests recorded</span>
            </div>
            <button
              type="button"
              onClick={() => fetchUserHistory(formData.email)}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
            >
              🔄 Refresh Status from Redis
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ✏️ New Feature Request
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              fetchUserHistory(formData.email);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>📜 My Request History & Quota</span>
            {historyItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] text-white font-mono">
                {historyItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Global Notifications / Alert Banner */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border border-red-500 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 1: NEW REQUEST FORM */}
        {/* ==================================================================== */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">আপনার পুরো নাম</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="মাহমুদুল হাসান"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ইমেইল ঠিকানা</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                এই ইমেইলের অনুকূলে Redis Quota বরাদ্দ ও ভেরিফিকেশন করা হবে।
              </span>
            </div>

            {/* AI Features Checkbox List */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                আপনি কোন এআই ফিচারগুলো ব্যবহার করতে চান?
              </label>
              <div className="space-y-2.5">
                {aiFeatures.map((feature) => (
                  <label
                    key={feature.id}
                    className={`flex items-start p-3.5 border rounded-2xl cursor-pointer transition-all ${
                      formData.selectedFeatures.includes(feature.id)
                        ? 'border-blue-500 bg-blue-950/30'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature.id)}
                      onChange={() => handleCheckboxChange(feature.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        {feature.name}
                        {feature.isFree ? (
                          <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700 font-mono">
                            Free Tier
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-900/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700 font-mono">
                            Token Cost
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">{feature.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Usage Purpose Select */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ব্যবহারের প্রধান উদ্দেশ্য</label>
              <select
                value={formData.usagePurpose}
                onChange={(e) => setFormData({ ...formData, usagePurpose: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="social_media">সোশ্যাল মিডিয়া কন্টেন্ট প্রকাশ ও শিডিউলিং</option>
                <option value="marketing">ডিজিটাল মার্কেটিং ও অ্যাড ক্যাম্পেইন</option>
                <option value="personal">ব্যক্তিগত বা ক্রিয়েটর প্রোফাইল ম্যানেজমেন্ট</option>
                <option value="agency">এজেন্সি বা ক্লায়েন্ট সার্ভিস</option>
              </select>
            </div>

            {/* Daily Usage Estimate */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                দৈনিক আনুমানিক ব্যবহার (Quota Rate Limit)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'low', label: 'হালকা (১-১০টি/দিন)', tokens: '10 Tokens' },
                  { id: 'medium', label: 'মাঝারি (১০-৫০টি/দিন)', tokens: '50 Tokens' },
                  { id: 'high', label: 'ভারী (৫০+ টি/দিন)', tokens: '100 Tokens' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFormData({ ...formData, dailyUsageEstimate: item.id as 'low' | 'medium' | 'high' })}
                    className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.dailyUsageEstimate === item.id
                        ? 'border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/25'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] opacity-80 font-mono mt-0.5 block">{item.tokens}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || formData.selectedFeatures.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/30 cursor-pointer text-sm"
            >
              {loading ? 'প্রসেসিং হচ্ছে...' : 'রিকোয়েস্ট সাবমিট করুন (Redis Cooldown Check)'}
            </button>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: USER REQUEST HISTORY & APPROVAL STATUS VIEW */}
        {/* ==================================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white">Your AI Feature Request History</h3>
                <p className="text-xs text-slate-400">
                  Real-time status synced with PostgreSQL & Redis Token Quota for{' '}
                  <span className="text-cyan-300 font-mono">{formData.email}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Hidden File Input for CSV Import */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-file-input"
                />

                {/* Import from CSV Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700/80 hover:bg-blue-900/60 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  title="Import and restore past request records from a CSV file"
                >
                  <span>{isImporting ? '⏳ Importing...' : '📤 Import CSV'}</span>
                </button>

                {/* Export to CSV Button */}
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={historyItems.length === 0}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-700/80 hover:bg-emerald-900/60 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  title="Download request logs as CSV"
                >
                  <span>📥 Export CSV</span>
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={() => fetchUserHistory(formData.email)}
                  disabled={historyLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{historyLoading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {historyError && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-xs text-red-300">
                {historyError}
              </div>
            )}

            {/* D3-Based Status Distribution Pie Chart */}
            {!historyLoading && historyItems.length > 0 && (
              <StatusDistributionPieChart
                items={historyItems}
                selectedStatus={selectedStatusFilter}
                onSelectStatus={(newStatus) => setSelectedStatusFilter(newStatus)}
              />
            )}

            {/* Local Search Input & Feature Filter Controls */}
            {historyItems.length > 0 && (
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search by date or keyword */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by date (YYYY-MM-DD), feature, status, or request ID..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Feature Filter Dropdown */}
                <div className="flex items-center gap-2 sm:w-auto">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Feature:
                  </label>
                  <select
                    value={selectedFeatureFilter}
                    onChange={(e) => setSelectedFeatureFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer w-full sm:w-auto"
                  >
                    <option value="all">All Features ({historyItems.length})</option>
                    <option value="ai_caption">✨ AI Caption & Hashtags</option>
                    <option value="ai_image">🎨 AI Image</option>
                    <option value="ai_music">🎵 AI Music (Lyria)</option>
                    <option value="ai_video">🎥 AI Video (Veo 3)</option>
                    <option value="ai_chatbot">🗣️ Voice & Chatbot</option>
                  </select>
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2 sm:w-auto">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                    Status:
                  </label>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                    className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer w-full sm:w-auto"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">⏳ Pending Review</option>
                    <option value="approved">✅ Approved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                {/* Reset Filters if active */}
                {(searchQuery || selectedFeatureFilter !== 'all' || selectedStatusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFeatureFilter('all');
                      setSelectedStatusFilter('all');
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer shrink-0 text-center"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}

            {/* Filter Result Counter */}
            {historyItems.length > 0 && (searchQuery || selectedFeatureFilter !== 'all' || selectedStatusFilter !== 'all') && (
              <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                <span>
                  Showing <strong className="text-cyan-400 font-mono">{filteredHistoryItems.length}</strong> of{' '}
                  <strong className="text-slate-200 font-mono">{historyItems.length}</strong> requests
                </span>
                {filteredHistoryItems.length === 0 && (
                  <span className="text-amber-400 font-medium">কোনো ফলাফল পাওয়া যায়নি</span>
                )}
              </div>
            )}

            {historyLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
                লোডিং হিস্ট্রি ও রেডিজ কোটা তথ্য...
              </div>
            ) : historyItems.length === 0 ? (
              <div className="p-10 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-xl">
                  📭
                </div>
                <h4 className="text-sm font-bold text-slate-300">কোনো রিকোয়েস্ট পাওয়া যায়নি</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  আপনি এই ইমেইল (<span className="text-cyan-300">{formData.email}</span>) দিয়ে এখনও কোনো AI ফিচার রিকোয়েস্ট জমা দেননি।
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('form')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  এখনই রিকোয়েস্ট করুন
                </button>
              </div>
            ) : filteredHistoryItems.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-300">
                  ফিল্টারের সাথে কোনো রিকোয়েস্ট মেলেনি
                </p>
                <p className="text-xs text-slate-400">
                  অনুসন্ধানের তারিখ বা ফিচার পরিবর্তন করে আবার চেষ্টা করুন।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFeatureFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-cyan-300 font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List of items on current page */}
                <div className="space-y-3">
                  {paginatedHistoryItems.map((item) => {
                    const features = Array.isArray(item.requested_features)
                      ? item.requested_features
                      : typeof item.requested_features === 'string'
                      ? JSON.parse(item.requested_features || '[]')
                      : [];

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        {/* Top status bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-mono text-cyan-400 font-bold">
                              Request #{item.id}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400">
                              {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item)}

                            {/* Delete Request Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteRequest(item.id)}
                              disabled={deletingId === item.id}
                              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                              title="Delete this request log"
                            >
                              <span>🗑️</span>
                              <span>{deletingId === item.id ? 'মুছছে...' : 'Delete'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Request details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-500 block">Requested Features</span>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {features.map((f: string) => (
                                <span
                                  key={f}
                                  className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800 text-[11px] text-blue-300 font-mono"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">Usage Purpose</span>
                            <span className="text-slate-200 capitalize font-medium mt-1 block">
                              {item.usage_purpose?.replace('_', ' ')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">Assigned Redis Quota</span>
                            <span className="text-cyan-400 font-mono font-bold mt-1 block">
                              {item.assigned_daily_quota || (item.daily_usage_estimate === 'high' ? 100 : item.daily_usage_estimate === 'medium' ? 50 : 10)} tokens/day
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls Bar */}
                {filteredHistoryItems.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    {/* Items per page selector & status */}
                    <div className="flex items-center gap-3 text-slate-400">
                      <span>
                        Showing{' '}
                        <strong className="text-slate-200 font-mono">
                          {Math.min((validCurrentPage - 1) * itemsPerPage + 1, filteredHistoryItems.length)}
                        </strong>
                        -
                        <strong className="text-slate-200 font-mono">
                          {Math.min(validCurrentPage * itemsPerPage, filteredHistoryItems.length)}
                        </strong>{' '}
                        of <strong className="text-cyan-400 font-mono">{filteredHistoryItems.length}</strong>
                      </span>

                      <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
                        <span className="text-[11px] text-slate-500">Per page:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          <option value={3}>3</option>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </div>
                    </div>

                    {/* Page navigation buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Previous Page Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={validCurrentPage <= 1}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-medium text-xs flex items-center gap-1"
                      >
                        <span>◀</span>
                        <span className="hidden xs:inline">Prev</span>
                      </button>

                      {/* Page number indicators */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
                          // Display smart range if totalPages is large
                          if (
                            totalPages > 6 &&
                            Math.abs(pageNum - validCurrentPage) > 2 &&
                            pageNum !== 1 &&
                            pageNum !== totalPages
                          ) {
                            if (Math.abs(pageNum - validCurrentPage) === 3) {
                              return (
                                <span key={pageNum} className="text-slate-600 px-1">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          const isActive = pageNum === validCurrentPage;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-7 h-7 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 border border-blue-500'
                                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Page Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={validCurrentPage >= totalPages}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer font-medium text-xs flex items-center gap-1"
                      >
                        <span className="hidden xs:inline">Next</span>
                        <span>▶</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
