import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { JobIndeedExporter } from '../../../utils/job-indeed-exporter';
import { JobEntity } from '../../../models/job/job.entity';
import { CompanyEntity } from '../../../models/company/company.entity';

// Cache for feed data (15 minutes)
const feedCache = new Map<string, { xml: string; timestamp: number }>();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Get backend API URL
function getBackendApiUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL_API || process.env.BASE_URL_API || 'http://localhost:4000/api';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyId, token, status = 'ACTIVE' } = req.query;

    // Validate required parameters
    if (!companyId) {
      return res.status(400).json({ error: 'companyId is required' });
    }

    const companyIdNum = parseInt(companyId as string, 10);
    if (isNaN(companyIdNum)) {
      return res.status(400).json({ error: 'Invalid companyId' });
    }

    // Check cache first
    const cacheKey = `${companyIdNum}-${status}`;
    const cached = feedCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).send(cached.xml);
    }

    const backendUrl = getBackendApiUrl();

    // Fetch company data from backend API
    const companyResponse = await axios.get<CompanyEntity>(`${backendUrl}/companies/${companyIdNum}`);
    const company = companyResponse.data;

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Fetch all active jobs for the company from backend API
    const jobsResponse = await axios.get<JobEntity[]>(`${backendUrl}/jobs`, {
      params: {
        companyId: companyIdNum,
        expiry_status: status === 'ALL' ? undefined : status,
        is_paginated: false,
      },
    });

    // Handle response - could be array or paginated object
    const jobsData = jobsResponse.data;
    const jobs = Array.isArray(jobsData) ? jobsData : (jobsData as any).items || [];

    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                   `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;

    // Generate XML feed
    const xml = JobIndeedExporter.generateXMLFeed(jobs, company, baseUrl);

    // Cache the result
    feedCache.set(cacheKey, { xml, timestamp: Date.now() });

    // Clean up old cache entries (simple cleanup)
    if (feedCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of feedCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          feedCache.delete(key);
        }
      }
    }

    // Return XML response
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=900'); // 15 minutes
    return res.status(200).send(xml);

  } catch (error) {
    console.error('Indeed feed error:', error);
    return res.status(500).json({
      error: 'Failed to generate Indeed feed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
