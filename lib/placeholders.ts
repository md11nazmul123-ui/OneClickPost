/**
 * ছবি না থাকলে খালি src="" না দিয়ে এই ছোট ছবিগুলো দেখানো হয়
 * (খালি src দিলে ব্রাউজার পুরো পেজ আবার ডাউনলোড করতে পারে)।
 */

/** ভিডিওর থাম্বনেইল না থাকলে — ধূসর বাক্সে ▶ */
export const THUMB_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#cbd5e1"/><path d="M70 32v26l22-13z" fill="#ffffff"/></svg>'
  );

/** প্রোফাইল ছবি না থাকলে — ধূসর মানুষের আকৃতি */
export const AVATAR_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e2e8f0"/><circle cx="32" cy="25" r="11" fill="#94a3b8"/><path d="M12 56c3-11 11-17 20-17s17 6 20 17" fill="#94a3b8"/></svg>'
  );
