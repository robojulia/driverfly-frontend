import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import { JobForm } from "../../../../components/forms/company/job-form";
import { useState } from "react";
import { JobEntity } from "../../../../models/job/job.entity";
import { Col, Container, Row } from "react-bootstrap";
import FacebookShare from "../../../../components/facebook-share";

export default function CreateJob() {
    const { t } = useTranslation();

    const [job, setJob] = useState<JobEntity>(null)

    const jobUrl: string = `${process.env.FRONTEND_BASE_URL}/jobs/${job?.id}/${job?.slug}`

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
        >
            {!Boolean(job) ?
                <JobForm onSaveComplete={(j) => setJob(j)} />
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
                    <Row className="mt-90">
                        <Col md="12" lg="6">
                            <FacebookShare jobUrl={jobUrl} />
                        </Col>
                        <Col className="text-lg-right my-3 my-lg-0" md="12" lg="6">
                            <button className="theme-secondary-btn w-100 p-4">{t("SHARE_ON_DRIVERFLY_FACEBOOK_PAGE")}</button>

                        </Col>
                    </Row>
                    <Row className="mt-90">
                        <Col md="12">
                            <p className="mb-5 text-center ">{t("WANT_TO_POST_OUTSIDE_JOB_BOARDS")}</p>
                        </Col>
                        <Col>
                            <button type="button" className="theme-primary-btn btn-block btn-theme w-50 p-3 m-auto" > {t("COPY_FULL_JOB_DETAILS")}</button>

                        </Col>

                    </Row>
                </Container>
            }
        </ChildPageLayout >
    );
    
}

CreateJob.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}