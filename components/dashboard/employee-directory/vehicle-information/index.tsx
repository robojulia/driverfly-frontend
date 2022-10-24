import { Col, Row } from "react-bootstrap";
import { PenFill } from 'react-bootstrap-icons';
import { useTranslation } from "../../../../hooks/use-translation";

const VehicleInformationTab = () => {
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
                        <h6><b>Tractor 1</b></h6>
                        <p>Driven from: (time range driven by driver) Driven from: (time range driven by driver)  <span>< PenFill /></span></p>
                        <Row>
                            <Col><h6><b>{t("year")}</b></h6></Col>
                            <Col><h6><b>{t("make")}</b></h6></Col>
                            <Col><h6><b>{t("model")}</b></h6></Col>
                        </Row>
                        <Col className="p-0 mt-3">
                            <p className="m-0">{t("last_inspected")}</p>
                            <p className="m-0">{t("inspection_notes")}</p>
                            <p className="m-0">{t("vehicle_maintenance_tracking_info")}</p>
                        </Col>
                    </Col>
                    <Col>
                        <h6><b>Tractor 1</b></h6>
                        <p>Driven from: (time range driven by driver) Driven from: (time range driven by driver) <span>< PenFill /></span></p>
                        <Row>
                            <Col><h6><b>{t("year")}</b></h6></Col>
                            <Col><h6><b>{t("make")}</b></h6></Col>
                            <Col><h6><b>{t("model")}</b></h6></Col>
                        </Row>
                        <Col className="p-0 mt-3">
                            <p className="m-0">{t("last_inspected")}</p>
                            <p className="m-0">{t("inspection_notes")}</p>
                            <p className="m-0">{t("vehicle_maintenance_tracking_info")}</p>
                        </Col>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default VehicleInformationTab;