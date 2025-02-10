import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { JobForm } from "../../../../components/forms/company/job-form";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import { JobEntity } from "../../../../models/job/job.entity";
import JobApi from "../../../api/job";

export default function CreateJob() {
    const [job, setJob] = useState<JobEntity>(null);
    const [cloneJob, setCloneJob] = useState<JobEntity>(null);

    const { t } = useTranslation();
    const router = useRouter();
    const jobApi = new JobApi();

    const fetchJobToClone = async () => {
        const { clone } = router.query;
        if (clone) {
            try {
                const jobData = await jobApi.getById(+clone);

                const cleanedJob = {
                    ...jobData,
                    id: undefined,
                    applicantsCount: undefined,
                };

                setCloneJob(cleanedJob);
            } catch (error) {
                console.error('Error fetching job to clone:', error);
            }
        }
    };

    useEffect(() => {
        fetchJobToClone();
    }, [router.query]);

    const jobUrl = `${process.env.FRONTEND_BASE_URL}jobs/${job?.id}/${job?.slug}`;

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
        >
            {!Boolean(job) ?
                <JobForm
                    onSaveComplete={(j) => setJob(j)}
                    entity={cloneJob}
                />
                :
                <Container>
                    <h3 className="text-center text-success">{t("CONGRATS")}</h3>
                    <h3 className="text-center">
                        {t("{jobTitle}_CREATED", { jobTitle: job?.title }, { translateProps: true })}
                    </h3>
                    <Row className="text-center mt-150">

                        <Col>
                            <a
                                href={jobUrl}
                                type="button"
                                className="theme-primary-btn btn-block btn-theme w-100 p-3"
                            > {t("view_job")}</a>

                        </Col>
                    </Row>
                    {/* <Row className="mt-90">
                        <Col md="12" lg="6">
                            <FacebookShare jobUrl={jobUrl} />
                        </Col>
                        <Col className="text-lg-right my-3 my-lg-0" md="12" lg="6">
                            <button className="theme-secondary-btn w-100 p-4">{t("SHARE_ON_DRIVERFLY_FACEBOOK_PAGE")}</button>

                        </Col>
                    </Row> */}
                    {/* <Row className="mt-90">
                        <Col md="12">
                            <p className="mb-5 text-center ">{t("WANT_TO_POST_OUTSIDE_JOB_BOARDS")}</p>
                        </Col>
                        <Col>
                            <button type="button" className="theme-primary-btn btn-block btn-theme w-50 p-3 m-auto" > {t("COPY_FULL_JOB_DETAILS")}</button>

                        </Col>
                    </Row> */}
                </Container>
            }
        </ChildPageLayout>
    );
}

CreateJob.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}