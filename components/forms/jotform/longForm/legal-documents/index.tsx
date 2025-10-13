import { useFormik } from 'formik';
import { useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FileText, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantEntity } from '../../../../../models/applicant';
import { AccordianDto } from '../../../../../models/jot-form/long-form/accordian.dto';
import ApplicantApi from '../../../../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { CompanyPreferenceEnhancementLabel } from '../../../../../enums/company/company-preference-enhancement-label.enum';
import { ApplicantExtrasEntity } from '../../../../../models/applicant';
import DocumentStepper from './document-stepper';
import { DocumentPreview } from './document-preview';
import { DocumentSignature } from './document-signature';
import { LegalDocumentProvider, useLegalDocuments } from './legal-documents-context';
import { FormActions, SecondaryButton, PrimaryButton } from '../../form-buttons';
import { Banner } from '../../../../shared/dha';
import CompanyApi from '../../../../../pages/api/company';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../../../enums/applicants/applicant-extras.enum';

// Document definitions with metadata and summaries
export const LEGAL_DOCUMENTS = [
  {
    id: 'verification-of-employment',
    title: 'Verification of Employment',
    description: 'Safety Performance History Records Request',
    summary:
      'This form authorizes us to request your employment history and safety records from previous employers. This is required by DOT regulations to verify your driving experience and safety performance.',
    consentStatement:
      'I consent to the release of my safety performance history records, including drug and alcohol test results, violations, and employment information from my previous employers for verification purposes.',
    component: 'VerificationOfEmployment',
    signatureField: 'SIGNATURE_VOE_AUTHORIZATION',
    dateField: null,
    ssnRequired: false,
    showSsn: true,
    completionCheck: (form, companyPreferences) => {
      const isSignatureComplete = !!form.values.SIGNATURE_VOE_AUTHORIZATION?.value;
      // SSN is now completely optional regardless of company preferences
      return isSignatureComplete;
    },
  },
  {
    id: 'disclosure-authorization',
    title: 'Disclosure & Authorization',
    description: 'Background check authorization and disclosure',
    summary:
      'This document provides notice that we may obtain background check information about you and authorizes us to conduct such checks as part of the employment process.',
    consentStatement:
      'I consent to and authorize the company to obtain background reports about me from third parties, including but not limited to criminal history, employment verification, and other relevant background information.',
    component: 'DisclosureAuthorization',
    signatureField: 'SIGNATURE_DISCLOSURE_AUTHORIZATION',
    dateField: 'DISCLOSURE_AND_AUTHORIZATION_DATE',
    ssnRequired: false,
    showSsn: false,
    completionCheck: (form) =>
      !!form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION?.value &&
      !!form.values.DISCLOSURE_AND_AUTHORIZATION_DATE?.value,
  },
  {
    id: 'important-disclosure-background',
    title: 'Important Disclosure - Background PSP',
    description: 'Pre-employment Screening Program disclosure',
    summary:
      'This disclosure provides important information about the Pre-employment Screening Program (PSP) and your rights regarding background investigations.',
    consentStatement:
      'I consent to the company accessing my Pre-employment Screening Program (PSP) record from the FMCSA, including crash data, inspection results, and any safety violations associated with my commercial driving record.',
    component: 'ImportantDisclosureBackgroundPsp',
    signatureField: 'SIGNATURE_IMPORTANT_BACKGROUND',
    dateField: 'IMPORTANT_DISCLOSURE_BACKGROUND_DATE',
    ssnRequired: false,
    showSsn: false,
    completionCheck: (form) =>
      !!form.values.SIGNATURE_IMPORTANT_BACKGROUND?.value &&
      !!form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE?.value,
  },
  {
    id: 'general-consent-queries',
    title: 'General Consent for Queries',
    description: 'Drug & Alcohol Clearinghouse consent',
    summary:
      'This consent allows us to query the FMCSA Drug and Alcohol Clearinghouse to check for any drug or alcohol violations on your record.',
    consentStatement:
      'I consent to the company querying the FMCSA Drug and Alcohol Clearinghouse to obtain information about any drug or alcohol program violations associated with my commercial driver license.',
    component: 'GeneralConsentQueries',
    signatureField: 'SIGNATURE_GENERAL_CONSENT',
    dateField: null,
    ssnRequired: false,
    showSsn: false,
    completionCheck: (form) =>
      !!form.values.SIGNATURE_GENERAL_CONSENT?.value &&
      !!form.values.GENERAL_CONSENT?.value?.consentGiven,
  },
];

