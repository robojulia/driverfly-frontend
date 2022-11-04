import { EmbeddedLayout } from "../../../components/layouts/embedded/embedded-layout";
import RelatedJobs from '../../../components/related-jobs/related-jobs'
import { useTranslation } from "../../../hooks/use-translation"
import JobApi from "../../api/job"
import StructuredData from "../../../components/seo/structured-data"
import ViewJobDetail from "../../../components/jobs/view-job-detail";
import { JobDetailProps } from "../../../types/job/job-detail-props.type";

export default function Detail({ job, relatedJobs }: JobDetailProps) {

  const { t } = useTranslation();

  return (
    <>
      <div className="my-5">
        <StructuredData type="JobPosting" data={StructuredData.JobPosting(job, t)} />
        <ViewJobDetail
          job={job}
          relatedJobs={< RelatedJobs jobs={relatedJobs} jobLink="jobs" hideCompanyName={false} jobLinkSlugable={true} />}
          canApply={true}
          canSave={true}
          hideVehicles={false}
          hideCompanyName={true}
        />
      </div>
    </>
  )
}
export async function getServerSideProps(context) {
  try {
    const jobId = context.params?.jobId;
    if (!!!jobId)
      return { notFound: true }

    const job = await new JobApi().getById(jobId)
    if (!!!job)
      return { notFound: true }

    const { items } = await new JobApi().search({ exclude: { jobId: jobId }, companyId: job.company?.id, take: 3 });
    return {
      props: { job: job, relatedJobs: items }
    }
  } catch (error) {
    console.error("Exception is here:", error);
    return { props: { job: {}, relatedJobs: [] } }
  }
}

Detail.getLayout = function getLayout(page) {
  return (
    <EmbeddedLayout>
      {page}
    </EmbeddedLayout>
  )
}