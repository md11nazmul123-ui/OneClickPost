import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OneClickPost',
  description: 'One Upload. Every Platform. — YouTube, Facebook, Instagram, TikTok ও X-এ একসাথে পোস্ট করুন।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
