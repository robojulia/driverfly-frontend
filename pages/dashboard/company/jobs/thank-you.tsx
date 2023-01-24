import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Col, Container, Row } from "react-bootstrap";
import SocialShareButton from "../../../../components/facebook-share";

export default function CreateJob() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/jobs";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);
    const postUrl = 'https://test.driverfly.co/jobs/6/jobqa2';

    return (
        <PageLayout
            title={t("CONGRATS")}
        >
            <Container>

                <Row className="text-center my-5">

                    <Col>
                        <button type="button" className="theme-primary-btn btn-block btn-theme w-100 p-3" onClick={goBack}> {t("view_job")}</button>

                    </Col>
                </Row>
                <Row className="my-5">
                    <Col>
                        <SocialShareButton postUrl={postUrl} />

                    </Col>
                    <Col className="text-right">
                        <SocialShareButton postUrl={postUrl} />

                    </Col>
                </Row>
                <Row className="text-center my-5">
                    <p>Want to post on outside job boards?</p>
                    <button type="button" className="theme-primary-btn btn-block btn-theme w-100 p-3" onClick={goBack}> {t("view_job")}</button>

                </Row>
            </Container>

        </PageLayout>
    );
}

CreateJob.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}