import { useRouter } from "next/router"
import { useState } from "react"
import JobApply from "../../../../components/apply"
import JobDescription from '../../../../components/job-description/JobDescription'
import JonInformation from '../../../../components/job-information-sidebar/JobInformation'
import RelatedJobs from '../../../../components/related-jobs/Related-Jobs'
import SocilShare from '../../../../components/share-link/ShareLink'
import timeSince from "../../../../utils/timeSince"
import { ToastContainer, toast } from 'react-toastify'
import Link from 'next/link'
import { useTranslation } from "../../../../hooks/useTranslation"
import JobApi from "../../../api/job"
import CompanyPhoto from "../../../../components/jobs/company-photo"
import StructuredData from "../../../../components/seo/StructuredData"
import { ArrowRight, GeoAltFill, CurrencyDollar } from "react-bootstrap-icons"
import { buildAddress } from "../../../../utils/common"
import FullLayout from "../../../../components/dashboard/layouts/FullLayout"
import SaveJob from "../../../../components/dashboard/driver/save-job"
import PageLayout from "../../../../components/layouts/page/PageLayout"
import { JobEntity } from "../../../../models/job/job.entity"
import ChildPageLayout from "../../../../components/layouts/page/ChildPageLayout"
import ViewJobDetail from "../../../../components/jobs/view-job-detail";

export interface JobDetailProps {
  jobDetail: JobEntity;
  relatedJobs: JobEntity[];
}

export default function JobDetail({ jobDetail, relatedJobs }: JobDetailProps) {

  const { t } = useTranslation();

  return (
    <ChildPageLayout
      backPath="/dashboard/driver/jobs"
      title={jobDetail.title}
    >
      <ToastContainer />
      <StructuredData type="JobPosting" data={StructuredData.JobPosting(jobDetail, t)} />
      <ViewJobDetail
        job={jobDetail}
        relatedJobs={< RelatedJobs jobs={relatedJobs} jobLink="dashboard/driver/jobs/" hideCompanyName={false} />}
        canApply={true}
        canSave={true}
        hideVehicles={false}
        hideCompanyName={false}
      />
    </ChildPageLayout>
  )
}
export async function getServerSideProps(context) {
  try {
    const id = context.params?.id;

    if (!id) {
      return {
        notFound: true
      };
    }
    const data = await new JobApi().getById(id);

    if (!data) {
      return {
        notFound: true
      };
    }
    const { items } = await new JobApi().search({ exclude: { jobId: id }, companyId: data.company?.id, take: 3 });
    return {
      props: { jobDetail: data, relatedJobs: items }
    }
  } catch (error) {
    console.error("Exception is here:", error);
    return { notFound: true }
  }
}

JobDetail.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}