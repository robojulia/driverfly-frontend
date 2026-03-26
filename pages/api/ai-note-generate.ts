import Anthropic from '@anthropic-ai/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profileType, profile } = req.body as {
    profileType: 'applicant' | 'employee';
    profile: Record<string, any>;
  };

  if (!profileType || !profile) {
    return res.status(400).json({ error: 'profileType and profile are required' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  try {
    const prompt = buildPrompt(profileType, profile);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

    return res.status(200).json({ note: text });
  } catch (error: any) {
    console.error('AI note generation error:', error);
    return res.status(500).json({ error: 'Failed to generate AI note' });
  }
}

function buildPrompt(profileType: 'applicant' | 'employee', profile: Record<string, any>): string {
  const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown';

  if (profileType === 'applicant') {
    const fields = [
      `Name: ${name}`,
      profile.license_type ? `CDL Type: ${profile.license_type}` : null,
      profile.years_cdl_experience != null ? `CDL Experience: ${profile.years_cdl_experience} years` : null,
      profile.endorsements?.length ? `Endorsements: ${profile.endorsements.join(', ')}` : null,
      profile.state ? `Location: ${profile.city ? profile.city + ', ' : ''}${profile.state}` : null,
      profile.status ? `Status: ${profile.status}` : null,
      profile.can_pass_drug_test != null ? `Drug Test: ${profile.can_pass_drug_test ? 'Can pass' : 'Cannot pass'}` : null,
      profile.is_owner_operator ? 'Owner Operator: Yes' : null,
      profile.transmission_type?.length ? `Transmission: ${profile.transmission_type.join(', ')}` : null,
      profile.preferred_location?.length ? `Preferred Locations: ${profile.preferred_location.join(', ')}` : null,
      profile.employers?.length ? `Previous Employers: ${profile.employers.length} listed` : null,
      profile.accident_history?.length ? `Accidents: ${profile.accident_history.length} on record` : null,
      profile.moving_violation_history?.length ? `Violations: ${profile.moving_violation_history.length} on record` : null,
      profile.notes?.length ? `Existing Notes: ${profile.notes.length}` : null,
    ].filter(Boolean).join('\n');

    return `You are an HR assistant for a trucking company. Write a concise professional note summarizing this driver applicant's profile for a recruiter. Focus on qualifications, any concerns, and a recommendation. Keep it under 5 sentences.

Applicant Profile:
${fields}

Write only the note text, no headers or labels.`;
  } else {
    const fields = [
      `Name: ${name}`,
      profile.job?.title ? `Position: ${profile.job.title}` : null,
      profile.status ? `Employment Status: ${profile.status}` : null,
      profile.hire_date ? `Hire Date: ${new Date(profile.hire_date).toLocaleDateString()}` : null,
      profile.license_type ? `CDL Type: ${profile.license_type}` : null,
      profile.years_cdl_experience != null ? `CDL Experience: ${profile.years_cdl_experience} years` : null,
      profile.endorsements?.length ? `Endorsements: ${profile.endorsements.join(', ')}` : null,
      profile.license_expiry ? `License Expires: ${new Date(profile.license_expiry).toLocaleDateString()}` : null,
      profile.mvr_expiry ? `MVR Expires: ${new Date(profile.mvr_expiry).toLocaleDateString()}` : null,
      profile.medical_card_expiry ? `Medical Card Expires: ${new Date(profile.medical_card_expiry).toLocaleDateString()}` : null,
      profile.documents?.length ? `Documents on file: ${profile.documents.length}` : null,
      profile.notes?.length ? `Existing HR Notes: ${profile.notes.length}` : null,
    ].filter(Boolean).join('\n');

    return `You are an HR assistant for a trucking company. Write a concise professional HR note summarizing this employee's current status. Highlight any upcoming document expirations or compliance concerns. Keep it under 5 sentences.

Employee Profile:
${fields}

Write only the note text, no headers or labels.`;
  }
}
