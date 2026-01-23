import React from 'react';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { ApplicantExtras } from '../../enums/applicants/applicant-extras.enum';

interface CompletionItem {
  section: string;
  completed: boolean;
  description: string;
  stepNumber?: number;
}

interface ApplicationCompletionChecklistProps {
  applicant: ApplicantEntity;
  onNavigateToSection?: (stepNumber: number) => void;
  isSameCompany?: boolean; // True if returning to the same company they previously applied to
}

/**
 * Analyzes an applicant's data and returns what sections still need completion
 * @param applicant - The applicant entity with their data
 * @param isSameCompany - Whether this is a returning applicant to the SAME company (not a different company)
 */
export const getApplicationCompletionStatus = (
  applicant: ApplicantEntity,
  isSameCompany: boolean = false
): CompletionItem[] => {
  const items: CompletionItem[] = [];

  // For returning applicants to the SAME company, they only need to update certain sections
  // They do NOT need to:
  // - Re-sign documents or legal paperwork
  // - Re-enter employment history (Current Employment & Company History)
  // - Re-answer "Update if you worked here before"
  // - Re-sign Application Authorization & Signature
  // Those sections are ONLY required for returning applicants applying to a DIFFERENT company
  if (isSameCompany) {
    // Only check items that might need updating for same-company applicants
    // (contact info, emergency contact, and recent safety events)

    // 1. Contact Information Updates (Step 3) - May have changed
    const hasBasicInfo = Boolean(
      applicant?.phone &&
      applicant?.email &&
      applicant?.address_1 &&
      applicant?.city &&
      applicant?.state &&
      applicant?.zip_code
    );
    items.push({
      section: 'Contact Information',
      completed: hasBasicInfo,
      description: 'Current phone, email, and address',
      stepNumber: 3,
    });

    // 2. Emergency Contact (Step 16) - May have changed
    const hasEmergencyContact = Boolean(
      applicant?.emergency_contact_name &&
      applicant?.emergency_contact_number &&
      applicant?.emergency_contact_relationship
    );
    items.push({
      section: 'Emergency Contact',
      completed: hasEmergencyContact,
      description: 'Emergency contact information',
      stepNumber: 16,
    });

    // 3. Recent Accidents (Step 20) - May have new accidents since last application
    const hasAccidentHistory = applicant?.accident_count !== undefined && applicant?.accident_count !== null;
    items.push({
      section: 'Recent Accidents',
      completed: hasAccidentHistory,
      description: 'Any accidents in the past 3 years',
      stepNumber: 20,
    });

    // 4. Recent Violations (Step 21) - May have new violations since last application
    const hasViolationHistory = applicant?.moving_violations_count !== undefined && applicant?.moving_violations_count !== null;
    items.push({
      section: 'Recent Violations',
      completed: hasViolationHistory,
      description: 'Any moving violations or tickets',
      stepNumber: 21,
    });

    return items; // Return early for same-company applicants
  }

  // For NEW applicants or DIFFERENT company applicants, check everything

  // 1. Basic Information (Step 3)
  const hasBasicInfo = Boolean(
    applicant?.first_name &&
    applicant?.last_name &&
    applicant?.email &&
    applicant?.phone &&
    applicant?.birthdate &&
    applicant?.address_1 &&
    applicant?.city &&
    applicant?.state &&
    applicant?.zip_code
  );
  items.push({
    section: 'Basic Information',
    completed: hasBasicInfo,
    description: 'Name, email, phone, date of birth, and address',
    stepNumber: 3,
  });

  // 2. CDL License Information (Step 14)
  const hasLicenseInfo = Boolean(
    applicant?.license_number &&
    applicant?.license_expiry &&
    applicant?.license_state &&
    applicant?.license_type
  );
  items.push({
    section: 'CDL License Information',
    completed: hasLicenseInfo,
    description: 'License number, expiry date, state, and type',
    stepNumber: 14,
  });

  // 3. CDL Experience (Step 4)
  const hasCdlExperience = applicant?.years_cdl_experience !== undefined && applicant?.years_cdl_experience !== null;
  items.push({
    section: 'CDL Experience',
    completed: hasCdlExperience,
    description: 'Years of CDL experience',
    stepNumber: 4,
  });

  // 4. Transmission & Endorsements (Step 6)
  const hasTransmissionEndorsements = Boolean(
    applicant?.transmission_type && applicant.transmission_type.length > 0
  );
  items.push({
    section: 'Transmission & Endorsements',
    completed: hasTransmissionEndorsements,
    description: 'Transmission types and endorsements',
    stepNumber: 6,
  });

  // 5. Current Employment History (Step 17)
  const hasCurrentEmployment = Boolean(
    applicant?.employers && applicant.employers.some(emp => emp.is_current)
  );
  items.push({
    section: 'Current Employment',
    completed: hasCurrentEmployment,
    description: 'Current employer information',
    stepNumber: 17,
  });

  // 6. Past Employment History (Step 18)
  const hasPastEmployment = Boolean(
    applicant?.employers && applicant.employers.filter(emp => !emp.is_current).length > 0
  );
  items.push({
    section: 'Past Employment History',
    completed: hasPastEmployment,
    description: 'Previous 3-10 years of employment',
    stepNumber: 18,
  });

  // 7. Work History at This Company (Step 19)
  const hasWorkedHereInfo = applicant?.already_worked_to_company !== undefined && applicant?.already_worked_to_company !== null;
  items.push({
    section: 'Work History at This Company',
    completed: hasWorkedHereInfo,
    description: 'Whether you previously worked here',
    stepNumber: 19,
  });

  // 8. Accident History (Step 20)
  const hasAccidentHistory = applicant?.accident_count !== undefined && applicant?.accident_count !== null;
  items.push({
    section: 'Accident History',
    completed: hasAccidentHistory,
    description: 'Past 3 years of accidents',
    stepNumber: 20,
  });

  // 9. Violation History (Step 21)
  const hasViolationHistory = applicant?.moving_violations_count !== undefined && applicant?.moving_violations_count !== null;
  items.push({
    section: 'Violation History',
    completed: hasViolationHistory,
    description: 'Moving violations and traffic tickets',
    stepNumber: 21,
  });

  // 10. License Suspensions (Step 22)
  const hasLicenseSuspensionInfo = applicant?.license_revoked !== undefined && applicant?.license_revoked !== null;
  items.push({
    section: 'License Suspensions',
    completed: hasLicenseSuspensionInfo,
    description: 'License revocation or suspension history',
    stepNumber: 22,
  });

  // 11. Background Information (Step 24)
  const hasBackgroundInfo = applicant?.criminal_history !== undefined && applicant?.criminal_history !== null;
  items.push({
    section: 'Background Information',
    completed: hasBackgroundInfo,
    description: 'Criminal history and felony convictions',
    stepNumber: 24,
  });

  // 12. Drug Testing (Step 25)
  const hasDrugTestInfo = applicant?.can_pass_drug_test !== undefined && applicant?.can_pass_drug_test !== null;
  items.push({
    section: 'Drug Testing',
    completed: hasDrugTestInfo,
    description: 'Drug testing consent and history',
    stepNumber: 25,
  });

  // 13. Emergency Contact (Step 16)
  const hasEmergencyContact = Boolean(
    applicant?.emergency_contact_name &&
    applicant?.emergency_contact_number &&
    applicant?.emergency_contact_relationship
  );
  items.push({
    section: 'Emergency Contact',
    completed: hasEmergencyContact,
    description: 'Emergency contact information',
    stepNumber: 16,
  });

  // 14. Legal Documents & Signatures (Step 26)
  const requiredSignatures = [
    ApplicantExtras.SIGNATURE, // Application authorization
    ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
    ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
    ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
    ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
  ];
  const hasAllSignatures = requiredSignatures.every(sigType =>
    applicant?.extras?.some(extra => extra.type === sigType)
  );
  items.push({
    section: 'Legal Documents & Signatures',
    completed: hasAllSignatures,
    description: 'Application certification and 4 legal document signatures',
    stepNumber: 26,
  });

  return items;
};

