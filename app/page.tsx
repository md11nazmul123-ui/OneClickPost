'use client';

import dynamic from 'next/dynamic';

// পুরো অ্যাপ শুধু ব্রাউজারে লোড হবে (ssr: false) — localStorage/window সার্ভারে নেই।
const ClientApp = dynamic(() => import('../components/ClientApp'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#020713]" aria-busy="true" />,
});

export default function Home() {
  return <ClientApp />;
}
