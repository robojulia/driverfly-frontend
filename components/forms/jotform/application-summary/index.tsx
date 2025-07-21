import React, { useContext } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import styles from '../../../../styles/digitalhiringapp.module.css';

interface SummarySection {
  title: string;
  stepNumber: number;
  summary: string; // Single line summary
}

export function ApplicationSummary() {
  const {
    state: { applicant, applicantExtras, jobs, companyJobs, company, isPrefilled },
    method: { setSteps },
  }: JotFormContextType = useContext(JotformContext);

  // Helper function to get extra value
  const getExtraValue = (type: string): any => {
    const extra = applicantExtras?.find((e) => e.type === type);
    return extra?.value;
  };

  // Helper function to format license type
  const formatLicenseType = (licenseType: any): string => {
    switch (licenseType) {
      case DriverLicenseType.NO_CDL:
        return 'No CDL';
      case DriverLicenseType.CDL_CLASS_A:
        return 'CDL Class A';
      case DriverLicenseType.CDL_CLASS_B:
        return 'CDL Class B';
      case DriverLicenseType.CDL_CLASS_C:
        return 'CDL Class C';
      default:
        return licenseType || 'Not specified';
    }
  };

  // Helper function to check if documents exist
  const hasDriverLicense = applicant?.documents?.some((doc) => doc.type === 'DRIVER_LICENSE');
  const hasMedicalCard = applicant?.documents?.some(
    (doc) => doc.type === 'MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD'
  );

  // Helper function to check signatures
  const hasSignatures = () => {
    const signatureTypes = [
      'SIGNATURE_GENERAL_CONSENT',
      'SIGNATURE_IMPORTANT_BACKGROUND',
      'SIGNATURE_DISCLOSURE_AUTHORIZATION',
      'SIGNATURE_VOE_AUTHORIZATION',
    ];
    const signedDocs = signatureTypes.filter((type) =>
      applicantExtras?.some((extra) => extra.type === type && extra.value)
    );
    return {
      total: signatureTypes.length,
      signed: signedDocs.length,
      allSigned: signedDocs.length === signatureTypes.length,
    };
  };

  const signatureStatus = hasSignatures();

  // Helper functions to check if history sections have actual content
  const hasAccidentHistory = () => {
    // Check if user said YES to accidents and has either count > 0 or actual entries
    const hasAccidentIndicator =
      applicant?.accident_count > 0 ||
      (applicant?.accident_history && applicant.accident_history.length > 0) ||
      (applicant?.accident_details &&
        applicant.accident_details.trim() !== '' &&
        applicant.accident_details !== '__YES_NO_DETAILS__');
    return hasAccidentIndicator;
  };

  const hasViolationHistory = () => {
    // Check if user said YES to violations and has either count > 0 or actual entries
    const hasViolationIndicator =
      applicant?.moving_violations_count > 0 ||
      (applicant?.moving_violation_history && applicant.moving_violation_history.length > 0) ||
      (applicant?.moving_violations_details &&
        applicant.moving_violations_details.trim() !== '' &&
        applicant.moving_violations_details !== '__YES_NO_DETAILS__');
    return hasViolationIndicator;
  };

  const hasCriminalHistory = () => {
    // Check if user said YES to criminal history and has actual content
    const hasCriminalIndicator =
      applicant?.criminal_history &&
      applicant.criminal_history.trim() !== '' &&
      applicant.criminal_history !== '__YES_NO_DETAILS__';
    return hasCriminalIndicator;
  };

  // Helper function to check if user has any DUI history
  const hasDuiHistory = () => {
    return applicant?.has_past_dui === true;
  };

  // Helper function to check if safety record has any data worth showing
  const hasSafetyRecordData = () => {
    const hasAccidents = applicant?.accident_count > 0 || hasAccidentHistory();
    const hasViolations = applicant?.moving_violations_count > 0 || hasViolationHistory();
    const cannotPassDrugTest = applicant?.can_pass_drug_test === false;
    const hasLicenseRevoked = applicant?.license_revoked === true;

    return hasAccidents || hasViolations || cannotPassDrugTest || hasLicenseRevoked;
  };

  // Build summary sections with single-line summaries
  const summarySections: SummarySection[] = [
    // Step 0-1: Jobs Selection
    {
      title: 'Job Selection',
      stepNumber: 1,
      summary:
        jobs?.length > 0
          ? `Selected ${jobs.length} job(s): ${jobs.map((job) => job.title).join(', ')}`
          : 'No jobs selected',
    },
    // Step 2: Phone Number (already verified)
    {
      title: 'Contact Information',
      stepNumber: 2,
      summary: applicant?.phone ? `Phone: ${applicant.phone}` : 'Phone number not provided',
    },
    // Step 3: Names and Basic Info
    {
      title: 'Basic Information',
      stepNumber: 3,
      summary: `${applicant?.first_name || ''} ${applicant?.last_name || ''} | ${
        applicant?.email || 'No email'
      } | ZIP: ${applicant?.zip_code || 'Not provided'}`,
    },
    // Step 4: CDL Experience
    {
      title: 'License & Experience',
      stepNumber: 4,
      summary: `${formatLicenseType(applicant?.license_type)} | ${
        applicant?.years_cdl_experience || 0
      } years experience | ${applicant?.is_owner_operator ? 'Owner Operator' : 'Company Driver'}`,
    },
    // License Details
    {
      title: 'License Details',
      stepNumber: 12, // Driving Experience step
      summary: `License #: ${applicant?.license_number || 'Not provided'} | State: ${
        applicant?.license_state || 'Not provided'
      } | Expires: ${
        applicant?.license_expiry
          ? new Date(applicant.license_expiry).toLocaleDateString()
          : 'Not provided'
      }`,
    },
    // Documents
    {
      title: 'Documents',
      stepNumber: 13, // Documents step
      summary: `Driver License: ${hasDriverLicense ? 'Uploaded' : 'Not uploaded'} | Medical Card: ${
        hasMedicalCard ? 'Uploaded' : 'Not uploaded'
      }`,
    },
    // Emergency Contact
    {
      title: 'Emergency Contact',
      stepNumber: 14, // Emergency contact step
      summary: applicant?.emergency_contact_name
        ? `${applicant.emergency_contact_name} (${
            applicant?.emergency_contact_relationship || 'No relationship'
          }) | ${applicant?.emergency_contact_number || 'No phone'}`
        : 'No emergency contact provided',
    },
    // Safety Record - only show if user has safety-related data
    ...(hasSafetyRecordData()
      ? [
          {
            title: 'Safety Record',
            stepNumber: 5,
            summary: `Drug Test: ${applicant?.can_pass_drug_test ? 'Yes' : 'No'} | Violations: ${
              applicant?.moving_violations_count || 0
            } | Accidents: ${applicant?.accident_count || 0} | License Revoked: ${
              applicant?.license_revoked ? 'Yes' : 'No'
            }`,
          },
        ]
      : []),
    // Accident History - only show if user has accidents
    ...(hasAccidentHistory()
      ? [
          {
            title: 'Accident History',
            stepNumber: 15, // Accident history step
            summary:
              applicant?.accident_count > 0
                ? `${applicant.accident_count} accident(s) reported${
                    applicant?.accident_details ? ' with details provided' : ''
                  }`
                : 'Accident history provided',
          },
        ]
      : []),
    // Violation History - only show if user has violations
    ...(hasViolationHistory()
      ? [
          {
            title: 'Violation History',
            stepNumber: 16, // Violation history step
            summary:
              applicant?.moving_violations_count > 0
                ? `${applicant.moving_violations_count} moving violation(s)${
                    applicant?.moving_violations_details ? ' with details provided' : ''
                  }`
                : 'Violation history provided',
          },
        ]
      : []),
    // Criminal History - only show if user has criminal history
    ...(hasCriminalHistory()
      ? [
          {
            title: 'Criminal History',
            stepNumber: 17, // Criminal history step
            summary: 'Criminal history disclosed',
          },
        ]
      : []),
    // Employment History - only show if they've provided employment information
    ...(() => {
      const hasEmployers = applicant?.employers?.length > 0;
      const hasCurrentEmployed = (applicant as any)?.is_current_employed !== undefined;
      const hasPreviousEmployed = (applicant as any)?.is_previous_employed !== undefined;

      // Only show employment section if they've answered employment questions or have employers
      if (hasCurrentEmployed || hasPreviousEmployed || hasEmployers) {
        return [
          {
            title: 'Employment History',
            stepNumber: 18, // Employment history step
            summary: hasEmployers
              ? `${applicant.employers.length} employer(s) provided`
              : 'Not currently employed',
          },
        ];
      }
      return [];
    })(),
    // DUI History - only show if user actually has DUI history
    ...(hasDuiHistory()
      ? [
          {
            title: 'DUI History',
            stepNumber: 7,
            summary: applicant?.has_past_dui
              ? `Past DUI: Yes${
                  applicant?.dui_years
                    ? ` (${
                        Array.isArray(applicant.dui_years)
                          ? applicant.dui_years.join(', ')
                          : applicant.dui_years
                      })`
                    : ''
                }`
              : 'Past DUI: No',
          },
        ]
      : []),
    // Step 6: Transmission & Endorsements
    {
      title: 'Equipment Experience',
      stepNumber: 6,
      summary: (() => {
        // Handle transmissions
        let transmissionText = 'None selected';
        if (Array.isArray(applicant?.transmission_type) && applicant.transmission_type.length > 0) {
          transmissionText = applicant.transmission_type.join(', ');
        } else if (applicant?.transmission_type && !Array.isArray(applicant.transmission_type)) {
          // Handle case where it might be a string (fallback)
          transmissionText = String(applicant.transmission_type);
        }

        // Handle endorsements
        let endorsementText = 'None selected';
        if (Array.isArray(applicant?.endorsements) && applicant.endorsements.length > 0) {
          endorsementText = applicant.endorsements.join(', ');
        } else if (applicant?.endorsements && !Array.isArray(applicant.endorsements)) {
          // Handle case where it might be a string (fallback)
          endorsementText = String(applicant.endorsements);
        }

        return `Transmissions: ${transmissionText} | Endorsements: ${endorsementText}`;
      })(),
    },
    // Step 8: Preferences
    {
      title: 'Job Preferences',
      stepNumber: 8,
      summary: applicant?.preferred_location
        ? `Preferred Locations: ${
            Array.isArray(applicant.preferred_location)
              ? applicant.preferred_location.join(', ')
              : applicant.preferred_location
          }`
        : 'No location preferences specified',
    },
    // Legal Documents/Signatures
    {
      title: 'Legal Documents',
      stepNumber: 10, // Driver application/signature step
      summary: signatureStatus.allSigned
        ? `All legal documents signed (${signatureStatus.signed}/${signatureStatus.total})`
        : `Legal documents: ${signatureStatus.signed}/${signatureStatus.total} signed`,
    },
  ];

  // Filter out sections with no meaningful data, but keep important sections even if empty to show what's missing
  const populatedSections = summarySections.filter((section) => {
    const summary = section.summary.toLowerCase();

    // Always show these critical sections even if empty to indicate what's missing
    const criticalSections = [
      'License Details',
      'Documents',
      'Emergency Contact',
      'Legal Documents',
    ];

    if (criticalSections.includes(section.title)) {
      return true; // Always show critical sections
    }

    // For other sections, filter out if they have no meaningful data
    return (
      !summary.includes('not provided') &&
      !summary.includes('not specified') &&
      !summary.includes('no jobs selected') &&
      !summary.includes('no location preferences') &&
      summary.trim() !== ''
    );
  });

  const handleEditSection = (stepNumber: number) => {
    setSteps(stepNumber);
  };

  const handleContinueToLongForm = () => {
    // Check if user already has a signature (to skip Driver Application step)
    const existingSignature = applicantExtras?.find(
      (extra) => extra.type === ApplicantExtras.SIGNATURE
    );
    const hasSignature = !!existingSignature?.value;

    if (isPrefilled) {
      if (hasSignature) {
        // For prefilled applications with existing signature, skip Driver Application (step 10) and go to BackgroundInfo (step 11)
        setSteps(11);
      } else {
        // For prefilled applications without signature, go to Driver Application (step 10)
        setSteps(10);
      }
    } else {
      // For new applications, show the "Continue to Long Form" step
      setSteps(9); // Continue to long form
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className="text-center mb-4">
          <h2 className="mb-3">Application Summary</h2>

          {/* Applicant Identity Section */}
          {(applicant?.first_name ||
            applicant?.last_name ||
            applicant?.email ||
            applicant?.phone) && (
            <div
              className="mb-4 p-3 rounded border"
              style={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}
            >
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i
                  className="fa fa-user-circle me-2"
                  style={{ fontSize: '1.5rem', color: '#0d6efd' }}
                />
                <h4 className="mb-0 text-dark">
                  {applicant?.first_name || applicant?.last_name
                    ? `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim()
                    : 'Application in Progress'}
                </h4>
              </div>
              <div className="text-dark">
                {applicant?.email && (
                  <div className="mb-1">
                    <i className="fa fa-envelope me-2" style={{ color: '#28a745' }} />
                    {applicant.email}
                  </div>
                )}
                {applicant?.phone && (
                  <div className="mb-1">
                    <i className="fa fa-phone me-2" style={{ color: '#28a745' }} />
                    {applicant.phone}
                  </div>
                )}
                {applicant?.zip_code && (
                  <div className="mb-1">
                    <i className="fa fa-map-marker me-2" style={{ color: '#17a2b8' }} />
                    ZIP: {applicant.zip_code}
                  </div>
                )}
                {applicant?.license_type && (
                  <div className="mb-0">
                    <i className="fa fa-id-card me-2" style={{ color: '#fd7e14' }} />
                    {formatLicenseType(applicant.license_type)}
                    {applicant?.years_cdl_experience &&
                      ` • ${applicant.years_cdl_experience} years experience`}
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-dark">
            Review your information below and click any section to edit.
            <br />
            Click &ldquo;Continue&rdquo; when you&apos;re ready to proceed to the detailed
            application.
          </p>

          {/* Completion Status */}
          <div className="mt-3">
            {(() => {
              const completeSections = populatedSections.filter((section) => {
                // Use the same completion logic as the individual sections
                if (section.title === 'Legal Documents') {
                  return signatureStatus.allSigned;
                } else if (section.title === 'Documents') {
                  return hasDriverLicense && hasMedicalCard;
                } else if (
                  section.title === 'Safety Record' ||
                  section.title === 'DUI History' ||
                  section.title === 'Accident History' ||
                  section.title === 'Violation History' ||
                  section.title === 'Criminal History'
                ) {
                  // These sections are complete if they appear (since they only appear when data exists)
                  return true;
                } else {
                  // For other sections, use the existing logic
                  return (
                    !section.summary.toLowerCase().includes('not provided') &&
                    !section.summary.toLowerCase().includes('not uploaded') &&
                    !section.summary.toLowerCase().includes('no ') &&
                    section.summary.trim() !== ''
                  );
                }
              }).length;
              const totalSections = populatedSections.length;
              const completionPercentage = Math.round((completeSections / totalSections) * 100);

              return (
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-2 text-dark fw-bold">Application Completion:</span>
                  <div className="progress me-2" style={{ width: '200px', height: '20px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${completionPercentage}%`,
                        backgroundColor:
                          completionPercentage === 100
                            ? '#28a745'
                            : completionPercentage >= 50
                            ? '#17a2b8'
                            : '#fd7e14',
                      }}
                    ></div>
                  </div>
                  <span className="fw-bold text-dark">{completionPercentage}%</span>
                  <span className="ms-2 text-dark">
                    ({completeSections}/{totalSections} sections)
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

        <Row>
          {populatedSections.map((section, index) => {
            // Determine if this section has complete data
            let isComplete = false;
            let isPartiallyComplete = false;

            // Special handling for different section types
            if (section.title === 'Legal Documents') {
              // Legal Documents: Complete only if all 4/4 are signed
              isComplete = signatureStatus.allSigned;
              isPartiallyComplete = signatureStatus.signed > 0 && !signatureStatus.allSigned;
            } else if (section.title === 'Documents') {
              // Documents: Complete if both driver license AND medical card are uploaded
              isComplete = hasDriverLicense && hasMedicalCard;
              isPartiallyComplete = hasDriverLicense || hasMedicalCard;
            } else if (section.title === 'Safety Record') {
              // Safety Record: If it appears, it means they provided data, so it's complete
              isComplete = true;
            } else if (section.title === 'DUI History') {
              // DUI History: If it appears, it means they have DUI history, so it's complete
              isComplete = true;
            } else if (
              section.title === 'Accident History' ||
              section.title === 'Violation History' ||
              section.title === 'Criminal History'
            ) {
              // These history sections: If they appear, it means data was provided, so they're complete
              isComplete = true;
            } else {
              // For other sections, use the existing logic
              isComplete =
                !section.summary.toLowerCase().includes('not provided') &&
                !section.summary.toLowerCase().includes('not uploaded') &&
                !section.summary.toLowerCase().includes('no ') &&
                section.summary.trim() !== '';
            }

            return (
              <Col md={12} key={index} className="mb-3">
                <Card className="shadow-sm">
                  <Card.Body className="py-3">
                    <Row className="align-items-center">
                      <Col md={1} className="text-center">
                        {/* Status indicator */}
                        {isComplete ? (
                          <i
                            className="fa fa-check-circle"
                            style={{
                              fontSize: '1.5rem',
                              color: '#198754',
                              textShadow: '0 0 3px rgba(25,135,84,0.3)',
                            }}
                          />
                        ) : isPartiallyComplete ? (
                          <i
                            className="fa fa-exclamation-triangle"
                            style={{
                              fontSize: '1.5rem',
                              color: '#ff6b00',
                              textShadow: '0 0 3px rgba(255,107,0,0.3)',
                            }}
                          />
                        ) : (
                          <i
                            className="fa fa-times-circle"
                            style={{
                              fontSize: '1.5rem',
                              color: '#dc3545',
                              textShadow: '0 0 3px rgba(220,53,69,0.3)',
                            }}
                          />
                        )}
                      </Col>
                      <Col md={9}>
                        <h6
                          className="mb-1"
                          style={{ color: '#000000', fontWeight: '600', fontSize: '1.1rem' }}
                        >
                          {section.title}
                        </h6>
                        <p
                          className={`mb-0`}
                          style={{
                            color: isComplete ? '#2c3e50' : '#000000',
                            fontWeight: isComplete ? '400' : '600',
                            fontSize: '0.95rem',
                          }}
                        >
                          {section.summary}
                        </p>
                      </Col>
                      <Col md={2} className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditSection(section.stepNumber)}
                        >
                          <i className="fa fa-edit me-1" />
                          {isComplete ? 'Edit' : 'Complete'}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="text-center mt-4">
          <Button variant="primary" size="lg" onClick={handleContinueToLongForm} className="px-5">
            <i className="fa fa-arrow-right me-2" />
            {isPrefilled ? 'Continue Application' : 'Continue to Detailed Application'}
          </Button>
        </div>

        <div className="text-center mt-3  p-10">
          <small className="text-dark">
            <i className="fa fa-info-circle me-1" />
            You can return to this summary anytime during the application process.
          </small>
        </div>
      </div>
    </div>
  );
}
