import React, { useMemo, memo } from 'react';
import { CheckCircleFill, Shield, PenFill, InfoCircle } from 'react-bootstrap-icons';
import { CompanyPreferenceEnhancementLabel } from '../../../../../enums/company/company-preference-enhancement-label.enum';

interface DocumentRequirementsProps {
  document: any;
  form: any;
  companyPreferences: any[];
  isComplete: boolean;
  onSignClick: () => void;
}

export const DocumentRequirements = memo(function DocumentRequirements({
  document,
  form,
  companyPreferences,
  isComplete,
  onSignClick,
}: DocumentRequirementsProps) {
  // SSN handling for verification of employment - memoized
  const ssnRequired = useMemo(() => {
    return (
      document.ssnRequired &&
      companyPreferences?.find((v) => v.label === CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA)
        ?.value
    );
  }, [document.ssnRequired, companyPreferences]);

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

  return (
    <div className="document-requirements-panel">
      {/* Header */}
      <div className="mb-3">
        <h5 className="mb-2" style={{ display: 'flex', alignItems: 'center', color: '#495057' }}>
          <Shield className="me-2 text-primary" size={20} />
          Document Requirements
        </h5>
        <p className="text-muted small mb-0">
          Complete the requirements below to sign this document
        </p>
      </div>

      {/* Status Card */}
      <div
        className="mb-4"
        style={{
          border: `2px solid ${isComplete ? '#198754' : '#ffc107'}`,
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: isComplete ? '#198754' : '#ffc107',
            color: isComplete ? 'white' : '#000',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          {isComplete ? (
            <CheckCircleFill className="me-2" size={20} />
          ) : (
            <InfoCircle className="me-2" size={20} />
          )}
          {isComplete ? 'Document Completed' : 'Signature Required'}
        </div>
        <div style={{ padding: '1rem', backgroundColor: 'white' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
            {isComplete
              ? 'This document has been successfully signed and completed.'
              : 'Please complete all requirements to sign this document.'}
          </p>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="mb-4">
        <h6 className="mb-3">Checklist</h6>
        {requirements.map((req, index) => (
          <div key={index} className="d-flex align-items-center mb-2">
            <div className="me-2">
              {req.met ? (
                <CheckCircleFill className="text-success" size={16} />
              ) : (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '1px solid #6c757d',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                  }}
                />
              )}
            </div>
            <span className={`small ${req.met ? 'text-success' : 'text-muted'}`}>
              {req.label}
              {req.required && <span className="text-danger ms-1">*</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div
        className="mb-4 p-3 rounded"
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
        }}
      >
        <div className="row text-center">
          <div className="col-6">
            <div className="fw-bold text-primary">
              {requirements.filter((r) => r.met).length}/{requirements.length}
            </div>
            <small className="text-muted">Complete</small>
          </div>
          <div className="col-6">
            <div className={`fw-bold ${isComplete ? 'text-success' : 'text-warning'}`}>
              {isComplete ? 'Signed' : 'Pending'}
            </div>
            <small className="text-muted">Status</small>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="d-grid">
        <button
          type="button"
          onClick={onSignClick}
          style={{
            backgroundColor: isComplete ? '#198754' : '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = isComplete ? '#157347' : '#0b5ed7';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = isComplete ? '#198754' : '#0d6efd';
          }}
        >
          <PenFill size={16} />
          {isComplete ? 'View Signature' : 'Sign Document'}
        </button>
      </div>

      {/* Help Text */}
      {!isComplete && (
        <div
          className="mt-3 p-2 rounded"
          style={{
            backgroundColor: '#cff4fc',
            border: '1px solid #b6effb',
            color: '#055160',
          }}
        >
          <small style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <InfoCircle className="me-1" size={12} />
            Click &quot;Sign Document&quot; to open the full signature interface where you can draw
            or type your signature.
          </small>
        </div>
      )}

      {/* Legal Notice */}
      <div
        className="mt-4 p-2 rounded"
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
        }}
      >
        <small className="text-muted">
          <strong>Legal Notice:</strong> Your electronic signature has the same legal effect as a
          handwritten signature.
        </small>
      </div>
    </div>
  );
});
