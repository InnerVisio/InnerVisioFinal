// Shared helpers for the Netlify functions (bundled into each function by esbuild).
// Lives outside netlify/functions so Netlify doesn't deploy it as a function itself.
import type { HandlerEvent, HandlerResponse } from '@netlify/functions';

const ALLOWED_ORIGINS = [
  /^https:\/\/(www\.)?innervisio\.cz$/,
  /^https:\/\/([a-z0-9-]+--)?innervisio\.netlify\.app$/, // production + deploy previews
  /^http:\/\/localhost(:\d+)?$/,
];

const corsHeaders = (event: HandlerEvent): Record<string, string> => {
  const origin = event.headers.origin || event.headers.Origin || '';
  if (!ALLOWED_ORIGINS.some((re) => re.test(origin))) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
};

export const json = (event: HandlerEvent, statusCode: number, body: unknown): HandlerResponse => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders(event) },
  body: JSON.stringify(body),
});

// Handles preflight / wrong methods; returns a response to send, or null to continue
export const guardPost = (event: HandlerEvent): HandlerResponse | null => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders(event), body: '' };
  if (event.httpMethod !== 'POST') return json(event, 405, { error: 'Method not allowed' });
  return null;
};

export const parseBody = (event: HandlerEvent): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(event.body || '{}');
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

// Trimmed string field, or null when missing, empty or longer than maxLength
export const field = (body: Record<string, unknown>, key: string, maxLength: number): string | null => {
  const value = body[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= maxLength ? trimmed : null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (value: string | null): value is string => !!value && value.length <= 254 && EMAIL_RE.test(value);

// Hidden "website" input in the contact form: real visitors leave it empty
export const isBot = (body: Record<string, unknown>) => typeof body.website === 'string' && body.website.trim() !== '';

// Sends a plain-text notification to the studio inbox via the Resend REST API
export const sendNotification = async (email: { subject: string; text: string; replyTo?: string }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('Missing RESEND_API_KEY environment variable');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'InnerVisio Web <onboarding@resend.dev>',
      to: ['innervisio@gmail.com'],
      subject: email.subject,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`Resend API ${response.status}: ${details}`);
  }
};
