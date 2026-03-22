import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Facebook Lead Ads webhook handler.
 *
 * Two responsibilities:
 *  GET  – Responds to Facebook's subscription verification challenge.
 *  POST – Receives real-time leadgen events and forwards them to the
 *         DriverFly backend, which fetches the full lead from the Graph API
 *         and upserts the applicant record.
 *
 * Required env vars:
 *  FACEBOOK_WEBHOOK_VERIFY_TOKEN  – Secret token set when subscribing the
 *                                   webhook in the Facebook App Dashboard.
 *  BASE_URL_API                   – Internal URL of the DriverFly backend API.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleVerification(req, res);
  }

  if (req.method === 'POST') {
    return handleLeadEvent(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// ─── Verification ─────────────────────────────────────────────────────────────

function handleVerification(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error('[FB Webhook] FACEBOOK_WEBHOOK_VERIFY_TOKEN is not set');
    return res.status(500).json({ error: 'Webhook verify token not configured' });
  }

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[FB Webhook] Webhook verified successfully');
    // Facebook expects the raw challenge string back with a 200 status
    return res.status(200).send(challenge);
  }

  console.warn('[FB Webhook] Webhook verification failed – token mismatch');
  return res.status(403).json({ error: 'Verification failed' });
}

// ─── Lead Event ───────────────────────────────────────────────────────────────

async function handleLeadEvent(req: NextApiRequest, res: NextApiResponse) {
  const payload = req.body;

  // Facebook only sends leadgen events from pages
  if (payload?.object !== 'page') {
    return res.status(200).json({ status: 'ignored', reason: 'not a page event' });
  }

  const baseUrl =
    process.env.BASE_URL_API ||
    process.env.NEXT_PUBLIC_BASE_URL_API ||
    'http://localhost:4000/api';

  try {
    // Forward to the DriverFly backend asynchronously; Facebook expects a fast 200.
    // The backend handles Graph API calls, field mapping, and applicant upsert.
    await axios.post(
      `${baseUrl.replace(/\/$/, '')}/fb-leads/webhook`,
      payload,
      { timeout: 10_000 },
    );
  } catch (err: any) {
    // Log but still respond 200 so Facebook doesn't retry aggressively.
    // The backend should implement its own retry / dead-letter queue.
    console.error('[FB Webhook] Error forwarding to backend:', err?.message);
  }

  // Facebook requires a 200 response within 20 seconds
  return res.status(200).json({ status: 'ok' });
}

// Disable automatic body parsing so we receive the raw body if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
