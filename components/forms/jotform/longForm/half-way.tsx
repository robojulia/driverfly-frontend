import { useFormik } from "formik";
import { useContext } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Card,
  ProgressBar,
  Container,
} from "react-bootstrap";
import JotformContext, {
  JotFormContextType,
} from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function HalfWay() {
  const {
    method: { stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  // Define the upcoming sections
  const upcomingSections = [
    {
      title: t("SECTION_DRIVING_HISTORY"),
      description: t("SECTION_DRIVING_HISTORY_DESC"),
      icon: "fa-road",
    },
    {
      title: t("SECTION_ACCIDENT_HISTORY"),
      description: t("SECTION_ACCIDENT_HISTORY_DESC"),
      icon: "fa-car",
    },
    {
      title: t("SECTION_VIOLATIONS"),
      description: t("SECTION_VIOLATIONS_DESC"),
      icon: "fa-exclamation-triangle",
    },
    {
      title: t("SECTION_LICENSE_STATUS"),
      description: t("SECTION_LICENSE_STATUS_DESC"),
      icon: "fa-id-card",
    },
    {
      title: t("SECTION_JOB_COMPATIBILITY"),
      description: t("SECTION_JOB_COMPATIBILITY_DESC"),
      icon: "fa-check-square",
    },
    {
      title: t("SECTION_BACKGROUND_CHECK"),
      description: t("SECTION_BACKGROUND_CHECK_DESC"),
      icon: "fa-clipboard-list",
    },
  ];

  return (
    <Container className="py-4">
      <h1
        className={`${styles.carrierName} ${styles.jot_form_headers_font} text-center mb-4`}
      >
        {t("ALMOST_THERE")}
      </h1>

      <div className="text-center mb-4">
        <ProgressBar
          now={50}
          label="50%"
          variant="success"
          style={{ height: "25px" }}
          className="mb-2"
        />
        <p className="text-muted">{t("HALF_WAY_DONE")}</p>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <h3 className="mb-3 text-primary">
            <i className="fa fa-info-circle mr-2" aria-hidden="true"></i>
            {t("IMPORTANT_INFORMATION_AHEAD")}
          </h3>
          <p className="mb-4">{t("HALFWAY_DESCRIPTION")}</p>

          <h4 className="mb-3">{t("UPCOMING_SECTIONS")}</h4>

          <div className="row">
            {upcomingSections.map((section, index) => (
              <div className="col-md-6 mb-3" key={index}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="d-flex">
                    <div
                      className="mr-3 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                      }}
                    >
                      <i
                        className={`fa ${section.icon} text-primary`}
                        style={{ fontSize: "20px" }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{section.title}</h5>
                      <p className="mb-0 text-muted small">
                        {section.description}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4 border-0 shadow-sm bg-light">
        <Card.Body className="p-4">
          <h4 className="mb-3 text-primary">
            <i className="fa fa-question-circle mr-2" aria-hidden="true"></i>
            {t("WHY_WE_ASK")}
          </h4>
          <p className="mb-3">{t("WHY_WE_ASK_DESC")}</p>
          <div
            className="alert alert-info border-left border-primary"
            style={{ borderLeftWidth: "4px" }}
          >
            <i className="fa fa-lightbulb mr-2" aria-hidden="true"></i>
            <strong>{t("HONESTY_IS_BEST")}</strong>
          </div>
        </Card.Body>
      </Card>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row className="mt-4">
          <Col>
            <Button className="float-right" type="reset">
              {t("BACK")}
            </Button>
          </Col>
          <Col>
            <Button className="float-left btn-primary" type="submit">
              {t("NEXT")}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
