import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Col, Container, Row } from "react-bootstrap";
import FacebookShare from "../../../../components/facebook-share";
import { useState } from "react";
import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
import { useEffectAsync } from "../../../../utils/react";

export default function ThankYou() {

    const router = useRouter();
    const [jobId, setJobId] = useState<any>(null);
    const [job, setJob] = useState<JobEntity>(null);

    const { t } = useTranslation();
    const jobUrl = `${process.env.FRONTEND_BASE_URL}/jobs/${jobId}/${job?.slug}`;

    useEffectAsync(async () => {

        const id = router?.query?.id;
        const url = id && id.length > 0 ? (typeof id === 'string' ? id : id[0]) : undefined;
        setJobId(url);
        if (url && !isNaN(parseInt(url))) {
            const job = await new JobApi().getById(parseInt(url));
            setJob(job)
        }


    }, []);

    const goBack = () => window.setTimeout(() => router.push(jobId), 2000);

    return (
        <PageLayout
        >
            <Container>
                <h3 className="text-center text-success">{t("CONGRATS")}</h3>
                <h3 className="text-center">
                    {t("{jobTitle}_CREATED", { jobTitle: job?.title }, { translateProps: true })}
                </h3>
                <Row className="text-center mt-150">

                    <Col>
                        <button type="button" className="theme-primary-btn btn-block btn-theme w-100 p-3" onClick={goBack}> {t("view_job")}</button>

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

        </PageLayout >
    );
}

ThankYou.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}