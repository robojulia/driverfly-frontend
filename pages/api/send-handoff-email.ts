import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface HandoffEmailBody {
  assigneeEmail: string;
  assigneeName?: string;
  driverName?: string;
  driverPhone?: string;
  driverEmail?: string;
  campaignName?: string;
  notes?: string;
  /** AI call summary text, if available */
  summary?: string;
  outcome?: string;
  /** Absolute or relative URL to the handoffs inbox */
  inboxUrl?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    assigneeEmail,
    assigneeName,
    driverName,
    driverPhone,
    driverEmail,
    campaignName,
    notes,
    summary,
    outcome,
    inboxUrl,
  } = req.body as HandoffEmailBody;

  if (!assigneeEmail) {
    return res.status(400).json({ error: 'assigneeEmail is required' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
  }

  const subject = `New driver handoff${driverName ? `: ${driverName}` : ''}`;

  const fields: Record<string, string | undefined> = {
    Driver: driverName,
    Phone: driverPhone,
    Email: driverEmail,
    Campaign: campaignName,
    'AI Outcome': outcome,
    Notes: notes,
  };

  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">${k}</td><td style="padding:6px 12px">${v}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="background:#006078;color:#fff;padding:16px 24px;margin:0">${subject}</h2>
      <div style="padding:24px">
        <p style="margin-top:0">Hi ${assigneeName || 'there'}, a driver from an AI campaign has been handed off to you for follow-up.</p>
        <table style="border-collapse:collapse;width:100%;background:#f8f9fa;border-radius:6px">
          ${rows}
        </table>
        ${
          summary
            ? `<h3 style="margin-top:24px">AI Call Summary</h3><p style="background:#f8f9fa;border-radius:6px;padding:12px">${summary}</p>`
            : ''
        }
        ${
          inboxUrl
            ? `<p style="margin-top:24px"><a href="${inboxUrl}" style="background:#006078;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block">Open Handoffs Inbox</a></p>`
            : ''
        }
      </div>
    </div>
  `;

  // SendGrid SMTP relay — only the API key needs to be configured
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
      to: assigneeEmail,
      subject,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Failed to send handoff email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
