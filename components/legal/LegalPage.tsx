import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppLogoMark } from '../AppLogo';
import { LEGAL } from '../../lib/legal';

/**
 * Privacy / Terms / Data Deletion পেজের সাধারণ নকশা।
 * লগইন ছাড়াই সবাই দেখতে পারে (Google, Meta, TikTok রিভিউয়ারদের জন্য দরকার)।
 */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <AppLogoMark className="w-9 h-9" />
            <span className="font-black text-lg text-slate-900">{LEGAL.appName}</span>
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-slate-600">
            <Link href="/privacy" className="hover:text-blue-700">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-700">Terms</Link>
            <Link href="/data-deletion" className="hover:text-blue-700">Data deletion</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">Effective date: {LEGAL.effectiveDate}</p>
        <article className="legal-content mt-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 space-y-5 text-[15px] leading-relaxed">
          {children}
        </article>
      </main>

      <footer className="max-w-3xl mx-auto px-4 pb-10 text-xs text-slate-500">
        © 2026 {LEGAL.appName} · Contact: <a className="text-blue-700" href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
      </footer>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
      {children}
    </a>
  );
}
