import React from 'react';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';

interface ReturningUserBannerProps {
  applicant: ApplicantEntity;
  companyName?: string;
  isPrefilled?: boolean; // Indicates if data was prefilled from a previous application
}

/**
 * Banner component that displays important information for returning users who
 * previously applied to another company.
 *
 * Shows:
 * - Notice that they need to re-sign all documentation
 * - Whether they previously worked for this company
 * - List of specific documents to re-sign
 */
export const ReturningUserBanner: React.FC<ReturningUserBannerProps> = ({
  applicant,
  companyName = 'this company',
  isPrefilled = false,
}) => {
  console.log('🔵 ReturningUserBanner - applicant:', applicant);
  console.log('🔵 ReturningUserBanner - applicant.id:', applicant?.id);
  console.log('🔵 ReturningUserBanner - isPrefilled:', isPrefilled);
  console.log('🔵 ReturningUserBanner - applicant.already_applied_to_company:', applicant?.already_applied_to_company);
  console.log('🔵 ReturningUserBanner - applicant.already_worked_to_company:', applicant?.already_worked_to_company);

  // For DIFFERENT_COMPANY_PREFILL scenario: isPrefilled=true and applicant.id=null
  // For SAME_COMPANY scenarios: applicant.id is populated
  const isReturningUser = isPrefilled || applicant?.id;

  if (!isReturningUser) {
    console.log('🔴 ReturningUserBanner - Not a returning user, hiding banner');
    return null;
  }

  const workedHereBefore = applicant?.already_worked_to_company === true;
  const appliedHereBefore = applicant?.already_applied_to_company === true;

  console.log('🔵 ReturningUserBanner - workedHereBefore:', workedHereBefore);
  console.log('🔵 ReturningUserBanner - appliedHereBefore:', appliedHereBefore);

  // Only show this comprehensive banner for users applying to a DIFFERENT company
  // If they applied to THIS company before, they don't need to re-complete all safety sections
  // For prefilled applications (different company), appliedHereBefore will be false
  // Key: must use AND (&&) not OR (||) - isPrefilled can be true for same-company scenarios too
  const isApplyingToDifferentCompany = isPrefilled && !appliedHereBefore;

  console.log('🔵 ReturningUserBanner - isApplyingToDifferentCompany:', isApplyingToDifferentCompany);

  // Don't show the comprehensive banner if they're re-applying to the same company
  if (!isApplyingToDifferentCompany) {
    console.log('🔴 ReturningUserBanner - Re-applying to same company, hiding comprehensive banner');
    return null;
  }

  console.log('✅ ReturningUserBanner - Showing banner for user applying to different company');

  // Determine the context message
  // Since we only show this banner for users applying to a DIFFERENT company,
  // we need to check if they worked at THIS company before (even though they never applied here)
  let contextMessage = '';

  if (workedHereBefore) {
    // They worked at this company before but never formally applied through DriverFly
    const startDate = applicant.already_worked_start_date
      ? new Date(applicant.already_worked_start_date).toLocaleDateString()
      : 'unknown';
    const endDate = applicant.already_worked_end_date
      ? new Date(applicant.already_worked_end_date).toLocaleDateString()
      : 'unknown';
    contextMessage = `Our records show you previously worked for ${companyName} from ${startDate} to ${endDate}, but you haven't applied through DriverFly before. You previously applied through DriverFly to another company.`;
  } else {
    contextMessage = `Our records show you previously applied through DriverFly to another company.`;
  }

  return (
    <div
      style={{
        backgroundColor: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ fontSize: '1.5rem', color: '#856404', flexShrink: 0, marginTop: '0.125rem' }}>
          ⚠️
        </div>
        <div style={{ flex: 1 }}>
          <h5 style={{ margin: '0 0 0.75rem 0', color: '#856404', fontWeight: 'bold', fontSize: '1.1rem' }}>
            Returning Applicant - Action Required
          </h5>
          <p style={{ margin: '0 0 0.75rem 0', color: '#856404', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {contextMessage}
          </p>
          <p style={{ margin: '0 0 0.5rem 0', color: '#856404', fontSize: '0.95rem', fontWeight: 'bold' }}>
            You must complete the following for this new application:
          </p>
          <ul style={{ margin: '0 0 0.75rem 1.25rem', color: '#856404', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <li><strong>Current Employment & Company History</strong> - Update if you worked here before</li>
            <li><strong>Application Authorization & Signature</strong> - Sign the application certification</li>
            <li><strong>Legal Documents</strong> - Re-sign all 4 required documents:
              <ul style={{ marginTop: '0.25rem', marginLeft: '1rem' }}>
                <li>Verification of Employment (VOE) Authorization</li>
                <li>Disclosure & Authorization</li>
                <li>Important Disclosure - Background PSP</li>
                <li>General Consent for Drug & Alcohol Clearinghouse</li>
              </ul>
            </li>
          </ul>
          <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Note: Previous signatures are not valid for new applications. Please complete all signature requirements in the Legal Documents section.
          </p>
        </div>
      </div>
    </div>
  );
};
