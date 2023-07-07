import RelatedJobs from '../../../../components/related-jobs/related-jobs'
import { useTranslation } from "../../../../hooks/use-translation"
import JobApi from "../../../api/job"
import StructuredData from "../../../../components/seo/structured-data"
import FullLayout from "../../../../components/dashboard/layouts/full-layout"
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout"
import ViewJobDetail from "../../../../components/jobs/view-job-detail";
import { JobDetailProps } from '../../../../types/job/job-detail-props.type'
import { Pagination } from '../../../../types/pagination.type'
import { JobEntity } from '../../../../models/job/job.entity'

export default function JobDetail({ job, relatedJobs }: JobDetailProps) {

    const { t } = useTranslation();

    return (
        <ChildPageLayout
            backPath="/dashboard/driver/jobs"
            title={job.title}
        >
            <StructuredData type="JobPosting" data={StructuredData.JobPosting(job, t)} />
            <ViewJobDetail
                job={job}
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
        const { items } = await new JobApi().search({ exclude: { jobId: id }, companyId: data.company?.id, take: 3 }) as Pagination<JobEntity>;
        return {
            props: { job: data, relatedJobs: items }
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