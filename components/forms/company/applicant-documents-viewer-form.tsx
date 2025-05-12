import { Col, Row, Card, Image, Form } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import ViewCard from "../../view-details/view-card";

export interface ApplicantDocumentsViewerFormProps
  extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function ApplicantDocumentsViewerForm(
  props: ApplicantDocumentsViewerFormProps
) {
  const { className, entity } = props;
  const { t } = useTranslation();

  // Find driver's license and medical card documents
  const driversLicense = entity?.documents?.find(
    (doc) => doc.type === "DRIVER_LICENSE"
  );
  const medicalCard = entity?.documents?.find(
    (doc) => doc.type === "MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD"
  );

  return (
    <Form className={className}>
      <Row>
        <Col md="12" className="p-0 px-lg-2">
          <ViewCard title="APPLICANT_DOCUMENTS">
            <Row>
              {driversLicense && (
                <Col md="6" className="mb-3">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">{t("DRIVERS_LICENSE")}</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      {driversLicense.path ? (
                        <Image
                          src={driversLicense.path}
                          alt={t("DRIVERS_LICENSE")}
                          fluid
                          className="document-image border"
                          style={{ maxHeight: "300px", objectFit: "contain" }}
                        />
                      ) : (
                        <p className="text-muted">{t("NO_IMAGE_AVAILABLE")}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {medicalCard && (
                <Col md="6" className="mb-3">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">{t("MEDICAL_CARD")}</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      {medicalCard.path ? (
                        <Image
                          src={medicalCard.path}
                          alt={t("MEDICAL_CARD")}
                          fluid
                          className="document-image border"
                          style={{ maxHeight: "300px", objectFit: "contain" }}
                        />
                      ) : (
                        <p className="text-muted">{t("NO_IMAGE_AVAILABLE")}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {!driversLicense && !medicalCard && (
                <Col md="12">
                  <p className="text-center text-muted">
                    {t("NO_DOCUMENTS_AVAILABLE")}
                  </p>
                </Col>
              )}
            </Row>
          </ViewCard>
        </Col>
      </Row>
    </Form>
  );
}
