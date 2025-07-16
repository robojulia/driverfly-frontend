import ViewJobDetail from '../../../components/jobs/view-job-detail';
import { PublicLayout } from '../../../components/layouts/public-layout';
import RelatedJobs from '../../../components/related-jobs/related-jobs';
import StructuredData from '../../../components/seo/structured-data';
import { useTranslation } from '../../../hooks/use-translation';
import { JobEntity } from '../../../models/job/job.entity';
import { JobDetailProps } from '../../../types/job/job-detail-props.type';
import { Pagination } from '../../../types/pagination.type';
import JobApi from '../../api/job';

export default function Detail({ job, relatedJobs, quick_apply, error }: JobDetailProps) {
  console.error('error', error);

  const { t } = useTranslation();

  return (
    <>
      <StructuredData type="JobPosting" data={StructuredData.JobPosting(job, t)} />
      <ViewJobDetail
        quick_apply={quick_apply}
        job={job}
        relatedJobs={
          <RelatedJobs
            jobs={relatedJobs}
            jobLink="jobs"
            hideCompanyName={false}
            jobLinkSlugable={true}
          />
        }
        canApply={true}
        canSave={true}
        hideVehicles={false}
        hideCompanyName={false}
        viewAllJobsLink={`/find-jobs?companyId=${job.company?.id}`}
      />
    </>
  );
}
export async function getServerSideProps({ params, query }) {
  try {
    const { jobId } = params;
    const { quick_apply } = query;

    if (!!!jobId) return { notFound: true };

    const job = await new JobApi().getById(jobId);
    if (!!!job) return { notFound: true };

    const { items } = (await new JobApi().search({
      exclude: { jobId: jobId },
      companyId: job.company?.id,
      take: 3,
    })) as Pagination<JobEntity>;
    return {
      props: { job: job, relatedJobs: items, quick_apply: quick_apply || null },
    };
  } catch (error) {
    console.error('Exception is here:', error?.response?.data);
    return { props: { job: {}, relatedJobs: [], error: error?.response?.data } };
  }
}

Detail.getLayout = function getLayout(page) {
  return <PublicLayout>{page}</PublicLayout>;
};
