import { useState } from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import { Megaphone } from 'react-bootstrap-icons';
import { useAuth } from '../../hooks/use-auth';
import { JobEntity } from '../../models/job/job.entity';
import { PostToJobBoardsModal } from './post-to-job-boards-modal';

/** Opens the dialog that posts this job to the company's connected Facebook, LinkedIn and Indeed accounts. */
export function PostToJobBoardsButton({ job, ...rest }: { job: JobEntity } & ButtonProps) {
  const { company } = useAuth();
  const [show, setShow] = useState(false);
  const companyId = job?.company?.id ?? company?.id;

  return (
    <>
      <Button type="button" variant="outline-primary" onClick={() => setShow(true)} disabled={!job?.id || !companyId} {...rest}>
        <Megaphone className="me-2" /> Post to job boards
      </Button>
      {show && <PostToJobBoardsModal show={show} job={job} companyId={companyId} onClose={() => setShow(false)} />}
    </>
  );
}
