/**
 * Facebook Lead Ads webhook endpoint.
 *
 * GET  – Responds to Facebook's one-time subscription verification challenge.
 * POST – Receives real-time leadgen events, verifies the HMAC-SHA256 signature,
 *        and runs the full ingestion pipeline: Graph API fetch → field mapping →
 *        applicant upsert → job linking.
 *
 * Required env vars:
 *   FACEBOOK_WEBHOOK_VERIFY_TOKEN  Set in the Facebook App Dashboard under
 *                                  Webhooks → Edit Subscription.
 *   FACEBOOK_APP_SECRET            App Secret from the Facebook App Dashboard.
 *                                  Used to verify webhook payloads.
 *   BASE_URL_API                   Internal URL of the DriverFly backend API.
 *   BACKEND_SERVICE_TOKEN          Service-to-service bearer token for backend calls.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getFacebookLeadIngestionService } from '../../../utils/facebook-lead-ingestion';
import { FacebookWebhookPayload } from '../../../models/integrations/providers/facebook/facebook-lead-types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleVerification(req, res);
  }

  if (req.method === 'POST') {
    // Collect raw body for signature verification before JSON parsing
    const rawBody = await readRawBody(req);
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody.toString('utf-8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    req.body = parsedBody;
    (req as any).rawBody = rawBody;
    return handleLeadEvent(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/** Reads the full request body into a Buffer. */
function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// ─── Webhook verification ──────────────────────────────────────────────────────

function handleVerification(req: NextApiRequest, res: NextApiResponse) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN;

  if (!verifyToken) {
    console.error('[FB Webhook] FACEBOOK_WEBHOOK_VERIFY_TOKEN is not configured');
    return res.status(500).json({ error: 'Webhook verify token not configured' });
  }

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[FB Webhook] Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  console.warn('[FB Webhook] Verification failed – token mismatch');
  return res.status(403).json({ error: 'Verification failed' });
}

// ─── Lead event handler ────────────────────────────────────────────────────────

async function handleLeadEvent(req: NextApiRequest, res: NextApiResponse) {
  // Facebook requires a 200 within 20 s — respond immediately and process async.
  // We intentionally await here (within that window) but catch all errors so the
  // 200 is always returned even if processing fails internally.

  const signature = (req.headers['x-hub-signature-256'] as string) ?? '';
  const service = getFacebookLeadIngestionService();

  // Verify the payload signature using the raw request body
  const rawBody = (req as any).rawBody as Buffer | undefined;
  if (rawBody) {
    const valid = service.verifyWebhookSignature(rawBody, signature);
    if (!valid) {
      console.warn('[FB Webhook] Invalid payload signature – request rejected');
      return res.status(403).json({ error: 'Invalid signature' });
    }
  } else {
    // rawBody unavailable (body was pre-parsed) — rely on verify token check only
    console.warn('[FB Webhook] rawBody not available; skipping signature verification');
  }

  const payload = req.body as FacebookWebhookPayload;

  if (payload?.object !== 'page') {
    return res.status(200).json({ status: 'ignored', reason: 'not a page event' });
  }

  // Count how many leads we expect to process for logging
  const leadCount = (payload.entry ?? []).reduce(
    (n, e) => n + (e.changes ?? []).filter((c) => c.field === 'leadgen').length,
    0,
  );

  console.log(`[FB Webhook] Received payload with ${leadCount} leadgen event(s)`);

  try {
    const result = await service.processWebhookPayload(payload);

    console.log(
      `[FB Webhook] Pipeline complete — processed: ${result.processed}, ` +
        `skipped: ${result.skipped}, errors: ${result.errors}`,
    );

    return res.status(200).json({ status: 'ok', ...result });
  } catch (err: any) {
    // Log but still respond 200 so Facebook does not retry aggressively.
    // Individual lead errors are already caught inside processWebhookPayload.
    console.error('[FB Webhook] Unexpected error in processWebhookPayload:', err?.message);
    return res.status(200).json({ status: 'error', message: err?.message });
  }
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const config = {
  api: {
    // Disable Next.js automatic body parsing so we can capture the raw body
    // buffer for HMAC-SHA256 signature verification, then parse it ourselves.
    bodyParser: false,
  },
};
