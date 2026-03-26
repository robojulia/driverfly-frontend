import React, { useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { CloudUpload } from 'react-bootstrap-icons';
import { JobEntity } from '../../models/job/job.entity';
import { IndeedExportModal } from './IndeedExportModal';
import { useTranslation } from '../../hooks/use-translation';

export interface ExportToIndeedButtonProps extends ButtonProps {
  job?: JobEntity;
  jobs?: JobEntity[];
  mode: 'single' | 'bulk';
  companyId?: number;
  onComplete?: () => void;
}

export function ExportToIndeedButton(props: ExportToIndeedButtonProps) {
  const { job, jobs, mode, companyId, onComplete, ...rest } = props;
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  // Determine which jobs to export
  const jobsToExport = mode === 'single' && job ? [job] : (jobs || []);

  // Get company ID from job or props
  const effectiveCompanyId = companyId || job?.company?.id || jobs?.[0]?.company?.id;

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    onComplete?.();
  };

  // Disable if no jobs or no company ID
  const isDisabled = jobsToExport.length === 0 || !effectiveCompanyId;

  return (
    <>
      <Button
        type="button"
        variant="outline-primary"
        onClick={handleClick}
        disabled={isDisabled}
        title={isDisabled ? 'No jobs available for export' : 'Post to Indeed'}
        {...rest}
      >
        <CloudUpload className="me-2" /> Post to Indeed
      </Button>

      <IndeedExportModal
        show={showModal}
        jobs={jobsToExport}
        companyId={effectiveCompanyId!}
        onClose={handleClose}
      />
    </>
  );
}
