/**
 * POST /api/indeed/job-sync
 *   Body: { jobId: number }
 *   Creates or updates (upserts) a job on Indeed via the Job Sync API.
 *   Returns { sourcedPostingId, jobPostingId, status, errors }
 *
 * DELETE /api/indeed/job-sync
 *   Body: { sourcedPostingId: string }
 *   Expires (closes) a job on Indeed.
 *   Returns { sourcedPostingId, status, errors }
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getIndeedJobSyncService } from '../../../utils/indeed-job-sync';
import { JobEntity } from '../../../models/job/job.entity';
import { CompanyEntity } from '../../../models/company/company.entity';

function getBackendApiUrl(): string {
  return (process.env.BASE_URL_API ?? process.env.NEXT_PUBLIC_BASE_URL_API ?? 'http://localhost:4000/api').replace(/\/$/, '');
}

async function fetchJob(jobId: number, authHeader?: string): Promise<JobEntity> {
  const backendUrl = getBackendApiUrl();
  const serviceToken = process.env.BACKEND_SERVICE_TOKEN;
  const headers: Record<string, string> = {};
  if (serviceToken) headers.Authorization = `Bearer ${serviceToken}`;
  else if (authHeader) headers.Authorization = authHeader;

  const { data } = await axios.get<JobEntity>(`${backendUrl}/jobs/${jobId}`, { headers });
  return data;
}

async function fetchCompany(companyId: number, authHeader?: string): Promise<CompanyEntity> {
  const backendUrl = getBackendApiUrl();
  const serviceToken = process.env.BACKEND_SERVICE_TOKEN;
  const headers: Record<string, string> = {};
  if (serviceToken) headers.Authorization = `Bearer ${serviceToken}`;
  else if (authHeader) headers.Authorization = authHeader;

  const { data } = await axios.get<CompanyEntity>(`${backendUrl}/companies/${companyId}`, { headers });
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const service = getIndeedJobSyncService();

  // ── POST: create or update a job ──────────────────────────────────────────
  if (req.method === 'POST') {
    const { jobId, companyId } = req.body as { jobId?: number; companyId?: number };

    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required' });
    }

    try {
      const authHeader = req.headers.authorization as string | undefined;
      const job = await fetchJob(Number(jobId), authHeader);

      const resolvedCompanyId = companyId ?? job.company?.id;
      if (!resolvedCompanyId) {
        return res.status(400).json({ error: 'companyId could not be determined from job' });
      }

      const company = await fetchCompany(Number(resolvedCompanyId), authHeader);

      const result = await service.createOrUpdateJob(job, company);

      if (result.errors?.length) {
        return res.status(422).json({ result });
      }

      return res.status(200).json({ result });
    } catch (error) {
      console.error('Indeed job-sync POST error:', error);
      return res.status(500).json({
        error: 'Failed to sync job to Indeed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // ── DELETE: expire a job ──────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    const { sourcedPostingId } = req.body as { sourcedPostingId?: string };

    if (!sourcedPostingId) {
      return res.status(400).json({ error: 'sourcedPostingId is required' });
    }

    try {
      const result = await service.expireJob(sourcedPostingId);

      if (result.errors?.length) {
        return res.status(422).json({ result });
      }

      return res.status(200).json({ result });
    } catch (error) {
      console.error('Indeed job-sync DELETE error:', error);
      return res.status(500).json({
        error: 'Failed to expire job on Indeed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
