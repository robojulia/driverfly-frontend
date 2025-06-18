import React, { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { CheckCircleFill, PenFill, Shield, InfoCircle, ArrowLeft } from 'react-bootstrap-icons';
import { SignatureComponent } from '../../../signature';
import { ApplicantExtrasEntity } from '../../../../../models/applicant';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { CompanyPreferenceEnhancementLabel } from '../../../../../enums/company/company-preference-enhancement-label.enum';
import styles from '../../../../../styles/digitalhiringapp.module.css';

interface DocumentSignatureProps {
  document: any;
  form: any;
  applicant: any;
  companyPreferences: any[];
  isComplete: boolean;
  fullWidth?: boolean;
  onComplete?: () => void;
}

export const DocumentSignature = memo(function DocumentSignature({
  document,
  form,
  applicant,
  companyPreferences,
  isComplete,
  fullWidth = false,
  onComplete,
}: DocumentSignatureProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [maskedValue, setMaskedValue] = useState('');
  const inputRef = useRef(null);

  // SSN handling for verification of employment - memoized
  const ssnRequired = useMemo(() => {
    return (
      document.ssnRequired &&
      companyPreferences?.find((v) => v.label === CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA)
        ?.value
    );
  }, [document.ssnRequired, companyPreferences]);

  // Format SSN in XXX-XX-XXXX pattern - memoized
  const formatSSN = useCallback((value: string) => {
    if (!value) return '';
    const ssn = value.replace(/\D/g, '');
    const cleaned = ssn.slice(0, 9);

    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 9)}`;
    }
  }, []);

  // Initialize display value when SSN changes - only when actual SSN changes
  useEffect(() => {
    if (form.values.ssn) {
      const formattedSSN = formatSSN(form.values.ssn);
      setMaskedValue(formattedSSN);
    } else {
      setMaskedValue('');
    }
  }, [form.values.ssn, formatSSN]);

  // Handle input change for SSN - memoized
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const rawValue = inputValue.replace(/\D/g, '');

      form.setFieldValue('ssn', rawValue);
      const formatted = formatSSN(rawValue);
      setDisplayValue(formatted);
    },
    [form, formatSSN]
  );

  // Handle input focus for SSN - memoized
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (form.values.ssn) {
      setDisplayValue(formatSSN(form.values.ssn));
    } else {
      setDisplayValue('');
    }
  }, [form.values.ssn, formatSSN]);

  // Handle input blur for SSN - memoized
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      const currentValue = form.values.ssn || displayValue.replace(/\D/g, '');

      if (currentValue) {
        const rawValue = currentValue.replace(/\D/g, '');
        form.setFieldValue('ssn', rawValue);
        setMaskedValue(formatSSN(rawValue));
      }

      form.handleBlur(e);
    },
    [form, displayValue, formatSSN]
  );

  // Handle signature change - memoized
  const handleSignatureChange = useCallback(
    (signature: string | null) => {
      // Map signature field to correct ApplicantExtras enum
      const fieldToEnumMap = {
        SIGNATURE_VOE_AUTHORIZATION: ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
        SIGNATURE_DISCLOSURE_AUTHORIZATION: ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
        SIGNATURE_IMPORTANT_BACKGROUND: ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
        SIGNATURE_GENERAL_CONSENT: ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
      };

      const signatureEntity = new ApplicantExtrasEntity(fieldToEnumMap[document.signatureField]);
      signatureEntity.value = signature;
      form.setFieldValue(document.signatureField, signatureEntity);

      // Special handling for general consent - exactly like accordion
      if (document.id === 'general-consent-queries') {
        if (signature) {
          const generalConsentEntity = new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT);
          generalConsentEntity.value = {
            consentGiven: true,
            consentDate: new Date().toISOString(),
            name: `${applicant?.first_name} ${applicant?.last_name}`,
            employer_name: applicant?.company?.name || '',
            cdl_license_number: applicant?.license_number || '',
            expiration_date: new Date().toISOString(),
          };
          form.setFieldValue('GENERAL_CONSENT', generalConsentEntity);
        }
      }

      // Auto-set date if required
      if (document.dateField && signature) {
        const dateFieldToEnumMap = {
          DISCLOSURE_AND_AUTHORIZATION_DATE: ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE,
          IMPORTANT_DISCLOSURE_BACKGROUND_DATE:
            ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE,
        };

        const dateEntity = new ApplicantExtrasEntity(dateFieldToEnumMap[document.dateField]);
        dateEntity.value = new Date().toISOString();
        form.setFieldValue(document.dateField, dateEntity);
      }

      // Call onComplete callback if signature is complete and all requirements met
      if (signature && onComplete) {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    },
    [document, form, applicant, onComplete]
  );

  // Requirements status - memoized
  const requirements = useMemo(() => {
    const reqs = [];

    if (ssnRequired) {
      reqs.push({
        label: 'Social Security Number',
        met: form.values.ssn && form.values.ssn.length === 9,
        required: true,
      });
    }

    reqs.push({
      label: 'Digital Signature',
      met: !!form.values[document.signatureField]?.value,
      required: true,
    });

    if (document.dateField) {
      reqs.push({
        label: 'Date',
        met: !!form.values[document.dateField]?.value,
        required: true,
      });
    }

    return reqs;
  }, [
    ssnRequired,
    form.values.ssn,
    form.values[document.signatureField]?.value,
    form.values[document.dateField]?.value,
    document.signatureField,
    document.dateField,
  ]);

  const allRequirementsMet = useMemo(() => {
    return requirements.filter((r) => r.required).every((r) => r.met);
  }, [requirements]);

  // Full width layout
  if (fullWidth) {
    return (
      <div className="document-signature-full-width">
        {/* Header */}
        <div className="mb-4">
          <h2 className="mb-2">
            <PenFill className="me-3 text-primary" size={24} />
            Sign Document: {document.title}
          </h2>
          <p className="text-muted">
            Please complete all required fields below to electronically sign this document.
          </p>
        </div>

        <div className="row">
          {/* Left Column - Form Fields */}
          <div className="col-lg-4 mb-4">
            {/* Requirements Status */}
            <div className={`card mb-4 ${isComplete ? 'border-success' : 'border-warning'}`}>
              <div className={`card-header ${isComplete ? 'bg-success' : 'bg-warning'} text-white`}>
                <div className="d-flex align-items-center">
                  {isComplete ? (
                    <CheckCircleFill className="me-2" size={20} />
                  ) : (
                    <InfoCircle className="me-2" size={20} />
                  )}
                  <strong>{isComplete ? 'Document Completed' : 'Signature Required'}</strong>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6 className="mb-2">Requirements:</h6>
                  {requirements.map((req, index) => (
                    <div key={index} className="d-flex align-items-center mb-1">
                      <div className="me-2">
                        {req.met ? (
                          <CheckCircleFill className="text-success" size={14} />
                        ) : (
                          <div
                            className="rounded-circle border border-secondary"
                            style={{ width: '14px', height: '14px' }}
                          />
                        )}
                      </div>
                      <small className={req.met ? 'text-success' : 'text-muted'}>
                        {req.label}
                        {req.required && <span className="text-danger ms-1">*</span>}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SSN Input (if required) */}
            {ssnRequired && (
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Social Security Number <span className="text-danger">*</span>
                </label>
                <div className="mb-2">
                  {isFocused ? (
                    <input
                      ref={inputRef}
                      type="text"
                      name="ssn"
                      value={displayValue}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`form-control form-control-lg ${
                        form.touched.ssn && form.errors.ssn ? 'is-invalid' : ''
                      }`}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      required
                    />
                  ) : (
                    <input
                      type="password"
                      name="ssn"
                      value={maskedValue}
                      onFocus={handleFocus}
                      className={`form-control form-control-lg ${
                        form.touched.ssn && form.errors.ssn ? 'is-invalid' : ''
                      }`}
                      placeholder="XXX-XX-XXXX"
                      required
                      readOnly
                    />
                  )}
                  {form.touched.ssn && form.errors.ssn && (
                    <div className="invalid-feedback">{form.errors.ssn}</div>
                  )}
                </div>
                <small className="text-muted">
                  <Shield size={12} className="me-1" />
                  Your SSN is encrypted and protected. Click to edit.
                </small>
              </div>
            )}

            {/* Date Display (if applicable) */}
            {document.dateField && (
              <div className="mb-4">
                <label className="form-label fw-bold">Date</label>
                <div
                  className="form-control form-control-lg bg-light"
                  style={{ cursor: 'not-allowed' }}
                >
                  {form.values[document.dateField]?.value
                    ? new Date(form.values[document.dateField].value).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </div>
                <small className="text-muted">
                  Date will be automatically set when you sign the document.
                </small>
              </div>
            )}

            {/* Consent Statement */}
            <div className="mb-4">
              <div className={styles.alertInfo}>
                <h6 className={styles.alertInfoHeading}>
                  <InfoCircle className="me-2" size={16} />
                  By signing this document, you confirm:
                </h6>
                <p className={styles.alertInfoText}>&ldquo;{document.consentStatement}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Right Column - Signature Area */}
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <PenFill className="me-2" size={16} />
                  Digital Signature
                </h5>
              </div>
              <div className="card-body" style={{ minHeight: '400px' }}>
                <SignatureComponent
                  key={document.id}
                  firstName={applicant?.first_name}
                  lastName={applicant?.last_name}
                  onSignatureChange={handleSignatureChange}
                  initialSignature={form.values[document.signatureField]?.value}
                  required
                />
              </div>
            </div>

            {/* Success Message */}
            {isComplete && (
              <div className="alert alert-success mt-3">
                <CheckCircleFill className="me-2" size={16} />
                <strong>Signature Complete!</strong> This document has been successfully signed.
              </div>
            )}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-4 p-3 bg-light rounded">
          <small className="text-muted">
            <strong>Legal Notice:</strong> Your electronic signature has the same legal effect as a
            handwritten signature. This document will be digitally preserved with timestamp and
            authentication records.
          </small>
        </div>
      </div>
    );
  }

  // Original compact layout for sidebar
  return (
    <div className="document-signature-panel">
      {/* Completion Status */}
      <div className={`alert ${isComplete ? 'alert-success' : 'alert-info'} mb-4`}>
        <div className="d-flex align-items-center">
          {isComplete ? (
            <CheckCircleFill className="text-success me-2" size={20} />
          ) : (
            <InfoCircle className="text-info me-2" size={20} />
          )}
          <div>
            <h6 className="mb-0">{isComplete ? 'Document Completed' : 'Signature Required'}</h6>
            <small>
              {isComplete
                ? 'This document has been successfully signed and completed.'
                : 'Please complete the required fields below to sign this document.'}
            </small>
          </div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">
          <Shield className="me-2" size={16} />
          Requirements
        </h6>

        {requirements.map((req, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <div className="me-2">
              {req.met ? (
                <CheckCircleFill className="text-success" size={16} />
              ) : (
                <div
                  className="rounded-circle border border-secondary"
                  style={{ width: '16px', height: '16px' }}
                />
              )}
            </div>
            <span className={req.met ? 'text-success' : 'text-muted'}>
              {req.label}
              {req.required && <span className="text-danger ms-1">*</span>}
            </span>
          </div>
        ))}
      </div>

      {/* SSN Input (if required) */}
      {ssnRequired && (
        <div className="mb-4">
          <label className="form-label fw-bold">
            Social Security Number <span className="text-danger">*</span>
          </label>
          <div className="mb-2">
            {isFocused ? (
              <input
                ref={inputRef}
                type="text"
                name="ssn"
                value={displayValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`form-control ${
                  form.touched.ssn && form.errors.ssn ? 'is-invalid' : ''
                }`}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                required
              />
            ) : (
              <input
                type="password"
                name="ssn"
                value={maskedValue}
                onFocus={handleFocus}
                className={`form-control ${
                  form.touched.ssn && form.errors.ssn ? 'is-invalid' : ''
                }`}
                placeholder="XXX-XX-XXXX"
                required
                readOnly
              />
            )}
            {form.touched.ssn && form.errors.ssn && (
              <div className="invalid-feedback">{form.errors.ssn}</div>
            )}
          </div>
          <small className="text-muted">
            <Shield size={12} className="me-1" />
            Your SSN is encrypted and protected. Click to edit.
          </small>
        </div>
      )}

      {/* Consent Statement */}
      <div className="mb-4">
        <div className={styles.alertInfo}>
          <h6 className={styles.alertInfoHeading}>
            <InfoCircle className="me-2" size={16} />
            By signing this document, you confirm:
          </h6>
          <p className={styles.alertInfoText}>&ldquo;{document.consentStatement}&rdquo;</p>
        </div>
      </div>

      {/* Signature Section - Compact */}
      <div className="mb-4">
        <label className="form-label fw-bold">
          <PenFill className="me-2" size={14} />
          Digital Signature <span className="text-danger">*</span>
        </label>
        <div
          className="signature-container"
          style={{
            border: '2px solid var(--medium-gray)',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: 'var(--light)',
            borderColor: form.values[document.signatureField]?.value
              ? 'var(--success)'
              : 'var(--medium-gray)',
            minHeight: '200px',
          }}
        >
          <SignatureComponent
            key={document.id}
            firstName={applicant?.first_name}
            lastName={applicant?.last_name}
            onSignatureChange={handleSignatureChange}
            initialSignature={form.values[document.signatureField]?.value}
            required
          />
        </div>
        <small className="text-muted mt-2 d-block">
          By signing above, you agree to the terms and conditions of this document.
        </small>
      </div>

      {/* Date Display (if applicable) */}
      {document.dateField && (
        <div className="mb-4">
          <label className="form-label fw-bold">Date</label>
          <div className="form-control bg-light" style={{ cursor: 'not-allowed' }}>
            {form.values[document.dateField]?.value
              ? new Date(form.values[document.dateField].value).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </div>
          <small className="text-muted">
            Date will be automatically set when you sign the document.
          </small>
        </div>
      )}

      {/* Legal Notice */}
      <div className="mt-4 p-3 bg-light rounded">
        <small className="text-muted">
          <strong>Legal Notice:</strong> Your electronic signature has the same legal effect as a
          handwritten signature. This document will be digitally preserved with timestamp and
          authentication records.
        </small>
      </div>
    </div>
  );
});
