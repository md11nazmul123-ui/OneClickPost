/**
 * AI দিয়ে ক্যাপশন / হ্যাশট্যাগ / টাইটেল — Next.js BFF (/api/backend/*) দিয়ে Laravel-এ।
 * AI-এর key কখনো ব্রাউজারে আসে না; সব কাজ সার্ভারে হয়।
 */

export type AiFeature = 'caption' | 'hashtags' | 'title';
export type AiTone = 'viral' | 'engaging' | 'professional' | 'minimal';
export type AiLanguage = 'en' | 'bn';

export interface AiGenerateInput {
  title?: string;
  caption?: string;
  tone: AiTone;
  language: AiLanguage;
}

export interface AiGenerateResult {
  caption?: string;
  title?: string;
  hashtags?: string[];
  provider: string;
  remaining_today: number;
}

export class AiApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

interface ApiBody<T> {
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export const AI_TONES: AiTone[] = ['viral', 'engaging', 'professional', 'minimal'];

export function toAiTone(value: string): AiTone {
  return (AI_TONES as string[]).includes(value) ? (value as AiTone) : 'viral';
}

export async function generateWithAi(feature: AiFeature, input: AiGenerateInput): Promise<AiGenerateResult> {
  const body = {
    feature,
    tone: input.tone,
    language: input.language,
    // ফাঁকা লেখা পাঠানো হয় না
    ...(input.title?.trim() ? { title: input.title.trim().slice(0, 100) } : {}),
    ...(input.caption?.trim() ? { caption: input.caption.trim().slice(0, 2200) } : {}),
  };

  let response: Response;
  try {
    response = await fetch('/api/backend/ai/generate', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AiApiError('Network error. Please check your connection.', 0);
  }

  const json = (await response.json().catch(() => ({}))) as ApiBody<AiGenerateResult>;
  if (!response.ok || !json.data) {
    const firstFieldError = json.errors ? Object.values(json.errors)[0]?.[0] : undefined;
    const fallback =
      response.status === 429
        ? 'Too many AI requests. Please wait a moment and try again.'
        : 'AI could not write this right now. Please try again.';
    throw new AiApiError(firstFieldError ?? json.message ?? fallback, response.status);
  }
  return json.data;
}
