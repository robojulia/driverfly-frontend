import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const RECIPIENT_EMAIL = 'development@driverfly.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, fields, companyInfo } = req.body as {
    type: 'campaign' | 'inbound';
    fields: Record<string, string>;
    companyInfo?: Record<string, string>;
  };

  if (!type || !fields) {
    return res.status(400).json({ error: 'type and fields are required' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
  }

  const subject =
    type === 'campaign'
      ? 'New AI Campaign Request'
      : 'New Inbound AI Request';

  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">${k}</td><td style="padding:6px 12px">${v}</td></tr>`)
    .join('');

  const companyRows = companyInfo
    ? Object.entries(companyInfo)
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap">${k}</td><td style="padding:6px 12px">${v}</td></tr>`)
        .join('')
    : '';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="background:#006078;color:#fff;padding:16px 24px;margin:0">${subject}</h2>
      <div style="padding:24px">
        <h3 style="margin-top:0">Request Details</h3>
        <table style="border-collapse:collapse;width:100%;background:#f8f9fa;border-radius:6px">
          ${rows}
        </table>
        ${companyRows ? `<h3 style="margin-top:24px">Company Information</h3><table style="border-collapse:collapse;width:100%;background:#f8f9fa;border-radius:6px">${companyRows}</table>` : ''}
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
      from: 'noreply@driverfly.com',
      to: RECIPIENT_EMAIL,
      subject,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Failed to send intake email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
