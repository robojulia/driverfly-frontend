import ViewJobDetail from '../../../components/jobs/view-job-detail';
import { PublicLayout } from '../../../components/layouts/public-layout';
import RelatedJobs from '../../../components/related-jobs/related-jobs';
import StructuredData from '../../../components/seo/structured-data';
import { useTranslation } from '../../../hooks/use-translation';
import { useAutoJobViewTracking } from '../../../hooks/use-job-analytics';
import { JobEntity } from '../../../models/job/job.entity';
import { JobDetailProps } from '../../../types/job/job-detail-props.type';
import { Pagination } from '../../../types/pagination.type';
import JobApi from '../../api/job';

export default function Detail({
  job,
  relatedJobs,
  quick_apply,
  campaignInfo,
  error,
}: JobDetailProps) {
  console.error('error', error);

  const { t } = useTranslation();

  // Build view metadata from server-side extracted tracking params.
  // UTM source/medium/campaign come from server-side props so they're captured
  // immediately on mount, before the 30s batch flush window.
  // campaignId is only for the internal campaign system (?campaignId= param), not utm_campaign.
  const viewMetadata =
    campaignInfo?.source || campaignInfo?.campaignId
      ? {
          source: campaignInfo.source || undefined,
          medium: campaignInfo.medium || undefined,
          campaign: campaignInfo.campaign || undefined,
          campaignId: campaignInfo.campaignId || undefined,
        }
      : undefined;

  useAutoJobViewTracking(job?.id, job?.company?.id, viewMetadata);

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
    const { quick_apply, campaignId, utm_source, utm_medium, utm_campaign } = query;

    if (!!!jobId) return { notFound: true };

    const job = await new JobApi().getById(jobId);
    if (!!!job) return { notFound: true };

    const { items } = (await new JobApi().search({
      exclude: { jobId: jobId },
      companyId: job.company?.id,
      take: 3,
    })) as Pagination<JobEntity>;

    // Extract tracking information for analytics.
    // - campaignId: internal campaign system ID (from ?campaignId= only, NOT utm_campaign)
    // - source/medium/campaign: UTM params for channel attribution
    const campaignInfo = {
      campaignId: (campaignId as string) || null,
      source: (utm_source as string) || (campaignId ? 'campaign' : null),
      medium: (utm_medium as string) || (campaignId ? 'sms' : null),
      campaign: (utm_campaign as string) || null,
    };

    return {
      props: {
        job: job || {},
        relatedJobs: items || [],
        quick_apply: quick_apply || null,
        campaignInfo,
        error: null,
      },
    };
  } catch (error) {
    console.error('Exception is here:', error?.response?.data);
    return {
      props: {
        job: {},
        relatedJobs: [],
        quick_apply: null,
        error: error?.response?.data || null,
      },
    };
  }
}

Detail.getLayout = function getLayout(page) {
  return <PublicLayout>{page}</PublicLayout>;
};
