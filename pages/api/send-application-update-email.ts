import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { UserEntity } from '../../models/user/user.entity';

function getBackendApiUrl(): string {
  return (
    process.env.BASE_URL_API ??
    process.env.NEXT_PUBLIC_BASE_URL_API ??
    'http://localhost:4000/api'
  ).replace(/\/$/, '');
}

async function fetchCompanyUsers(companyId: number): Promise<UserEntity[]> {
  const backendUrl = getBackendApiUrl();
  const serviceToken = process.env.BACKEND_SERVICE_TOKEN;

  if (!serviceToken) return [];

  try {
    const { data } = await axios.get<UserEntity[]>(
      `${backendUrl}/user/list?companyId=${companyId}`,
      { headers: { Authorization: `Bearer ${serviceToken}` } }
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { applicantId, companyId, applicantFirstName, applicantLastName, applicantEmail, applicantPhone, companyName } =
    req.body as {
      applicantId?: number;
      companyId?: number;
      applicantFirstName?: string;
      applicantLastName?: string;
      applicantEmail?: string;
      applicantPhone?: string;
      companyName?: string;
    };

  if (!companyId) {
    return res.status(400).json({ error: 'companyId is required' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
  }

  const users = await fetchCompanyUsers(companyId);
  const recipients = users
    .filter((u) => u.email && u.enabled_notifications !== false)
    .map((u) => u.email as string);

  if (recipients.length === 0) {
    return res.status(200).json({ success: true, skipped: true, reason: 'no_recipients' });
  }

  const applicantName = [applicantFirstName, applicantLastName].filter(Boolean).join(' ') || 'An applicant';
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/company/applicants`
    : null;

  const detailRows = [
    ['Name', applicantName],
    ['Email', applicantEmail],
    ['Phone', applicantPhone],
    ['Company', companyName],
    ['Applicant ID', applicantId ? String(applicantId) : null],
  ]
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap;color:#374151">${k}</td><td style="padding:6px 12px;color:#1f2937">${v}</td></tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <h2 style="background:#006078;color:#fff;padding:16px 24px;margin:0">Application Updated</h2>
      <div style="padding:24px">
        <p style="margin-top:0;color:#374151;font-size:1rem">
          An applicant has updated their application for <strong>${companyName || 'your company'}</strong>.
          Please review the updated information in your dashboard.
        </p>
        <h3 style="margin-top:24px;margin-bottom:8px;color:#1f2937">Applicant Details</h3>
        <table style="border-collapse:collapse;width:100%;background:#f8f9fa;border-radius:6px">
          ${detailRows}
        </table>
        ${
          dashboardUrl
            ? `<div style="margin-top:24px"><a href="${dashboardUrl}" style="display:inline-block;background:#006078;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">View in Dashboard</a></div>`
            : ''
        }
      </div>
      <div style="padding:16px 24px;background:#f3f4f6;color:#6b7280;font-size:0.85rem">
        This notification was sent because the applicant submitted an updated application on Driverfly.
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
      to: recipients,
      subject: `Application Updated – ${applicantName}`,
      html,
    });

    return res.status(200).json({ success: true, recipientCount: recipients.length });
  } catch (error: any) {
    console.error('Failed to send application update email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
