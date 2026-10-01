/** @type {import('next').NextConfig} */

// প্রতিটা পেজে নিরাপত্তা হেডার
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' }, // অন্য সাইট iframe-এ ঢোকাতে পারবে না (clickjacking রোধ)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // "X-Powered-By: Next.js" লুকানো

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
