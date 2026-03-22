import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';

/**
 * GET /api/indeed/token?companyId=X
 *
 * Authenticated server-side route that generates a stable, signed feed token
 * for a company. The token is HMAC-SHA256(companyId, INDEED_FEED_SECRET) so it
 * never expires and is unique per company.
 *
 * The feed endpoint (/api/indeed/feed) validates this token before serving XML.
 *
 * Required env var: INDEED_FEED_SECRET
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyId } = req.query;

  if (!companyId) {
    return res.status(400).json({ error: 'companyId is required' });
  }

  const secret = process.env.INDEED_FEED_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Feed secret not configured' });
  }

  const token = crypto
    .createHmac('sha256', secret)
    .update(String(companyId))
    .digest('hex');

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

  const feedUrl = `${baseUrl}/api/indeed/feed?companyId=${companyId}&token=${token}`;

  return res.status(200).json({ token, feedUrl });
}
