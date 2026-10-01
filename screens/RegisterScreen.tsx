'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AppLogo } from '../components/AppLogo';

const TEXT = {
  en: {
    title: 'Create your account',
    subtitle: 'One upload. Every platform. Start free.',
    name: 'Full name',
    email: 'Email',
    password: 'Password',
    confirm: 'Confirm password',
    hint: 'At least 8 characters with uppercase, lowercase and a number.',
    mismatch: 'Passwords do not match.',
    submit: 'Create account',
    loading: 'Creating account...',
    haveAccount: 'Already have an account?',
    login: 'Log in',
    secure: 'Your data is encrypted and never sold',
  },
  bn: {
    title: 'নতুন অ্যাকাউন্ট খুলুন',
    subtitle: 'একবার আপলোড। সব প্ল্যাটফর্মে। ফ্রিতে শুরু করুন।',
    name: 'পুরো নাম',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    confirm: 'পাসওয়ার্ড আবার লিখুন',
    hint: 'কমপক্ষে ৮ অক্ষর — বড় হাতের, ছোট হাতের অক্ষর ও একটি সংখ্যা থাকতে হবে।',
    mismatch: 'দুই পাসওয়ার্ড মিলছে না।',
    submit: 'অ্যাকাউন্ট খুলুন',
    loading: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
    haveAccount: 'আগে থেকেই অ্যাকাউন্ট আছে?',
    login: 'লগইন করুন',
    secure: 'আপনার তথ্য এনক্রিপ্টেড, কখনো বিক্রি হয় না',
  },
};

export const RegisterScreen: React.FC = () => {
  const { navigateTo, language } = useApp();
  const { register } = useAuth();
  const text = language === 'bn' ? TEXT.bn : TEXT.en;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || passwordsMismatch) return;

    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const result = await register(name.trim(), email.trim(), password, confirm);

    if (!result.ok) {
      setError(result.message);
      setFieldErrors(result.errors ?? {});
    }
    // সফল হলে AuthGate নিজে থেকেই Dashboard-এ নিয়ে যাবে
    setSubmitting(false);
  };

  const inputClass =
    'w-full rounded-xl bg-[#041326] border border-sky-800/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition';

  const fieldError = (key: string) =>
    fieldErrors[key]?.[0] ? <p className="mt-1 text-[11px] text-rose-400">{fieldErrors[key][0]}</p> : null;

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
            <label htmlFor="reg-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.name}
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            {fieldError('name')}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.email}
            </label>
            <input
              id="reg-email"
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
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.password}
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
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
            <p className="mt-1 text-[11px] text-slate-500">{text.hint}</p>
            {fieldError('password')}
          </div>

          <div>
            <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-300 mb-1.5">
              {text.confirm}
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              maxLength={72}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
            {passwordsMismatch && <p className="mt-1 text-[11px] text-rose-400">{text.mismatch}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting || !name || !email || !password || !confirm || passwordsMismatch}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            <span>{submitting ? text.loading : text.submit}</span>
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          {text.haveAccount}{' '}
          <button
            type="button"
            onClick={() => navigateTo('login')}
            className="font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
          >
            {text.login}
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
