import React, { useState } from "react";
import { Col, Row, Form, Image, Accordion, Badge } from "react-bootstrap";
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

  // Find all signature types that should be displayed
  const signatureTypes = [
    "SIGNATURE_GENERAL_CONSENT",
    "SIGNATURE_IMPORTANT_BACKGROUND",
    "SIGNATURE_DISCLOSURE_AUTHORIZATION",
    "SIGNATURE_VOE_AUTHORIZATION",
  ];

  // Helper function to format the title from type
  const formatTitle = (type: string): string => {
    const typeWithoutPrefix = type.replace("SIGNATURE_", "");
    return typeWithoutPrefix
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Get all agreements with these signature types
  const agreements = signatureTypes.map((type) => {
    const agreement = entity?.extras?.find((extra) => extra.type === type);
    return {
      type,
      title: formatTitle(type),
      isSigned: !!(
        agreement?.value && agreement.value.startsWith("data:image")
      ),
      value: agreement?.value || null,
      signedDate: agreement
        ? (agreement as any).last_updated_at || (agreement as any).created_at
        : null,
    };
  });

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
            {agreements.length > 0 ? (
              <Accordion className="mt-2">
                {agreements.map((agreement, index) => (
                  <Accordion.Item eventKey={index.toString()} key={index}>
                    <Accordion.Header>
                      <div className="d-flex align-items-center w-100">
                        <span className="me-auto">{agreement.title}</span>
                        {agreement.isSigned ? (
                          <Badge
                            bg="success"
                            className="d-flex align-items-center ms-2 mr-2"
                          >
                            <i className="fas fa-check-circle me-1"></i>{" "}
                            {t("SIGNED")}
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="ms-2 mr-2">
                            {t("NOT_SIGNED")}
                          </Badge>
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {agreement.isSigned ? (
                        <div className="text-center">
                          <Image
                            src={agreement.value}
                            alt={agreement.title}
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
                              {formatDate(agreement.signedDate)}
                            </small>
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted text-center">
                          {t("SIGNATURE_NOT_AVAILABLE")}
                        </p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted">
                {t("NO_SIGNED_AGREEMENTS")}
              </p>
            )}
          </ViewCard>
        </Col>
      </Row>
    </Form>
  );
}
