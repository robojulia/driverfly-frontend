import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import axios from 'axios';

/**
 * Partner feedback survey handler.
 *
 * Primary, guaranteed path: emails the submission to the DriverFly team.
 * Best-effort secondary path: forwards the submission to the backend so it can
 * be attached to the matching internal company profile. The backend route may
 * not be deployed yet, so a failure there never fails the request — the email
 * is the source of truth. (Mirrors the inbound-request best-effort pattern.)
 */

const RECIPIENT_EMAIL = 'info@driverfly.co';
const BRAND_COLOR = '#006078';

export interface PartnerSurveyBody {
  name: string;
  company: string;
  email?: string;
  mostLiked?: string;
  leastLiked?: string;
  missing?: string;
  bugs?: string;
  otherComments?: string;
}

/** Escape user-supplied text before interpolating into the HTML email. */
function esc(value = ''): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = (req.body || {}) as PartnerSurveyBody;
  const { name, company } = body;

  if (!name || !company) {
    return res.status(400).json({ error: 'name and company are required' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
  }

  const fields: Array<[string, string | undefined]> = [
    ['Name', body.name],
    ['Company', body.company],
    ['Email', body.email],
    ['Features they like most', body.mostLiked],
    ['Features they like least', body.leastLiked],
    ['Anything missing', body.missing],
    ['Any bugs', body.bugs],
    ['Other comments', body.otherComments],
  ];

  const rows = fields
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 14px;font-weight:600;white-space:nowrap;vertical-align:top;border-bottom:1px solid #eef2f7">${k}</td><td style="padding:8px 14px;border-bottom:1px solid #eef2f7">${esc(
          v
        )}</td></tr>`
    )
    .join('');

  const html = `
    <div style="background:#f3f4f6;padding:24px 0;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:${BRAND_COLOR};padding:18px 24px">
          <span style="color:#ffffff;font-size:1.25rem;font-weight:700">New Partner Feedback Survey</span>
        </div>
        <div style="padding:24px">
          <table style="border-collapse:collapse;width:100%;background:#f8f9fa;border-radius:6px">
            ${rows}
          </table>
        </div>
      </div>
    </div>
  `;

  const transport = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  try {
    await transport.sendMail({
      from: 'noreply@alert.driverfly.co',
      to: RECIPIENT_EMAIL,
      replyTo: body.email || undefined,
      subject: `New Partner Feedback Survey — ${company}`,
      html,
    });
  } catch (error: any) {
    console.error('Failed to send partner survey email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  // Best-effort: attach the survey to the matching internal company profile.
  // Never fails the request if the backend route is unavailable.
  const apiBase = process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API;
  if (apiBase) {
    const base = apiBase.endsWith('/') ? apiBase : `${apiBase}/`;
    try {
      await axios.post(`${base}partner-feedback`, body, { timeout: 10000 });
    } catch (error: any) {
      console.warn(
        'Partner survey backend attach failed (email was still sent):',
        error?.response?.status || error?.message
      );
    }
  }

  return res.status(200).json({ success: true });
}
