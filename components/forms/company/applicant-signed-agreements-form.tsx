import React, { useState } from 'react';
import { Col, Row, Form, Image, Accordion, Badge, Button } from 'react-bootstrap';
import { FileText, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import { ApplicantEntity } from '../../../models/applicant/applicant.entity';
import { BaseFormProps } from './base-form-props';
import Section from '../../view-details/section';
import { ApplicantExtras } from '../../../enums/applicants/applicant-extras.enum';
import styles from '../../../styles/digitalhiringapp.module.css';

// Import legal attachment components
import DisclosureAttachment from '../jotform/voe-forms/legal-attachments/disclosure-attachment';
import { VerificationOfEmploymentSection1 } from '../jotform/voe-forms/legal-attachments/voe-attachments/section-1';
import ConsentAlcoholDrug from '../jotform/voe-forms/legal-attachments/consent-alcohol-drug';
import ApplicantInfoReleaseConsent from '../jotform/voe-forms/legal-attachments/applicant-info-release-consent';

export interface ApplicantSignedAgreementsFormProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
}

// Document configuration mapping signatures to their content components
const DOCUMENT_CONFIGURATIONS = [
  {
    id: 'verification-of-employment',
    title: 'Verification of Employment',
    description: 'Safety Performance History Records Request',
    signatureField: 'SIGNATURE_VOE_AUTHORIZATION',
    dateField: 'APPLY_DATE',
    contentComponent: VerificationOfEmploymentSection1,
  },
  {
    id: 'disclosure-authorization',
    title: 'Disclosure & Authorization',
    description: 'Background check authorization and disclosure',
    signatureField: 'SIGNATURE_DISCLOSURE_AUTHORIZATION',
    dateField: 'DISCLOSURE_AND_AUTHORIZATION_DATE',
    contentComponent: ApplicantInfoReleaseConsent,
  },
  {
    id: 'important-disclosure-background',
    title: 'Important Disclosure - Background PSP',
    description: 'Pre-employment Screening Program disclosure',
    signatureField: 'SIGNATURE_IMPORTANT_BACKGROUND',
    dateField: 'IMPORTANT_DISCLOSURE_BACKGROUND_DATE',
    contentComponent: DisclosureAttachment,
  },
  {
    id: 'general-consent-queries',
    title: 'General Consent for Queries',
    description: 'Drug & Alcohol Clearinghouse consent',
    signatureField: 'SIGNATURE_GENERAL_CONSENT',
    dateField: 'APPLY_DATE',
    contentComponent: ConsentAlcoholDrug,
  },
];

export function ApplicantSignedAgreementsForm(props: ApplicantSignedAgreementsFormProps) {
  const { className, entity } = props;
  const { t } = useTranslation();
  const [expandedDocuments, setExpandedDocuments] = useState<{ [key: string]: boolean }>({});
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  // Get all agreements with document configurations
  const agreements = DOCUMENT_CONFIGURATIONS.map((doc) => {
    const signatureExtra = entity?.extras?.find((extra) => extra.type === doc.signatureField);
    const dateExtra = doc.dateField
      ? entity?.extras?.find((extra) => extra.type === doc.dateField)
      : null;

    return {
      ...doc,
      isSigned: !!(signatureExtra?.value && signatureExtra.value.startsWith('data:image')),
      signatureValue: signatureExtra?.value || null,
      signedDate: dateExtra?.value || null,
      signatureExtra,
      dateExtra,
    };
  });

  // Function to format date from string
  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return t('UNKNOWN_DATE');
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (error) {
      return t('UNKNOWN_DATE');
    }
  };

  // Toggle document content expansion
  const toggleDocument = (docId: string) => {
    setExpandedDocuments((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  // Toggle section expansion
  const toggleSection = (docId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <Form className={className}>
        <Row>
          <Col md="12" className="p-0 px-lg-2">
            <Section title="SIGNED_AGREEMENTS">
              {agreements.length > 0 ? (
                <div className="mt-3">
                  {agreements.map((agreement, index) => (
                    <div key={agreement.id} className="mb-4 border rounded">
                      {/* Document Header - Always visible and clickable */}
                      <div
                        className="p-3 bg-light border-bottom cursor-pointer"
                        onClick={() => toggleSection(agreement.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {expandedSections[agreement.id] ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold">{agreement.title}</h6>
                              <small className="text-muted">{agreement.description}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {agreement.isSigned ? (
                              <Badge bg="success" className="d-flex align-items-center">
                                <i className="fas fa-check-circle me-1"></i>
                                {t('SIGNED')}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">{t('NOT_SIGNED')}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Document Content - Collapsible */}
                      {expandedSections[agreement.id] && (
                        <div className="p-3" style={{ animation: 'fadeIn 0.2s ease-in' }}>
                          {agreement.isSigned ? (
                            <>
                              {/* Signature Section */}
                              <div className="border-top pt-3">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <div />
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDocument(agreement.id);
                                    }}
                                    className="d-flex align-items-center"
                                  >
                                    <FileText size={14} className="me-1" />
                                    {expandedDocuments[agreement.id] ? 'Hide' : 'View'} Document
                                    {expandedDocuments[agreement.id] ? (
                                      <ChevronUp size={14} className="ms-1" />
                                    ) : (
                                      <ChevronDown size={14} className="ms-1" />
                                    )}
                                  </Button>
                                </div>

                                {/* Document Content (when expanded) */}
                                {expandedDocuments[agreement.id] && (
                                  <div className="mb-4 p-3 border rounded bg-white">
                                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                      {React.createElement(agreement.contentComponent, {
                                        applicant: entity,
                                        ...(agreement.id === 'verification-of-employment' && {
                                          employer:
                                            entity?.employers?.find((e) => e.is_current) ||
                                            entity?.employers?.[0],
                                        }),
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className="text-center">
                                  <div className="mb-3">
                                    <Image
                                      src={agreement.signatureValue}
                                      alt={`${agreement.title} Signature`}
                                      fluid
                                      className="border rounded"
                                      style={{
                                        maxHeight: '120px',
                                        maxWidth: '300px',
                                        objectFit: 'contain',
                                        backgroundColor: '#f8f9fa',
                                      }}
                                    />
                                  </div>
                                  <div className="text-muted">
                                    <small>
                                      <strong>Signed by:</strong> {entity?.first_name}{' '}
                                      {entity?.last_name}
                                    </small>
                                    <br />
                                    <small>
                                      <strong>Date:</strong> {formatDate(agreement.signedDate)}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center text-muted py-4">
                              <i className="fas fa-file-signature fa-2x mb-3 text-secondary"></i>
                              <p className="mb-0">{t('SIGNATURE_NOT_AVAILABLE')}</p>
                              <small>This document has not been signed yet.</small>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-file-contract fa-3x mb-3 text-secondary"></i>
                  <p className="mb-0">{t('NO_SIGNED_AGREEMENTS')}</p>
                  <small>No legal documents have been configured for this applicant.</small>
                </div>
              )}
            </Section>
          </Col>
        </Row>
      </Form>
    </>
  );
}
