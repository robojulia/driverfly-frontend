import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form, Spinner, Badge, Collapse } from 'react-bootstrap';
import { CheckCircleFill, ExclamationTriangleFill, ClipboardCheck, BoxArrowUpRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { JobEntity } from '../../models/job/job.entity';
import { JobIndeedExporter } from '../../utils/job-indeed-exporter';

interface IndeedExportModalProps {
  show: boolean;
  jobs: JobEntity[];
  companyId: number;
  onClose: () => void;
}

interface ValidationError {
  jobId: number;
  errors: string[];
}

interface ExportResponse {
  success: boolean;
  feedUrl?: string;
  message: string;
  validationErrors?: ValidationError[];
  xml?: string;
}

export function IndeedExportModal({ show, jobs, companyId, onClose }: IndeedExportModalProps) {
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportResponse | null>(null);
  const [showXMLPreview, setShowXMLPreview] = useState(false);
  const [xmlPreview, setXmlPreview] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (show) {
      setExportData(null);
      setCopied(false);
      setShowXMLPreview(false);
      setXmlPreview('');
      handleExport();
    }
  }, [show, jobs]);

  const handleExport = () => {
    setLoading(true);
    try {
      // Validate jobs
      const validationErrors: ValidationError[] = [];

      jobs.forEach(job => {
        const validation = JobIndeedExporter.validateJobForIndeed(job);
        if (!validation.valid) {
          validationErrors.push({
            jobId: job.id!,
            errors: validation.errors,
          });
        }
      });

      // Get base URL
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'https://driverfly.com';

      // Generate feed URL
      const feedUrl = `${baseUrl}/api/indeed/feed?companyId=${companyId}`;

      const validJobs = jobs.length - validationErrors.length;

      setExportData({
        success: true,
        feedUrl,
        message: validationErrors.length > 0
          ? `${validationErrors.length} job(s) cannot be exported due to missing required fields. ${validJobs} job(s) ready for export.`
          : `${jobs.length} job(s) ready for export`,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      });

      if (validJobs > 0) {
        toast.success('Indeed export feed generated successfully!');
      } else {
        toast.error('Cannot export: All jobs have validation errors');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate Indeed export');
      setExportData({
        success: false,
        message: 'Failed to generate export. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (exportData?.feedUrl) {
      navigator.clipboard.writeText(exportData.feedUrl);
      setCopied(true);
      toast.success('Feed URL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadXML = () => {
    try {
      if (!jobs || jobs.length === 0 || !jobs[0]?.company) {
        toast.error('No company data available');
        return;
      }

      // Get base URL
      const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'https://driverfly.com';

      // Filter to only valid jobs
      const validJobs = jobs.filter(job => JobIndeedExporter.validateJobForIndeed(job).valid);

      if (validJobs.length === 0) {
        toast.error('No valid jobs to export');
        return;
      }

      // Generate XML
      const xml = JobIndeedExporter.generateXMLFeed(validJobs, jobs[0].company, baseUrl);

      // Download the XML file
      JobIndeedExporter.downloadXMLFeed(xml, `indeed-feed-${companyId}.xml`);
      toast.success('XML file downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download XML');
    }
  };

  const getJobTitle = (jobId: number) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || `Job #${jobId}`;
  };

  const validJobs = jobs.length - (exportData?.validationErrors?.length || 0);
  const hasErrors = (exportData?.validationErrors?.length || 0) > 0;
  const canExport = validJobs > 0;

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Export to Indeed</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
            <p className="mt-3">Generating Indeed export...</p>
          </div>
        ) : exportData ? (
          <>
            {/* Status Message */}
            <Alert variant={exportData.success ? (hasErrors ? 'warning' : 'success') : 'danger'}>
              {exportData.success ? (
                <>
                  <CheckCircleFill className="me-2" />
                  {canExport ? (
                    <>
                      <strong>Export Ready!</strong> {validJobs} of {jobs.length} job(s) ready for Indeed.
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleFill className="me-2" />
                      <strong>Cannot Export:</strong> All jobs have validation errors.
                    </>
                  )}
                </>
              ) : (
                <>
                  <ExclamationTriangleFill className="me-2" />
                  <strong>Export Failed:</strong> {exportData.message}
                </>
              )}
            </Alert>

            {/* Validation Errors */}
            {hasErrors && (
              <Alert variant="danger">
                <h6><ExclamationTriangleFill className="me-2" />Validation Errors</h6>
                <p className="mb-2">The following jobs cannot be exported due to missing required fields:</p>
                <ul className="mb-0">
                  {exportData.validationErrors?.map((error, idx) => (
                    <li key={idx}>
                      <strong>{getJobTitle(error.jobId)}</strong>: {error.errors.join(', ')}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 mb-0">
                  <strong>To fix:</strong> Edit these jobs and ensure all required fields (Title, Description, City, State, Zip Code, Company Name) are filled in.
                </p>
              </Alert>
            )}

            {/* Feed URL Section */}
            {canExport && exportData.feedUrl && (
              <>
                <h6 className="mb-3">Indeed XML Feed URL</h6>
                <p className="text-muted">
                  Copy this URL and submit it to the <a href="https://employers.indeed.com" target="_blank" rel="noopener noreferrer">
                    Indeed Partner Console <BoxArrowUpRight size={14} />
                  </a>. Indeed will crawl this feed periodically to import your job listings.
                </p>

                <Form.Group className="mb-3">
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      value={exportData.feedUrl}
                      readOnly
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      variant={copied ? 'success' : 'outline-secondary'}
                      onClick={handleCopyUrl}
                    >
                      {copied ? <><ClipboardCheck className="me-2" /> Copied!</> : 'Copy URL'}
                    </Button>
                  </div>
                </Form.Group>

                {/* XML Preview Toggle */}
                <div className="mb-3">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowXMLPreview(!showXMLPreview)}
                    className="p-0"
                  >
                    {showXMLPreview ? 'Hide' : 'Show'} XML Preview
                  </Button>
                </div>

                <Collapse in={showXMLPreview}>
                  <div>
                    <Alert variant="secondary">
                      <small>
                        <strong>XML Feed Preview:</strong>
                        <br />
                        The actual feed is available at the URL above. You can also{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); handleDownloadXML(); }}>
                          download the full XML file
                        </a>.
                      </small>
                    </Alert>
                  </div>
                </Collapse>

                {/* Instructions */}
                <Alert variant="info" className="mt-3">
                  <h6>Next Steps:</h6>
                  <ol className="mb-0">
                    <li>Copy the feed URL above</li>
                    <li>Go to the <a href="https://employers.indeed.com" target="_blank" rel="noopener noreferrer">Indeed Partner Console</a></li>
                    <li>Submit your XML feed URL</li>
                    <li>Indeed will automatically crawl your feed every 15-60 minutes to keep jobs up-to-date</li>
                  </ol>
                </Alert>
              </>
            )}
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {canExport && exportData?.feedUrl && (
          <Button variant="primary" onClick={handleDownloadXML}>
            Download XML File
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
