import { Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/useTranslation";

const BackgroundTab = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="employee_directory_tabs">
                <Row className="mt-3">
                    <Col>
                        <h5>Roger Atkins</h5>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <p>{t("MANAGER")} <span> Irfan</span></p>
                    </Col>
                    <Col>
                        <p>{t("RECRUITER")} <span> Irfan</span></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>{t("mvr")} <span> Approved (5/2022)</span></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button type="button" className="theme-primary-btn mr-4 py-2">{t("view_applicant_profile")}</button>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default BackgroundTab;