import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from 'crypto';
import axios from 'axios';
import { JobIndeedExporter } from '../../../utils/job-indeed-exporter';
import { JobEntity } from '../../../models/job/job.entity';
import { CompanyEntity } from '../../../models/company/company.entity';

// 15-minute in-memory cache
const feedCache = new Map<string, { xml: string; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000;

function getBackendApiUrl(): string {
  return process.env.BASE_URL_API || process.env.NEXT_PUBLIC_BASE_URL_API || 'http://localhost:4000/api';
}

function generateToken(companyId: string | number): string | null {
  const secret = process.env.INDEED_FEED_SECRET;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update(String(companyId)).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyId, token, status = 'ACTIVE' } = req.query;

    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const companyIdNum = parseInt(companyId as string, 10);
    if (isNaN(companyIdNum)) {
      return res.status(400).json({ error: 'Invalid companyId' });
    }

    // Validate token when secret is configured
    const expectedToken = generateToken(companyIdNum);
    if (expectedToken) {
      if (!token) {
        return res.status(401).json({ error: 'token is required' });
      }
      const tokenValid = crypto.timingSafeEqual(
        Buffer.from(token as string),
        Buffer.from(expectedToken),
      );
      if (!tokenValid) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // Serve from cache if fresh
    const cacheKey = `${companyIdNum}-${status}`;
    const cached = feedCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=900');
      return res.status(200).send(cached.xml);
    }

    const backendUrl = getBackendApiUrl().replace(/\/$/, '');

    // Fetch company — public endpoint
    const companyResponse = await axios.get<CompanyEntity>(
      `${backendUrl}/companies/${companyIdNum}`,
    );
    const company = companyResponse.data;
    if (!company) return res.status(404).json({ error: 'Company not found' });

    // Fetch jobs — use service token if configured, otherwise call public search
    const serviceToken = process.env.BACKEND_SERVICE_TOKEN;
    const jobsResponse = await axios.get<JobEntity[] | { items: JobEntity[] }>(
      `${backendUrl}/jobs`,
      {
        params: {
          companyId: companyIdNum,
          expiry_status: status === 'ALL' ? undefined : status,
          is_paginated: false,
        },
        headers: serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {},
      },
    );

    const jobsData = jobsResponse.data;
    const jobs: JobEntity[] = Array.isArray(jobsData)
      ? jobsData
      : (jobsData as any).items ?? (jobsData as any).data ?? [];

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

    const xml = JobIndeedExporter.generateXMLFeed(jobs, company, baseUrl);

    // Update cache, prune stale entries
    feedCache.set(cacheKey, { xml, timestamp: Date.now() });
    if (feedCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of feedCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) feedCache.delete(key);
      }
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=900');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Indeed feed error:', error);
    return res.status(500).json({
      error: 'Failed to generate Indeed feed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
