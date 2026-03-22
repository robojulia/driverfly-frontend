import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Button, InputGroup, Table, Badge } from 'react-bootstrap';
import { ClipboardFill, Link45deg, PlusCircle, Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { JobEntity } from '../../models/job/job.entity';

interface TrackingLinksProps {
  job: JobEntity;
}

interface GeneratedLink {
  source: string;
  medium: string;
  campaign: string;
  jobPageUrl: string;
  applyUrl: string;
}

const COMMON_SOURCES = [
  { value: 'indeed', label: 'Indeed' },
  { value: 'google', label: 'Google Jobs' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'ziprecruiter', label: 'ZipRecruiter' },
  { value: 'craigslist', label: 'Craigslist' },
  { value: 'email', label: 'Email' },
  { value: 'custom', label: 'Custom...' },
];

const COMMON_MEDIUMS = [
  { value: 'organic', label: 'Organic (free listing)' },
  { value: 'cpc', label: 'CPC (paid ad)' },
  { value: 'social', label: 'Social' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'custom', label: 'Custom...' },
];

function storageKey(jobId: number) {
  return `tracking_links_job_${jobId}`;
}

function loadLinks(jobId: number): GeneratedLink[] {
  try {
    const raw = localStorage.getItem(storageKey(jobId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLinks(jobId: number, links: GeneratedLink[]) {
  try {
    localStorage.setItem(storageKey(jobId), JSON.stringify(links));
  } catch {}
}

export const TrackingLinksSection: React.FC<TrackingLinksProps> = ({ job }) => {
  const [source, setSource] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [medium, setMedium] = useState('');
  const [customMedium, setCustomMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [generatedLinks, setGeneratedLinks] = useState<GeneratedLink[]>([]);

  useEffect(() => {
    if (job?.id) setGeneratedLinks(loadLinks(job.id));
  }, [job?.id]);

  const effectiveSource = source === 'custom' ? customSource : source;
  const effectiveMedium = medium === 'custom' ? customMedium : medium;

  function buildUrls(): { jobPageUrl: string; applyUrl: string } {
    const host = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();
    if (effectiveSource) params.set('utm_source', effectiveSource);
    if (effectiveMedium) params.set('utm_medium', effectiveMedium);
    if (campaign) params.set('utm_campaign', campaign);

    const jobPageUrl = `${host}/jobs/${job.id}/${job.slug}?${params.toString()}`;

    const applyParams = new URLSearchParams(params);
    applyParams.set('jobId', String(job.id));
    const applyUrl = `${host}/apply/${job.company?.slug}?${applyParams.toString()}`;

    return { jobPageUrl, applyUrl };
  }

  function handleGenerate() {
    if (!effectiveSource) { toast.error('Please select a source'); return; }
    if (!effectiveMedium) { toast.error('Please select a medium'); return; }

    const { jobPageUrl, applyUrl } = buildUrls();
    const newLink: GeneratedLink = {
      source: effectiveSource,
      medium: effectiveMedium,
      campaign,
      jobPageUrl,
      applyUrl,
    };

    const updated = [newLink, ...generatedLinks];
    setGeneratedLinks(updated);
    saveLinks(job.id, updated);
  }

  async function copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Failed to copy link');
    }
  }

  function removeLink(index: number) {
    const updated = generatedLinks.filter((_, i) => i !== index);
    setGeneratedLinks(updated);
    saveLinks(job.id, updated);
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">
          <Link45deg className="me-2" />
          Tracking Links
        </Card.Title>
        <small className="text-muted">
          Generate UTM-tagged links for this job. Each source gets two links — one for the job
          listing page (recommended) and one that goes directly to the full application form.
        </small>
      </Card.Header>
      <Card.Body>
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <Form.Label className="fw-semibold">Source</Form.Label>
            <Form.Select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Select source...</option>
              {COMMON_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Form.Select>
            {source === 'custom' && (
              <Form.Control
                className="mt-2"
                placeholder="e.g. truckersnews"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
            )}
          </Col>

          <Col md={3}>
            <Form.Label className="fw-semibold">Medium</Form.Label>
            <Form.Select value={medium} onChange={(e) => setMedium(e.target.value)}>
              <option value="">Select medium...</option>
              {COMMON_MEDIUMS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Form.Select>
            {medium === 'custom' && (
              <Form.Control
                className="mt-2"
                placeholder="e.g. newsletter"
                value={customMedium}
                onChange={(e) => setCustomMedium(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              />
            )}
          </Col>

          <Col md={4}>
            <Form.Label className="fw-semibold">
              Campaign <span className="text-muted fw-normal">(optional)</span>
            </Form.Label>
            <Form.Control
              placeholder="e.g. spring-2026-hiring"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </Col>

          <Col md={2}>
            <Button variant="primary" className="w-100" onClick={handleGenerate}>
              <PlusCircle className="me-1" size={14} />
              Generate
            </Button>
          </Col>
        </Row>

        {generatedLinks.length > 0 && (
          <div className="mt-4">
            <Table size="sm" className="mb-0">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Source</th>
                  <th style={{ width: '10%' }}>Medium</th>
                  <th style={{ width: '15%' }}>Campaign</th>
                  <th>Job Page</th>
                  <th>Direct Application</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {generatedLinks.map((link, i) => (
                  <tr key={i}>
                    <td className="align-middle">
                      <small className="fw-semibold">{link.source}</small>
                    </td>
                    <td className="align-middle">
                      <small>{link.medium}</small>
                    </td>
                    <td className="align-middle">
                      <small>{link.campaign || <span className="text-muted">—</span>}</small>
                    </td>
                    <td className="align-middle">
                      <InputGroup size="sm">
                        <Form.Control
                          readOnly
                          value={link.jobPageUrl}
                          style={{ fontSize: '0.72rem' }}
                          title={link.jobPageUrl}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => copyToClipboard(link.jobPageUrl)}
                          title="Copy job page link"
                        >
                          <ClipboardFill size={11} />
                        </Button>
                      </InputGroup>
                    </td>
                    <td className="align-middle">
                      <InputGroup size="sm">
                        <Form.Control
                          readOnly
                          value={link.applyUrl}
                          style={{ fontSize: '0.72rem' }}
                          title={link.applyUrl}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => copyToClipboard(link.applyUrl)}
                          title="Copy direct application link"
                        >
                          <ClipboardFill size={11} />
                        </Button>
                      </InputGroup>
                    </td>
                    <td className="align-middle text-end">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => removeLink(i)}
                      >
                        <Trash size={13} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
