import JobApply from "../../../components/apply"
import JobDescription from '../../../components/job-description/JobDescription'
import JonInformation from '../../../components/job-information-sidebar/JobInformation'
import { PublicLayout } from "../../../components/layouts/PublicLayout";
import RelatedJobs from '../../../components/related-jobs/Related-Jobs'
import SocilShare from '../../../components/share-link/ShareLink'
import timeSince from "../../../utils/timeSince"
import Link from 'next/link'
import { useTranslation } from "../../../hooks/useTranslation"
import JobApi from "../../api/job"
import CompanyPhoto from "../../../components/jobs/company-photo"
import StructuredData from "../../../components/seo/StructuredData"
import { ArrowRight, GeoAltFill, CurrencyDollar } from "react-bootstrap-icons"
import { buildAddress } from "../../../utils/common"
import SaveJob from "../../../components/dashboard/driver/save-job"
import JobVehicles from "../../../components/jobs/job-vehicles"
import { ToastContainer } from "react-toastify"
import ViewJobDetail from "../../../components/jobs/view-job-detail";

export default function Detail({ jobDetail, relatedJobs }) {

  const { t } = useTranslation();
  console.log(jobDetail);

  return (
    <>
      {/* <ToastContainer /> */}
      <StructuredData type="JobPosting" data={StructuredData.JobPosting(jobDetail, t)} />
      <ViewJobDetail
        job={jobDetail}
        relatedJobs={< RelatedJobs jobs={relatedJobs} jobLink="jobs" hideCompanyName={false} jobLinkSlugable={true} />}
        canApply={true}
        canSave={true}
        hideVehicles={false}
        hideCompanyName={false}
        viewAllJobsLink={`/find-jobs?companyId=${jobDetail.company?.id}`}
      />
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
      props: { jobDetail: job, relatedJobs: items }
    }
  } catch (error) {
    console.error("Exception is here:", error);
    return { props: { jobDetail: [], relatedJobs: [] } }
  }
}

Detail.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      {page}
    </PublicLayout>
  )
}