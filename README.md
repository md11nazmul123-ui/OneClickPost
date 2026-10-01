# OneClickPost — Frontend (Next.js)

**One Upload. Every Platform.**

## আর্কিটেকচার
- **Frontend:** Next.js 15 + TypeScript + Tailwind (এই রিপো)
- **Backend:** Laravel API (`oneclickpost-backend`) — সব ডেটা, Auth, OAuth, Queue
- **Database:** PostgreSQL (Neon) — শুধু Laravel ব্যবহার করে
- Frontend কখনো সরাসরি ডাটাবেসে যায় না; সব কাজ Laravel API দিয়ে।
- লগইন Token ব্রাউজারের JavaScript-এ রাখা হবে না — Next.js সার্ভার HttpOnly কুকিতে রাখবে (BFF)।

## চালানো
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build যাচাই
```
