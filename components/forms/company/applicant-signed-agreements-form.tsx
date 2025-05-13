import { Col, Row, Card, Form, Image } from "react-bootstrap";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import ViewCard from "../../view-details/view-card";

export interface ApplicantSignedAgreementsFormProps
  extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

export function ApplicantSignedAgreementsForm(
  props: ApplicantSignedAgreementsFormProps
) {
  const { className, entity } = props;
  const { t } = useTranslation();

  // Find all signed agreement extras
  const signatureTypes = [
    "SIGNATURE_GENERAL_CONSENT",
    "SIGNATURE_IMPORTANT_BACKGROUND",
    "SIGNATURE_DISCLOSURE_AUTHORIZATION",
    "SIGNATURE_VOE_AUTHORIZATION",
  ];

  const signedAgreements =
    entity?.extras?.filter(
      (extra) => signatureTypes.includes(extra.type) && extra.value
    ) || [];

  // Helper function to format the title from type
  const formatTitle = (type: string): string => {
    const typeWithoutPrefix = type.replace("SIGNATURE_", "");
    return typeWithoutPrefix
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Function to format date from string
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return t("UNKNOWN_DATE");
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (error) {
      return t("UNKNOWN_DATE");
    }
  };

  return (
    <Form className={className}>
      <Row>
        <Col md="12" className="p-0 px-lg-2">
          <ViewCard title="SIGNED_AGREEMENTS">
            <Row>
              {signedAgreements.length > 0 ? (
                signedAgreements.map((agreement, index) => (
                  <Col md="6" key={index} className="mb-3">
                    <Card className="h-100">
                      <Card.Header className="bg-light">
                        <h5 className="mb-0">{formatTitle(agreement.type)}</h5>
                      </Card.Header>
                      <Card.Body className="text-center">
                        {agreement.value &&
                        agreement.value.startsWith("data:image") ? (
                          <div>
                            <Image
                              src={agreement.value}
                              alt={formatTitle(agreement.type)}
                              fluid
                              className="signature-image border"
                              style={{
                                maxHeight: "150px",
                                objectFit: "contain",
                              }}
                            />
                            <p className="text-muted mt-2">
                              <small>
                                {t("SIGNED_ON")}:{" "}
                                {formatDate(
                                  (agreement as any).last_updated_at ||
                                    (agreement as any).created_at
                                )}
                              </small>
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted">
                            {t("SIGNATURE_NOT_AVAILABLE")}
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col md="12">
                  <p className="text-center text-muted">
                    {t("NO_SIGNED_AGREEMENTS")}
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
