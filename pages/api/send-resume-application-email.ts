import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface ResumeApplicationEmailBody {
  /** Applicant's email address — where the resume link is sent */
  applicantEmail: string;
  /** Applicant's first name, used to personalize the greeting */
  applicantFirstName?: string;
  /** Company the applicant is applying to */
  companyName?: string;
  /** Absolute URL that resumes the application where the driver left off */
  resumeUrl: string;
}

const SUPPORT_EMAIL = 'support@driverfly.co';
const SUPPORT_PHONE = '(714) 340-5502';
const BRAND_COLOR = '#006078';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { applicantEmail, applicantFirstName, companyName, resumeUrl } =
    req.body as ResumeApplicationEmailBody;

  if (!applicantEmail || !resumeUrl) {
    return res.status(400).json({ error: 'applicantEmail and resumeUrl are required' });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'SENDGRID_API_KEY is not configured' });
  }

  const greetingName = applicantFirstName ? ` ${applicantFirstName}` : '';
  const company = companyName || 'us';
  const subject = companyName
    ? `Finish your application with ${companyName}`
    : 'Finish your Driverfly application';

  const html = `
    <div style="background:#f3f4f6;padding:24px 0;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:${BRAND_COLOR};padding:20px 24px;text-align:center">
          <span style="color:#ffffff;font-size:1.5rem;font-weight:700;letter-spacing:0.5px">Driverfly</span>
        </div>
        <div style="padding:32px 24px">
          <h1 style="margin:0 0 16px;color:#111827;font-size:1.35rem">Pick up where you left off</h1>
          <p style="margin:0 0 16px;color:#374151;font-size:1rem;line-height:1.6">
            Hi${greetingName}, your application with <strong>${company}</strong> has been saved.
            You can return any time to finish it&nbsp;— all your progress is still here.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="${resumeUrl}"
               style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:1rem">
              Resume My Application
            </a>
          </div>
          <p style="margin:0 0 8px;color:#6b7280;font-size:0.85rem;line-height:1.5">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="margin:0 0 24px;font-size:0.85rem;word-break:break-all">
            <a href="${resumeUrl}" style="color:${BRAND_COLOR}">${resumeUrl}</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px" />
          <p style="margin:0;color:#6b7280;font-size:0.85rem;line-height:1.6">
            Need a hand? Email us at
            <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR}">${SUPPORT_EMAIL}</a>
            or call <strong>${SUPPORT_PHONE}</strong> to speak with a recruiter.
          </p>
        </div>
        <div style="padding:16px 24px;background:#f9fafb;color:#9ca3af;font-size:0.75rem;text-align:center">
          You're receiving this because you started an application on Driverfly.
        </div>
      </div>
    </div>
  `;

  const text = [
    `Hi${greetingName},`,
    '',
    `Your application with ${company} has been saved. You can return any time to finish it — all your progress is still here.`,
    '',
    'Resume your application:',
    resumeUrl,
    '',
    `Need a hand? Email ${SUPPORT_EMAIL} or call ${SUPPORT_PHONE} to speak with a recruiter.`,
  ].join('\n');

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
      to: applicantEmail,
      subject,
      html,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Failed to send resume application email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