function LegalDocumentsContent() {
  const {
    state: { applicantExtras, applicant, jobs, company, companyPreferences },
    method: { stepBack, updateApplicantExtras, stepNext },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const { currentStep, setCurrentStep, completedDocuments, setCompletedDocuments } =
    useLegalDocuments();

  // Track document expansion state
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track initialization to prevent multiple setValues calls
  const isInitialized = useRef(false);
  const lastApplicantId = useRef(null);
  const lastExtrasLength = useRef(0);

  const form = useFormik({
    initialValues: new AccordianDto(),
    validationSchema: AccordianDto.yupSchema(),
    onSubmit: async (values) => {
      const applicantApi = new ApplicantApi();
      const companyApi = new CompanyApi();

      applicant.ssn = values.ssn;

      try {
        const filtered_extras = applicantExtras?.filter(
          (v) => v?.value != null || v?.value != undefined
        );

        // DOT verification: call backend and append tokens as DOT_VERIFICATION_RESULTS
        try {
          const dot_number = applicantExtras?.find((e) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value;
          const business_name = applicantExtras?.find((e) => e.type === ApplicantExtrasEnum.BUSINESS_NAME)?.value;
          if (dot_number) {
            const tokens = await companyApi.dotVerify({
              dot_number,
              email: applicant?.email,
              phone: applicant?.phone,
              address_1: applicant?.address_1 || applicant?.street,
              city: applicant?.city,
              state: applicant?.state,
              zip_code: applicant?.zip_code,
              business_name,
            });
            filtered_extras.push({
              type: ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS,
              value: Array.isArray(tokens) && tokens.length ? tokens[0] : [],
            } as any);
          }
        } catch (e) {
          console.warn('DOT verification failed; proceeding without tokens', e);
          filtered_extras.push({
            type: ApplicantExtrasEnum.DOT_VERIFICATION_RESULTS,
            value: [],
          } as any);
        }

        let response: ApplicantEntity;
        if (applicant?.id) {
          response = await applicantApi.jotform.update(
            applicant.id,
            {
              applicant,
              applicantExtras: filtered_extras,
              jobs,
            },
            {
              params: {
                completeApplication: 'true',
              },
            }
          );
        } else {
          response = await applicantApi.jotform.create(company.id, {
            applicant,
            applicantExtras: filtered_extras,
            jobs,
          });
        }

        if (response) stepNext();
      } catch (error) {
        console.log(error);

        // Check if it's a conflict error with a translatable message
        if (error?.response?.data?.statusCode === 409 && error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          // Use the global handler for other types of errors
          globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
        }
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  // Initialize form values from existing applicant data - only run when data actually changes
  useEffect(() => {
    const applicantChanged = applicant?.id !== lastApplicantId.current;
    const extrasChanged = applicantExtras?.length !== lastExtrasLength.current;

    if (!isInitialized.current || applicantChanged || extrasChanged) {
      const newValues = { ...new AccordianDto() };

      // Initialize SSN
      if (applicant?.ssn) {
        newValues.ssn = applicant.ssn;
      }

      // Initialize signatures and dates from applicantExtras
      const extraMap = {
        SIGNATURE_VOE_AUTHORIZATION: ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
        SIGNATURE_DISCLOSURE_AUTHORIZATION: ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
        SIGNATURE_IMPORTANT_BACKGROUND: ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
        SIGNATURE_GENERAL_CONSENT: ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
        DISCLOSURE_AND_AUTHORIZATION_DATE: ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE,
        IMPORTANT_DISCLOSURE_BACKGROUND_DATE: ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE,
        GENERAL_CONSENT: ApplicantExtras.GENERAL_CONSENT,
      };

      Object.entries(extraMap).forEach(([formField, extraType]) => {
        const existingExtra = applicantExtras?.find((v) => v.type === extraType);
        if (existingExtra) {
          newValues[formField] = existingExtra;
        } else {
          // Create empty entity for missing fields
          newValues[formField] = new ApplicantExtrasEntity(extraType);
        }
      });

      // Set default dates for date fields if they don't exist
      if (!newValues.DISCLOSURE_AND_AUTHORIZATION_DATE?.value) {
        const dateEntity = new ApplicantExtrasEntity(
          ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
        );
        dateEntity.value = new Date().toISOString();
        newValues.DISCLOSURE_AND_AUTHORIZATION_DATE = dateEntity;
      }

      if (!newValues.IMPORTANT_DISCLOSURE_BACKGROUND_DATE?.value) {
        const dateEntity = new ApplicantExtrasEntity(
          ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
        );
        dateEntity.value = new Date().toISOString();
        newValues.IMPORTANT_DISCLOSURE_BACKGROUND_DATE = dateEntity;
      }

      if (!newValues.GENERAL_CONSENT?.value) {
        newValues.GENERAL_CONSENT = new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT);
      }

      form.setValues(newValues);

      // Update tracking variables
      isInitialized.current = true;
      lastApplicantId.current = applicant?.id;
      lastExtrasLength.current = applicantExtras?.length || 0;
    }
  }, [applicant?.id, applicant?.ssn, applicantExtras?.length]);

  // Update applicant extras when form values change - replicate accordion behavior
  useEffect(() => {
    if (!isInitialized.current) return;

    updateApplicantExtras(form.values.DISCLOSURE_AND_AUTHORIZATION_DATE);
    updateApplicantExtras(form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);
    updateApplicantExtras(form.values.GENERAL_CONSENT);
    updateApplicantExtras(form.values.SIGNATURE_VOE_AUTHORIZATION);
    updateApplicantExtras(form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION);
    updateApplicantExtras(form.values.SIGNATURE_IMPORTANT_BACKGROUND);
    updateApplicantExtras(form.values.SIGNATURE_GENERAL_CONSENT);

    // Trigger form validation after applicant extras are updated
    form.validateForm().then(() => {
      form.setTouched(
        {
          SIGNATURE_VOE_AUTHORIZATION: { value: true },
          SIGNATURE_DISCLOSURE_AUTHORIZATION: { value: true },
          SIGNATURE_IMPORTANT_BACKGROUND: { value: true },
          SIGNATURE_GENERAL_CONSENT: { value: true },
        },
        true
      );
    });
  }, [form.values]);

  // Calculate completed documents - memoized to prevent unnecessary recalculations
  const completedDocumentIds = useMemo(() => {
    if (!isInitialized.current) return [];

    return LEGAL_DOCUMENTS.filter((doc) => doc.completionCheck(form, companyPreferences)).map(
      (doc) => doc.id
    );
  }, [
    form.values.SIGNATURE_VOE_AUTHORIZATION?.value,
    form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION?.value,
    form.values.SIGNATURE_IMPORTANT_BACKGROUND?.value,
    form.values.SIGNATURE_GENERAL_CONSENT?.value,
    form.values.DISCLOSURE_AND_AUTHORIZATION_DATE?.value,
    form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE?.value,
    form.values.GENERAL_CONSENT?.value?.consentGiven,
    form.values.ssn,
    companyPreferences,
  ]);

  // Update completed documents only when the calculation changes
  useEffect(() => {
    setCompletedDocuments(completedDocumentIds);
  }, [completedDocumentIds, setCompletedDocuments]);

  // Check if all documents are completed
  const allDocumentsComplete = completedDocuments.length === LEGAL_DOCUMENTS.length;

  const currentDocument = LEGAL_DOCUMENTS[currentStep];
  const isCurrentDocumentComplete = completedDocuments.includes(currentDocument.id);

  const handleNext = useCallback(() => {
    // Find next incomplete document
    const currentDocumentComplete = completedDocuments.includes(currentDocument.id);

    if (currentDocumentComplete) {
      // Current document is complete, find next incomplete document
      const nextIncompleteIndex = LEGAL_DOCUMENTS.findIndex(
        (doc, index) => index > currentStep && !completedDocuments.includes(doc.id)
      );

      if (nextIncompleteIndex !== -1) {
        setCurrentStep(nextIncompleteIndex);
      }
    }
    // If current document is not complete, stay on current document (button should be disabled)
  }, [currentStep, completedDocuments, currentDocument.id, setCurrentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      stepBack();
    }
  }, [currentStep, setCurrentStep, stepBack]);

  // Reset document expansion when switching documents
  useEffect(() => {
    setIsDocumentExpanded(false);
    // Scroll to top when switching documents
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  console.log(form.isValid);
  console.log(form.errors);
  console.log(form.values);

  return (
    <>
      <ToastContainer />
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0.75rem',
          }}
          className="px-lg-4"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
              {t('FORMS_TO_SIGNUP')}
            </h1>
            <p className="text-muted mb-4">
              Please review and sign the required legal documents to complete your application.
            </p>
          </div>

          {errorMessage && (
            <Banner
              message={t(errorMessage)}
              variant="error"
              onDismiss={() => setErrorMessage(null)}
            />
          )}

          {/* Progress Stepper */}
          <DocumentStepper
            documents={LEGAL_DOCUMENTS}
            currentStep={currentStep}
            completedDocuments={completedDocuments}
            onStepClick={setCurrentStep}
            form={form}
            companyPreferences={companyPreferences}
          />

          {/* Document Content - Single Page Layout */}
          <div className="mt-4">
            {/* Document Title */}
            <div className="mb-4">
              <h2 className="mb-2 fs-3 fs-lg-2">{currentDocument.title}</h2>
              <p className="text-muted mb-0 fs-6">{currentDocument.description}</p>
            </div>

            {/* Document Summary */}
            <div className="mb-4 p-3 p-lg-4 bg-light rounded">
              <h5 className="mb-3 fs-5">What is this document for?</h5>
              <p className="mb-0 lh-base">{currentDocument.summary}</p>
            </div>

            {/* Collapsible Document Content */}
            <div className="mb-4">
              <SecondaryButton
                type="button"
                onClick={() => setIsDocumentExpanded(!isDocumentExpanded)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  fontSize: '0.95rem',
                }}
                className="text-start"
              >
                <span className="d-flex align-items-center">
                  <FileText size={16} className="me-2 flex-shrink-0" />
                  <span className="d-none d-sm-inline">
                    {isDocumentExpanded ? 'Hide' : 'View'} Full Document Content
                  </span>
                  <span className="d-inline d-sm-none">
                    {isDocumentExpanded ? 'Hide' : 'View'} Document
                  </span>
                </span>
                {isDocumentExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </SecondaryButton>

              {isDocumentExpanded && (
                <div
                  className="mt-3 p-3 border rounded"
                  style={{
                    backgroundColor: '#fff',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                  }}
                >
                  <DocumentPreview
                    document={currentDocument}
                    form={form}
                    applicant={applicant}
                    company={company}
                  />
                </div>
              )}
            </div>

            {/* Signature Fields Section */}
            <div className="mb-4">
              <DocumentSignature
                document={currentDocument}
                form={form}
                applicant={applicant}
                companyPreferences={companyPreferences}
                isComplete={isCurrentDocumentComplete}
                fullWidth={false}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 pt-4 border-top">
            {/* Progress Text - Mobile First */}
            <div className="text-center mb-3 d-block d-lg-none">
              <small className="text-muted">
                {completedDocuments.length} of {LEGAL_DOCUMENTS.length} documents completed
              </small>
            </div>

            {/* Desktop Navigation */}
            <div className="d-none d-lg-flex justify-content-between align-items-center">
              <SecondaryButton type="reset" style={{ minWidth: '120px' }}>
                {t('BACK')}
              </SecondaryButton>

              <div className="text-center">
                <small className="text-muted">
                  {completedDocuments.length} of {LEGAL_DOCUMENTS.length} documents completed
                </small>
              </div>

              {allDocumentsComplete ? (
                <PrimaryButton
                  type="submit"
                  disabled={form.isSubmitting}
                  style={{
                    minWidth: '200px',
                    background: form.isSubmitting
                      ? undefined
                      : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  }}
                >
                  {form.isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Application'
                  )}
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentDocumentComplete || form.isSubmitting}
                  style={{ minWidth: '180px' }}
                >
                  {isCurrentDocumentComplete
                    ? 'Next Document'
                    : `${LEGAL_DOCUMENTS.length - completedDocuments.length} Remaining`}
                </PrimaryButton>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="d-block d-lg-none">
              <div className="row g-2">
                <div className="col-6">
                  <SecondaryButton
                    type="reset"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    {t('BACK')}
                  </SecondaryButton>
                </div>
                <div className="col-6">
                  {allDocumentsComplete ? (
                    <PrimaryButton
                      type="submit"
                      disabled={form.isSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '0.95rem',
                        background: form.isSubmitting
                          ? undefined
                          : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                      }}
                    >
                      {form.isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" />
                          Submitting...
                        </>
                      ) : (
                        'Complete'
                      )}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      type="button"
                      onClick={handleNext}
                      disabled={!isCurrentDocumentComplete || form.isSubmitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '0.95rem',
                      }}
                    >
                      {isCurrentDocumentComplete ? 'Next' : 'Sign First'}
                    </PrimaryButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}

export function LegalDocumentsPage() {
  return (
    <LegalDocumentProvider>
      <LegalDocumentsContent />
    </LegalDocumentProvider>
  );
}
