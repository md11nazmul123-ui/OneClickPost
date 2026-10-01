'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AppLogo } from '../components/AppLogo';

const TEXT = {
  en: {
    title: 'Welcome back',
    subtitle: 'Log in to manage all your platforms from one place.',
    email: 'Email',
    password: 'Password',
    submit: 'Log in',
    loading: 'Logging in...',
    noAccount: "Don't have an account?",
    create: 'Create account',
    secure: 'Secure login • Your password is never shared',
  },
  bn: {
    title: 'আবার স্বাগতম',
    subtitle: 'এক জায়গা থেকে সব প্ল্যাটফর্ম পরিচালনা করতে লগইন করুন।',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    submit: 'লগইন',
    loading: 'লগইন হচ্ছে...',
    noAccount: 'অ্যাকাউন্ট নেই?',
    create: 'অ্যাকাউন্ট খুলুন',
    secure: 'নিরাপদ লগইন • আপনার পাসওয়ার্ড কখনো শেয়ার হয় না',
  },
};

export const LoginScreen: React.FC = () => {
  const { navigateTo, language } = useApp();
  const { login } = useAuth();
  const text = language === 'bn' ? TEXT.bn : TEXT.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const result = await login(email.trim(), password);

    if (!result.ok) {
      setError(result.message);
      setFieldErrors(result.errors ?? {});
      setPassword('');
    }
    // সফল হলে AuthGate নিজে থেকেই Dashboard-এ নিয়ে যাবে
    setSubmitting(false);
  };

  const inputClass =
    'w-full rounded-xl bg-[#041326] border border-sky-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020713]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-sky-800/70">
        <button
          type="button"
          onClick={() => navigateTo('welcome')}
          className="mb-4 p-2 rounded-xl border border-sky-800/70 text-slate-300 hover:text-white hover:bg-sky-900/40 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <AppLogo size="lg" />
          <h2 className="text-2xl font-extrabold text-white mt-4 mb-1">{text.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400">{text.subtitle}</p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl border border-rose-800/70 bg-rose-950/40 px-4 py-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.email}
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={191}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
            {fieldErrors.email?.[0] && <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.password}
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                maxLength={255}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password?.[0] && <p className="mt-1 text-[11px] text-rose-400">{fieldErrors.password[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting || !email || !password}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{submitting ? text.loading : text.submit}</span>
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          {text.noAccount}{' '}
          <button
            type="button"
            onClick={() => navigateTo('register')}
            className="font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            {text.create}
          </button>
        </p>

        <div className="mt-6 pt-4 border-t border-sky-900/50 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>{text.secure}</span>
        </div>
      </div>
    </div>
  );
};
