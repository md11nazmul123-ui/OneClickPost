# OneClickPost — Next.js কনভার্সন প্ল্যান

## বেছে নেওয়া স্ট্যাক ও কেন

- **Frontend + Backend:** Next.js 15 (App Router) + TypeScript + Tailwind v4 — একটাই কোডবেজ, একটাই Vercel ডিপ্লয়মেন্ট (আপনার moder-bazar-2 প্রোজেক্টের মতোই সহজ)।
- **Database:** PostgreSQL, কিন্তু **Neon** (সার্ভারলেস, ফ্রি টিয়ার আছে, নিজে সার্ভার চালাতে হয় না) — Vercel-এর সাথে নিখুঁতভাবে কাজ করে।
- **ORM:** Prisma — টাইপ-সেফ, মাইগ্রেশন সহজ।
- **Queue/শিডিউলিং:** Laravel+Redis+Worker-এর বদলে **Upstash QStash + Upstash Redis** — এগুলো HTTP-বেসড, সার্ভারলেস, কোনো worker daemon 24/7 চালিয়ে রাখতে হয় না (Vercel সার্ভারলেস হওয়ায় এমনিতেও persistent worker চালানো সম্ভব না)।
- **ফাইল/ভিডিও স্টোরেজ:** Vercel Blob।
- **AI:** Google Gemini API (আগে থেকেই যা ব্যবহার হচ্ছিল)।

**কেন Laravel+Redis+Docker বাদ দেওয়া হলো:** ওটার জন্য একটা আলাদা, সবসময়-চালু থাকা সার্ভার (PHP + Redis + queue worker) দরকার, যেটা Vercel-এ হয় না — আলাদা হোস্টিং (VPS) লাগত, যেটা এখন আপনার জন্য অপ্রয়োজনীয় জটিলতা।

## এই ফাইলে যা যা করা হয়েছে (Phase 1 — Foundation)

- [x] প্রজেক্ট স্ক্যাফোল্ড: `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`
- [x] `types/`, `data/`, `utils/` — অপরিবর্তিত পোর্ট করা হয়েছে
- [x] `context/AppContext.tsx` — পোর্ট করা হয়েছে (`'use client'` যোগ করে)
- [x] সব শেয়ার্ড কম্পোনেন্ট (`Header`, `BottomNav`, `AppLogo`, `PlatformIcon`, `OAuthModal`, `AddChannelModal`, `PreviewPostModal`, `SearchModal`, `VideoTrimmerModal`, `DailyBroadcastGoalsTracker`)
- [x] **সবগুলো ২৭টা স্ক্রিন** পোর্ট করা হয়েছে `screens/` এ
- [x] `app/page.tsx` — আগের `App.tsx`-এর `MainRouter` লজিক, একই state-driven স্ক্রিন-সুইচিং প্যাটার্ন বজায় রেখে
- [x] `app/layout.tsx`, `app/globals.css` (Tailwind v4 সিনট্যাক্স অপরিবর্তিত)
- [x] Prisma স্কিমা (`prisma/schema.prisma`) — Laravel মাইগ্রেশনের একই ডেটা মডেল অনুসরণ করে (User, ConnectedAccount, Post, PostPlatformDelivery)
- [x] `lib/prisma.ts`, `lib/api-client.ts`
- [x] `app/api/health/route.ts` — একটা প্রাথমিক API রুট উদাহরণ
- [x] `AIRequestPanel` (আগের ডেমো Next.js পেজ থেকে) সঠিকভাবে `AIRequestScreen`-এ ওয়্যার করা হয়েছে

## এখনো বাকি (Phase 2 এবং পরে)

এগুলো আসল ব্যাকএন্ড ফাংশনালিটি, আলাদা করে ধাপে ধাপে করতে হবে:

1. **Prisma migrate চালানো** — Neon ডাটাবেজ কানেক্ট করে `npx prisma migrate dev`
2. **Auth** — ব্যবহারকারী লগইন/সাইনআপ (NextAuth.js দিয়ে)
3. **OAuth ইন্টিগ্রেশন** — YouTube/Facebook/Instagram/TikTok/X এর জন্য আলাদা আলাদা `app/api/oauth/[platform]/route.ts`
4. **পোস্ট তৈরি ও আপলোড API** — ভিডিও Vercel Blob-এ আপলোড, `app/api/posts/route.ts`
5. **পাবলিশ Queue** — QStash দিয়ে প্রতিটা প্ল্যাটফর্মে পাবলিশ জব সাবমিট করা, রেট-লিমিট হ্যান্ডলিং
6. **AI ক্যাপশন জেনারেশন API** — `app/api/ai/caption/route.ts` (Gemini কল করে)
7. **প্রতিটা স্ক্রিনের ভেতরের mock ডেটা (context এর initialData) বাস্তব API কল দিয়ে replace করা** — এটাই সবচেয়ে বড় কাজ, স্ক্রিন-বাই-স্ক্রিন করতে হবে

**পরামর্শ:** পুরো অ্যাপটা এখনই mock ডেটা দিয়েই UI/UX হিসেবে দেখা ও টেস্ট করা যাবে (কোনো ব্যাকএন্ড ছাড়াই, যেমন আগে Vite দিয়ে চলত)। এরপর একটা একটা করে ফিচার (যেমন প্রথমে "Accounts connect", তারপর "Create Post") বাস্তব API-তে যুক্ত করা যাবে।
