import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Col, Container, Row } from "react-bootstrap";
import SocialShareButton from "../../../../components/facebook-share";

export default function ThankYou() {
    const router = useRouter();
    const { t } = useTranslation();
    const jobId = router.query.id;

    console.log("asdsasasds", router.query.id)

    const jobUrl = `/dashboard/company/jobs/${jobId}`;
    const goBack = () => window.setTimeout(() => router.push(jobUrl), 2000);

    console.log("backPath", jobUrl)
    // const postUrl = 'https://test.driverfly.co/jobs/6/jobqa2';

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
                        <SocialShareButton jobUrl={jobUrl} />
                    </Col>
                    <Col className="text-lg-right my-3 my-lg-0" md="12" lg="6">
                        <SocialShareButton jobUrl={jobUrl} />
                    </Col>
                </Row>
                <Row className="mt-90">
                    <Col md="12">
                        <p className="mb-5 text-center ">{t("WANT_TO_POST_OUTSIDE_JOB_BOARDS")}</p>
                    </Col>
                    <Col>
                        <button type="button" className="theme-primary-btn btn-block btn-theme w-50 p-3 m-auto" onClick={goBack}> {t("view_job")}</button>

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