import React, { useMemo, memo } from 'react';
import { VerificationOfEmployment } from '../accordian/verification-of-employment';
import { DisclosureAuthorization } from '../accordian/disclosure-authorization';
import { ImportantDisclosureBackgroundPsp } from '../accordian/important-disclosure-background-psp';
import { GeneralConsentQueries } from '../accordian/general-consent-queries';

interface DocumentPreviewProps {
  document: any;
  form: any;
  applicant: any;
  company: any;
}

export const DocumentPreview = memo(function DocumentPreview({
  document,
  form,
}: DocumentPreviewProps) {
  // Render the appropriate document component - memoized
  const renderDocumentContent = useMemo(() => {
    const componentProps = {
      form,
      hideSSNInput: true, // Pass flag to hide SSN inputs
      hideSignature: true, // Pass flag to hide signature components
      readOnly: true, // Make it read-only for display
    };

    switch (document.component) {
      case 'VerificationOfEmployment':
        return <VerificationOfEmployment {...componentProps} />;
      case 'DisclosureAuthorization':
        return <DisclosureAuthorization {...componentProps} />;
      case 'ImportantDisclosureBackgroundPsp':
        return <ImportantDisclosureBackgroundPsp {...componentProps} />;
      case 'GeneralConsentQueries':
        return <GeneralConsentQueries {...componentProps} />;
      default:
        return <div>Document not found</div>;
    }
  }, [document.component, form]);

  return (
    <div className="document-preview-container">
      {/* Document Header */}
      <div className="mb-3">
        <h5 className="mb-2">{document.title}</h5>
        <p className="text-muted small mb-0">{document.description}</p>
      </div>

      {/* Document Content */}
      <div
        className="document-content"
        style={{
          backgroundColor: '#fff',
        }}
      >
        {renderDocumentContent}
      </div>
    </div>
  );
});
