import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Col, Container, Row } from "react-bootstrap";
import FacebookShare from "../../../../components/facebook-share";
import { useEffect, useState } from "react";
import JobApi from "../../../api/job";
import { useEffectAsync } from "../../../../utils/react";

export default function ThankYou() {

    const router = useRouter();
    const [jobId, setJobId] = useState<any>(null);

    const { t } = useTranslation();
    const jobUrl = `/dashboard/company/jobs/${jobId}`;
    // const jobUrl = `https://test.driverfly.co/jobs/19/jobmatching7`;

    useEffectAsync(async () => {
        const url = router?.query?.id
        // comment added
        const job = await new JobApi().getById(parseInt(url))
        setJobId(job.slug)
        console.log("job fetced", job);

    }, [])

    const goBack = () => window.setTimeout(() => router.push(jobId), 2000);

    return (
        <PageLayout
            title={t("CONGRATS")}
        >
            <Container>
                <Row className="text-center mt-150">

                    <Col>
                        <button type="button" className="theme-primary-btn btn-block btn-theme w-100 p-3" onClick={goBack}> {t("view_job")}</button>

                    </Col>
                </Row>
                <Row className="mt-90">
                    <Col md="12" lg="6">
                        <FacebookShare jobUrl={jobId} />
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