/**
 * Component that displays a completion checklist for returning applicants
 */
export const ApplicationCompletionChecklist: React.FC<ApplicationCompletionChecklistProps> = ({
  applicant,
  onNavigateToSection,
  isSameCompany = true, // Default to true for same company scenarios
}) => {
  const completionItems = getApplicationCompletionStatus(applicant, isSameCompany);
  const incompleteItems = completionItems.filter(item => !item.completed);
  const completedCount = completionItems.filter(item => item.completed).length;
  const totalCount = completionItems.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto 2rem auto',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
      }}
    >
      <h5 style={{ margin: '0 0 1rem 0', color: '#495057', fontWeight: 'bold' }}>
        {isSameCompany
          ? 'Welcome Back! Update Your Application'
          : 'Welcome Back! Complete Your Application'}
      </h5>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            Progress: {completedCount} of {totalCount} sections completed
          </span>
          <span style={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: percentComplete === 100 ? '#28a745' : '#0056b3'
          }}>
            {percentComplete}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${percentComplete}%`,
            height: '100%',
            backgroundColor: percentComplete === 100 ? '#28a745' : '#0056b3',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {incompleteItems.length > 0 ? (
        <>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#495057' }}>
            <strong>
              {isSameCompany
                ? 'Sections that may need updating:'
                : 'Sections still needing completion:'}
            </strong>
          </p>
          <ul style={{
            margin: 0,
            paddingLeft: '1.5rem',
            listStyle: 'none',
          }}>
            {incompleteItems.map((item, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  color: '#dc3545',
                  fontSize: '1.2rem',
                  lineHeight: '1.4',
                  flexShrink: 0,
                }}>
                  ✗
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#495057',
                    marginBottom: '0.125rem',
                  }}>
                    {item.section}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#6c757d',
                    lineHeight: '1.4',
                  }}>
                    {item.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {isSameCompany && (
            <p style={{
              margin: '1rem 0 0 0',
              padding: '0.75rem',
              backgroundColor: '#e7f3ff',
              border: '1px solid #bee5eb',
              borderRadius: '4px',
              fontSize: '0.85rem',
              color: '#004085',
              lineHeight: '1.4',
            }}>
              <strong>Note:</strong> Since you're re-applying to the same company,
              you don't need to re-sign legal documents, re-enter employment history,
              or complete the "worked here before" section again.
              Just confirm the sections above are still accurate.
            </p>
          )}
        </>
      ) : (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✓</span>
          <strong>All sections completed!</strong> Please review and submit your application.
        </div>
      )}
    </div>
  );
};
