import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { ReturningUserBanner } from '../../../applicants/returning-user-banner';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import styles from '../../../../styles/digitalhiringapp.module.css';

interface SummarySection {
  title: string;
  stepNumber: number;
  summary: string; // Single line summary
}

export function ApplicationSummary() {
  const {
    state: { applicant, applicantExtras, jobs, companyJobs, company, isPrefilled, isEditingExistingApplicant, steps },
    method: { setSteps, setIsEditingFromSummary },
  }: JotFormContextType = useContext(JotformContext);

  // Save functionality
  const { saveFormData, isSaving, lastSaved, saveError } = useAsyncFormSave(applicant?.id);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true); // Assume changes exist when viewing summary

  // Handle save application
  const handleSaveApplication = useCallback(async () => {
    if (!applicant?.id) {
      toast.error('Unable to save: No applicant ID found');
      return;
    }

    try {
      // Prepare applicant data for saving
      const saveData = {
        ...applicant,
        extras: applicantExtras,
      };

      await saveFormData(saveData);
      setHasUnsavedChanges(false);
      toast.success('Application saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save application. Please try again.');
    }
  }, [applicant, applicantExtras, saveFormData]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

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

  // Helper functions for additional sections
  const hasBackgroundInfo = () => {
    return applicant?.birthdate || applicant?.address_1 || applicant?.city;
  };

  const hasEducation = () => {
    return !!applicant?.highest_degree;
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
      summary: (() => {
        const parts: string[] = [];

        // Name and email
        parts.push(`${applicant?.first_name || ''} ${applicant?.last_name || ''}`);
        parts.push(applicant?.email || 'No email');
        parts.push(`ZIP: ${applicant?.zip_code || 'Not provided'}`);

        // Owner operator status
        if (applicant?.is_owner_operator) {
          const ownerOpParts: string[] = ['Owner Operator'];
          if (applicant?.owner_operator_company_name) {
            ownerOpParts.push(applicant.owner_operator_company_name);
          }
          if (applicant?.owner_operator_dot_number) {
            ownerOpParts.push(`DOT: ${applicant.owner_operator_dot_number}`);
          }
          parts.push(ownerOpParts.join(' - '));
        } else {
          parts.push('Company Driver');
        }

        // Communication authorization
        if (applicant?.authorize_to_communicate !== undefined && applicant?.authorize_to_communicate !== null) {
          parts.push(`Communication: ${applicant.authorize_to_communicate ? 'Authorized' : 'Not authorized'}`);
        }

        // How they heard about us
        const hearAbout = getExtraValue(ApplicantExtras.HEAR_ABOUT_US);
        if (hearAbout) {
          const referralName = getExtraValue(ApplicantExtras.REFERAL_NAME);
          if (referralName) {
            parts.push(`Referral: ${referralName}`);
          } else {
            parts.push(`Source: ${hearAbout}`);
          }
        }

        return parts.join(' | ');
      })(),
    },
    // === DRIVER'S LICENSE INFORMATION (Combined Section) ===
    {
      title: "Driver's License Information",
      stepNumber: 4,
      summary: (() => {
        const details: string[] = [];

        // License Type & Experience
        details.push(`License Type: ${formatLicenseType(applicant?.license_type) || 'Not specified'}`);
        details.push(`Years of Experience: ${applicant?.years_cdl_experience || 0}`);

        // License Number, State, Expiry
        details.push(`License Number: ${applicant?.license_number || 'Not provided'}`);
        details.push(`License State: ${applicant?.license_state || 'Not provided'}`);
        details.push(`License Expiry: ${applicant?.license_expiry ? new Date(applicant.license_expiry).toLocaleDateString() : 'Not provided'}`);

        // Transmissions
        const transmissions = (Array.isArray(applicant?.transmission_type) && applicant.transmission_type.length > 0)
          ? applicant.transmission_type.join(', ')
          : 'None';
        details.push(`Transmissions: ${transmissions}`);

        // Endorsements
        if (Array.isArray(applicant?.endorsements) && applicant.endorsements.length > 0) {
          const endorsements = applicant.endorsements.join(', ');
          const endorsementsText = applicant?.endorsements_other
            ? `${endorsements}, Other: ${applicant.endorsements_other}`
            : endorsements;
          details.push(`Endorsements: ${endorsementsText}`);
        } else {
          details.push('Endorsements: None');
        }

        // Restrictions
        if (Array.isArray(applicant?.license_restrictions) && applicant.license_restrictions.length > 0) {
          const restrictions = applicant.license_restrictions.join(', ');
          const restrictionsText = applicant?.license_restrictions_other
            ? `${restrictions}, Other: ${applicant.license_restrictions_other}`
            : restrictions;
          details.push(`Restrictions: ${restrictionsText}`);
        } else {
          details.push('Restrictions: None');
        }

        // Equipment Experience
        if (applicant?.equipment_experience && Array.isArray(applicant.equipment_experience) && applicant.equipment_experience.length > 0) {
          const equipmentList = applicant.equipment_experience
            .map((eq) => `${eq.type}${eq.years ? ` (${eq.years} years)` : ''}`)
            .join(', ');
          details.push(`Equipment Experience: ${equipmentList}`);
        } else {
          details.push('Equipment Experience: None');
        }

        // Additional Licenses
        const additionalLicenses = getExtraValue(ApplicantExtras.CDL_NUMBER);
        if (additionalLicenses && Array.isArray(additionalLicenses) && additionalLicenses.length > 0) {
          const licensesList = additionalLicenses
            .map((lic) => `${lic.license_number} (${lic.state})`)
            .join(', ');
          details.push(`Additional Licenses: ${licensesList}`);
        } else {
          details.push('Additional Licenses: None');
        }

        // Document Upload
        details.push(`License Document: ${hasDriverLicense ? 'Uploaded' : 'Not uploaded'}`);

        return details.join(' | ');
      })(),
    },
    // === END DRIVER'S LICENSE INFORMATION ===
    // Step 15: Medical Card
    {
      title: 'Medical Card Document',
      stepNumber: 15, // MedicalCard step
      summary: `Medical Card: ${hasMedicalCard ? 'Uploaded' : 'Not uploaded'}`,
    },
    // Step 16: Emergency Contact
    {
      title: 'Emergency Contact',
      stepNumber: 16, // EmergencyContact step
      summary: applicant?.emergency_contact_name
        ? `${applicant.emergency_contact_name} (${
            applicant?.emergency_contact_relationship || 'No relationship'
          }) | ${applicant?.emergency_contact_number || 'No phone'}`
        : 'No emergency contact provided',
    },
    // Safety Record - Always show for returning users
    {
      title: 'Safety Record',
      stepNumber: 5,
      summary: (() => {
        const parts: string[] = [];

        // Drug test
        if (applicant?.can_pass_drug_test !== undefined && applicant?.can_pass_drug_test !== null) {
          parts.push(`Drug Test: ${applicant.can_pass_drug_test ? 'Yes' : 'No'}`);
        } else {
          parts.push('Drug Test: Not answered');
        }

        // Violations
        if (applicant?.moving_violations_count !== undefined || applicant?.all_violations_count !== undefined) {
          const violationParts: string[] = [];
          if (applicant?.moving_violations_count) {
            violationParts.push(`${applicant.moving_violations_count} moving`);
          }
          if (applicant?.all_violations_count) {
            violationParts.push(`${applicant.all_violations_count} total`);
          }
          parts.push(`Violations: ${violationParts.length > 0 ? violationParts.join(', ') : '0'}`);
        } else {
          parts.push('Violations: Not answered');
        }

        // Accidents
        if (applicant?.accident_count !== undefined && applicant?.accident_count !== null) {
          parts.push(`Accidents: ${applicant.accident_count}`);
        } else {
          parts.push('Accidents: Not answered');
        }

        // License revoked
        if (applicant?.license_revoked !== undefined && applicant?.license_revoked !== null) {
          parts.push(`License Revoked: ${applicant.license_revoked ? 'Yes' : 'No'}`);
        } else {
          parts.push('License Revoked: Not answered');
        }

        // Work authorization
        if (applicant?.authorized_to_work_in_us !== undefined && applicant?.authorized_to_work_in_us !== null) {
          parts.push(`Work Authorization: ${applicant.authorized_to_work_in_us ? 'Yes' : 'No'}`);
        } else {
          parts.push('Work Authorization: Not answered');
        }

        return parts.join(' | ');
      })(),
    },
    // Step 19: Accident History - Always show for returning users
    {
      title: 'Accident History',
      stepNumber: 19, // AccidentHistory step
      summary: (() => {
        const parts: string[] = [];

        // Check if user has answered the question (not null/undefined)
        const hasAnswered = applicant?.accident_count !== undefined && applicant?.accident_count !== null;

        if (!hasAnswered) {
          return 'Not answered';
        }

        // Check if any accident data exists
        if (!hasAccidentHistory()) {
          return 'No accidents reported';
        }

        // Accident count
        parts.push(`${applicant?.accident_count || 0} accident(s)`);

        // Detailed accident records
        if (applicant?.accident_history && Array.isArray(applicant.accident_history) && applicant.accident_history.length > 0) {
          const accidentSummaries = applicant.accident_history.slice(0, 2).map((acc) => {
            const date = acc.date_of_accident ? new Date(acc.date_of_accident).toLocaleDateString() : 'No date';
            const location = acc.location_of_accident || 'Unknown location';
            const injuries = acc.number_of_injured || 0;
            const fatalities = acc.number_of_fatalaties || 0;
            const dot = acc.dot_recordable ? 'DOT Recordable' : '';
            const fault = acc.at_fault ? 'At Fault' : 'Not at Fault';
            return `${date} - ${location} (${injuries} injured, ${fatalities} fatalities) ${fault}${dot ? ', ' + dot : ''}`;
          });
          parts.push(accidentSummaries.join(' | '));
          if (applicant.accident_history.length > 2) {
            parts.push(`+${applicant.accident_history.length - 2} more`);
          }
        } else if (applicant?.accident_details && applicant.accident_details !== '__YES_NO_DETAILS__') {
          parts.push(`Details: ${applicant.accident_details}`);
        }

        return parts.join(' | ');
      })(),
    },
    // Step 20: Violation History - Always show for returning users
    {
      title: 'Violation History',
      stepNumber: 20, // ViolationHistory step
      summary: (() => {
        const parts: string[] = [];

        // Check if user has answered the question (not null/undefined)
        const hasAnswered = applicant?.moving_violations_count !== undefined && applicant?.moving_violations_count !== null;

        if (!hasAnswered) {
          return 'Not answered';
        }

        // Check if any violation data exists
        if (!hasViolationHistory()) {
          return 'No violations reported';
        }

        // Violation count
        parts.push(`${applicant?.moving_violations_count || 0} moving violation(s)`);

        // Detailed violation records
        if (applicant?.moving_violation_history && Array.isArray(applicant.moving_violation_history) && applicant.moving_violation_history.length > 0) {
          const violationSummaries = applicant.moving_violation_history.slice(0, 2).map((vio) => {
            const date = vio.date_of_violation ? new Date(vio.date_of_violation).toLocaleDateString() : 'No date';
            const location = vio.location || 'Unknown location';
            const charge = vio.charge || 'Unknown charge';
            const penalty = vio.penalty || 'Unknown penalty';
            return `${date} - ${location}: ${charge} (${penalty})`;
          });
          parts.push(violationSummaries.join(' | '));
          if (applicant.moving_violation_history.length > 2) {
            parts.push(`+${applicant.moving_violation_history.length - 2} more`);
          }
        } else if (applicant?.moving_violations_details && applicant.moving_violations_details !== '__YES_NO_DETAILS__') {
          parts.push(`Details: ${applicant.moving_violations_details}`);
        }

        return parts.join(' | ');
      })(),
    },
    // Step 23: Criminal History - always show for returning users
    {
      title: 'Criminal History',
      stepNumber: 23,
      summary: (() => {
        const parts: string[] = [];

        // Check if criminal history is provided
        if (applicant?.criminal_history && applicant.criminal_history.trim() !== '' && applicant.criminal_history !== '__YES_NO_DETAILS__') {
          const details = applicant.criminal_history.length > 150
            ? applicant.criminal_history.substring(0, 150) + '...'
            : applicant.criminal_history;
          parts.push(`Felony conviction: Yes | Details: ${details}`);
        } else if (applicant?.criminal_history === '__YES_NO_DETAILS__') {
          parts.push('Felony conviction: Yes (details not provided)');
        } else if (applicant?.criminal_history === '') {
          parts.push('Felony conviction: No');
        } else {
          parts.push('Criminal history: Not answered');
        }

        return parts.join(' | ');
      })(),
    },
    // Step 17: Current Employment & Company History
    {
      title: 'Current Employment & Company History',
      stepNumber: 17,
      summary: (() => {
        const parts: string[] = [];

        // Company History Questions (from beginning of step 17)
        if (applicant?.already_applied_to_company !== undefined && applicant?.already_applied_to_company !== null) {
          parts.push(`Previously applied: ${applicant.already_applied_to_company ? 'Yes' : 'No'}`);
        }
        if (applicant?.already_worked_to_company) {
          const startDate = applicant.already_worked_start_date
            ? new Date(applicant.already_worked_start_date).toLocaleDateString()
            : 'Unknown';
          const endDate = applicant.already_worked_end_date
            ? new Date(applicant.already_worked_end_date).toLocaleDateString()
            : 'Unknown';
          parts.push(`Previously worked here: ${startDate} to ${endDate}`);
        } else if (applicant?.already_worked_to_company !== undefined && applicant?.already_worked_to_company !== null) {
          parts.push(`Previously worked here: No`);
        }

        // Current Employment
        const currentEmployers = applicant?.employers?.filter((e) => e.is_current) || [];
        if (currentEmployers.length > 0) {
          const currentSummaries = currentEmployers.map((employer) => {
            const companyName = employer.name || 'Unknown Company';
            const position = employer.title || 'Unknown Position';
            const startDate = employer.start_at
              ? new Date(employer.start_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Unknown';
            const phone = employer.phone ? ` | Contact: ${employer.phone}` : '';
            const canContact = employer.can_contact !== undefined && employer.can_contact !== null
              ? ` | Can contact: ${employer.can_contact ? 'Yes' : 'No'}`
              : '';
            return `${companyName} - ${position} (${startDate} - Present)${phone}${canContact}`;
          });
          parts.push(`Current employer(s): ${currentSummaries.join(' | ')}`);
        } else {
          parts.push('Currently employed: No');
        }

        return parts.length > 0 ? parts.join(' | ') : 'No current employment information';
      })(),
    },
    // Step 18: Past Employment History
    {
      title: 'Past Employment History',
      stepNumber: 18,
      summary: (() => {
        const parts: string[] = [];
        const pastEmployers = applicant?.employers?.filter((e) => !e.is_current) || [];

        // Check if they indicated they have past employment
        const hasPastEmployment = pastEmployers.length > 0;

        if (hasPastEmployment) {
          // Sort by most recent
          const sortedPast = [...pastEmployers].sort((a, b) => {
            const dateA = a.start_at ? new Date(a.start_at).getTime() : 0;
            const dateB = b.start_at ? new Date(b.start_at).getTime() : 0;
            return dateB - dateA;
          });

          // Show detailed info for up to 2 most recent past employers
          const pastSummaries = sortedPast.slice(0, 2).map((employer) => {
            const companyName = employer.name || 'Unknown Company';
            const position = employer.title || 'Unknown Position';
            const startDate = employer.start_at
              ? new Date(employer.start_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Unknown';
            const endDate = employer.end_at
              ? new Date(employer.end_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'Unknown';
            const phone = employer.phone ? ` | Contact: ${employer.phone}` : '';
            const canContact = employer.can_contact !== undefined && employer.can_contact !== null
              ? ` | Can contact: ${employer.can_contact ? 'Yes' : 'No'}`
              : '';
            const reasonForLeaving = employer.reason_for_leaving ? ` | Reason: ${employer.reason_for_leaving}` : '';
            return `${companyName} - ${position} (${startDate} - ${endDate})${phone}${canContact}${reasonForLeaving}`;
          });

          parts.push(`${pastEmployers.length} past employer(s): ${pastSummaries.join(' | ')}`);

          if (pastEmployers.length > 2) {
            parts.push(`+${pastEmployers.length - 2} more employers`);
          }
        } else {
          parts.push('No past employment');
        }

        // Employment gap details
        if (applicant?.employment_gap_details) {
          parts.push(`Gap details: ${applicant.employment_gap_details}`);
        }

        return parts.join(' | ');
      })(),
    },
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
    // Step 8: Job Preferences
    {
      title: 'Job Preferences',
      stepNumber: 8,
      summary: (() => {
        const parts: string[] = [];

        // Preferred location
        if (applicant?.preferred_location && Array.isArray(applicant.preferred_location) && applicant.preferred_location.length > 0) {
          parts.push(`Location: ${applicant.preferred_location.join(', ')}`);
        } else if (applicant?.preferred_location) {
          parts.push(`Location: ${applicant.preferred_location}`);
        }

        // Routes/schedules
        if (applicant?.routes && Array.isArray(applicant.routes) && applicant.routes.length > 0) {
          parts.push(`Routes: ${applicant.routes.join(', ')}`);
        } else if (applicant?.routes) {
          parts.push(`Routes: ${applicant.routes}`);
        }

        // Other requirements
        if (applicant?.other_requirements && Array.isArray(applicant.other_requirements) && applicant.other_requirements.length > 0) {
          const requirements = applicant.other_requirements.join(', ');
          parts.push(`Requirements: ${requirements}`);
        }

        // Custom other requirement
        if (applicant?.other_requirements_other) {
          parts.push(`Other: ${applicant.other_requirements_other}`);
        }

        // W2 employment requirement
        const requireW2 = getExtraValue(ApplicantExtras.REQUIRE_W2_EMPLOYMENT);
        if (requireW2 !== undefined && requireW2 !== null) {
          parts.push(`W2 Required: ${requireW2 ? 'Yes' : 'No'}`);
        }

        return parts.length > 0 ? parts.join(' | ') : 'No preferences specified';
      })(),
    },
    // Step 10: Driver Application Authorization - always show for returning users
    {
      title: 'Application Authorization & Signature',
      stepNumber: 10,
      summary: (() => {
        const signature = applicantExtras?.find((e) => e.type === ApplicantExtras.SIGNATURE);
        const applyDate = applicantExtras?.find((e) => e.type === ApplicantExtras.APPLY_DATE);
        const signatureText = signature?.value ? 'Signature completed' : 'No signature';
        const dateText = applyDate?.value
          ? `Applied: ${new Date(applyDate.value).toLocaleDateString()}`
          : 'No application date';
        return `${signatureText} | ${dateText}`;
      })(),
    },
    // Step 11: Background Info - always show
    {
      title: 'Background Information',
      stepNumber: 11,
      summary: (() => {
        const parts: string[] = [];
        if (applicant?.birthdate) {
          parts.push(`DOB: ${new Date(applicant.birthdate).toLocaleDateString()}`);
        }
        if (applicant?.address_1) {
          parts.push(applicant.address_1);
        }
        if (applicant?.city && applicant?.state) {
          parts.push(`${applicant.city}, ${applicant.state}`);
        } else if (applicant?.city) {
          parts.push(applicant.city);
        } else if (applicant?.state) {
          parts.push(applicant.state);
        }
        return parts.length > 0 ? parts.join(' | ') : 'No background information provided';
      })(),
    },
    // Step 12: Education - only show if has education data
    ...(hasEducation()
      ? [
          {
            title: 'Education',
            stepNumber: 12,
            summary: `Education Level: ${applicant?.highest_degree || 'Not specified'}`,
          },
        ]
      : []),
    // Step 21: Past Suspension - always show for returning users
    {
      title: 'License Suspension/DUI History',
      stepNumber: 21,
      summary: (() => {
        const parts: string[] = [];

        // License suspension/revocation
        if (applicant?.license_revoked === true) {
          parts.push('License suspended/revoked: Yes');
          if (applicant?.license_revoked_details && applicant.license_revoked_details !== '__YES_NO_DETAILS__') {
            const details = applicant.license_revoked_details.length > 100
              ? applicant.license_revoked_details.substring(0, 100) + '...'
              : applicant.license_revoked_details;
            parts.push(`Details: ${details}`);
          }
        } else if (applicant?.license_revoked === false) {
          parts.push('License suspended/revoked: No');
        } else {
          parts.push('License suspension status: Not answered');
        }

        // DUI history
        if (applicant?.has_past_dui === true) {
          if (applicant?.dui_years && Array.isArray(applicant.dui_years) && applicant.dui_years.length > 0) {
            const years = applicant.dui_years.join(', ');
            parts.push(`DUI incidents in: ${years}`);
          } else {
            parts.push('DUI: Yes (years not specified)');
          }
        } else if (applicant?.has_past_dui === false) {
          parts.push('DUI history: No');
        } else {
          parts.push('DUI history: Not answered');
        }

        return parts.join(' | ');
      })(),
    },
    // Step 22: Unable For Job - always show for returning users
    {
      title: 'Job Performance Limitations',
      stepNumber: 22,
      summary: (() => {
        const reasonExtra = applicantExtras?.find(
          (e) => e.type === ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
        );

        if (reasonExtra?.value && reasonExtra.value.trim() !== '') {
          const reason = reasonExtra.value.length > 150
            ? reasonExtra.value.substring(0, 150) + '...'
            : reasonExtra.value;
          return `Cannot perform essential functions | Reason: ${reason}`;
        }

        return 'Can perform all essential job functions';
      })(),
    },
    // Step 24: Drug Test - always show for returning users
    {
      title: 'Drug Test History',
      stepNumber: 24,
      summary: (() => {
        const parts: string[] = [];

        // Positive drug test question
        if (applicant?.positive_drug_test === true) {
          parts.push('Positive drug test: Yes');

          // Show details if provided
          if (applicant?.positive_drug_test_details && applicant.positive_drug_test_details !== '__YES_NO_DETAILS__') {
            const details = applicant.positive_drug_test_details.length > 100
              ? applicant.positive_drug_test_details.substring(0, 100) + '...'
              : applicant.positive_drug_test_details;
            parts.push(`Details: ${details}`);
          }

          // SAP participation
          if (applicant?.is_sap_participant === true) {
            parts.push('SAP program: Completed');
          } else if (applicant?.is_sap_participant === false) {
            parts.push('SAP program: Not completed');
          }
        } else if (applicant?.positive_drug_test === false) {
          parts.push('Positive drug test history: No');
        } else {
          parts.push('Drug test history: Not answered');
        }

        return parts.join(' | ');
      })(),
    },
    // Step 25: Legal Documents/Signatures
    {
      title: 'Legal Documents',
      stepNumber: 25, // LegalDocumentsPage step in short form
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
      "Driver's License Information",
      'Application Authorization & Signature',
      'Current Employment & Company History',
      'Safety Record',
      'Accident History',
      'Violation History',
      'License Suspension/DUI History',
      'Criminal History',
      'Job Performance Limitations',
      'Drug Test History',
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
    console.log('🔵 handleEditSection called');
    console.log('stepNumber:', stepNumber);
    console.log('current steps:', steps);
    console.log('applicant ID:', applicant?.id);
    console.log('setSteps:', setSteps);
    console.log('setIsEditingFromSummary:', setIsEditingFromSummary);

    // Navigate freely between sections - no warning needed for internal navigation
    setIsEditingFromSummary(true);

    // Special handling: Route "Driver's License Information" section to combined license edit page (step 99)
    const targetStep = stepNumber === 4 ? 99 : stepNumber;
    setSteps(targetStep);

    console.log('✅ State setters called, navigating to step:', targetStep);
  };

  const handleSubmitApplication = () => {
    // For returning users applying to a DIFFERENT company, validate all safety sections are complete
    // For returning users re-applying to the SAME company, NO sections are required
    // For DIFFERENT_COMPANY_PREFILL scenario: isPrefilled=true AND already_applied_to_company is NOT true
    // Key: use AND (&&) - isPrefilled can be true for same-company scenarios too
    const isApplyingToDifferentCompany = isPrefilled && applicant?.already_applied_to_company !== true;

    const requiredSectionsForDifferentCompany = [
      'Current Employment & Company History',
      'Application Authorization & Signature',
      'Legal Documents',
    ];

    // For same-company returning applicants, NO sections are required
    // (they don't need to re-sign legal documents, re-enter employment history, etc.)
    const requiredSectionsForSameCompany: string[] = [];

    const requiredSections = isApplyingToDifferentCompany
      ? requiredSectionsForDifferentCompany
      : requiredSectionsForSameCompany;

    // Find first incomplete required section
    const incompleteSection = populatedSections.find((section) => {
      if (!requiredSections.includes(section.title)) {
        return false;
      }

      // Check if section is complete
      let isComplete = false;

      if (section.title === 'Legal Documents') {
        isComplete = signatureStatus.allSigned;
      } else if (section.title === 'Documents') {
        isComplete = hasDriverLicense && hasMedicalCard;
      } else if (section.title === "Driver's License Information") {
        // Driver's License is complete if basic required fields are present
        // (license type, years, number, state, expiry)
        // Optional fields like "None" for equipment/endorsements are OK
        const hasLicenseType = section.summary.includes('License Type:');
        const hasYears = section.summary.includes('Years of Experience:');
        const hasLicenseNumber = section.summary.includes('License Number:') && !section.summary.includes('License Number: Not provided');
        const hasLicenseState = section.summary.includes('License State:') && !section.summary.includes('License State: Not provided');
        const hasLicenseExpiry = section.summary.includes('License Expiry:') && !section.summary.includes('License Expiry: Not provided');

        isComplete = hasLicenseType && hasYears && hasLicenseNumber && hasLicenseState && hasLicenseExpiry;
      } else if (section.title === 'Safety Record') {
        // Safety Record is complete if all required fields are answered
        // Check actual data instead of summary text
        const hasDrugTest = applicant?.can_pass_drug_test !== undefined && applicant?.can_pass_drug_test !== null;
        const hasViolationCount = applicant?.moving_violations_count !== undefined && applicant?.moving_violations_count !== null;
        const hasAccidentCount = applicant?.accident_count !== undefined && applicant?.accident_count !== null;
        const hasWorkAuth = applicant?.authorized_to_work_in_us !== undefined && applicant?.authorized_to_work_in_us !== null;

        isComplete = hasDrugTest && hasViolationCount && hasAccidentCount && hasWorkAuth;
      } else if (section.title === 'Accident History') {
        // Accident History is complete if user has provided their answer
        // Either they have accidents (with details) OR they've indicated 0 accidents
        const hasProvidedAnswer = applicant?.accident_count !== undefined && applicant?.accident_count !== null;
        isComplete = hasProvidedAnswer;
      } else if (section.title === 'Violation History') {
        // Violation History is complete if user has provided their answer
        // Either they have violations (with details) OR they've indicated 0 violations
        const hasProvidedAnswer = applicant?.moving_violations_count !== undefined && applicant?.moving_violations_count !== null;
        isComplete = hasProvidedAnswer;
      } else if (section.title === 'Criminal History') {
        // Criminal History is complete if user has answered (even if answer is empty string for "No")
        // Incomplete if null/undefined (not answered) or if set to '__YES_NO_DETAILS__' (yes but no details)
        const hasAnswered = applicant?.criminal_history !== undefined && applicant?.criminal_history !== null;
        const isYesWithoutDetails = applicant?.criminal_history === '__YES_NO_DETAILS__';
        isComplete = hasAnswered && !isYesWithoutDetails;
      } else if (section.title === 'Application Authorization & Signature') {
        // Check if the application signature exists
        const hasSignature = applicantExtras?.some(
          (extra) => extra.type === ApplicantExtras.SIGNATURE && extra.value
        );
        isComplete = hasSignature;
      } else if (section.title === 'Current Employment & Company History') {
        // Check if they've answered the company history questions
        const hasAnsweredApplied = applicant?.already_applied_to_company !== undefined && applicant?.already_applied_to_company !== null;
        isComplete = hasAnsweredApplied;
      } else {
        isComplete =
          !section.summary.toLowerCase().includes('not provided') &&
          !section.summary.toLowerCase().includes('not uploaded') &&
          !section.summary.toLowerCase().includes('not answered') &&
          section.summary.trim() !== '';
      }

      return !isComplete;
    });

    if (incompleteSection) {
      // Navigate to first incomplete section
      alert(`Please complete the "${incompleteSection.title}" section before submitting.`);
      handleEditSection(incompleteSection.stepNumber);
    } else {
      // All sections complete, submit and go to thank you page
      setSteps(26); // Thank you page
    }
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
      <div
        className={styles.formContainer}
        style={isPrefilled ? { backgroundColor: 'white', padding: '40px' } : undefined}
      >
        {/* Returning User Banner */}
        <div style={{ marginBottom: '1.5rem' }}>
          <ReturningUserBanner
            applicant={applicant}
            companyName={company?.name}
            isPrefilled={isPrefilled}
          />
        </div>

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
                  style={{ fontSize: '1.5rem', color: '#212529' }}
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

            // Determine if this is a required section for returning users
            // For returning users applying to a DIFFERENT company, safety-related fields are cleared and must be re-completed
            // For returning users re-applying to the SAME company, NO sections are required
            // For DIFFERENT_COMPANY_PREFILL scenario: isPrefilled=true AND already_applied_to_company is NOT true
            const isReturningUser = isPrefilled || applicant?.id;
            // Key: use AND (&&) - isPrefilled can be true for same-company scenarios too
            const isApplyingToDifferentCompany = isPrefilled && applicant?.already_applied_to_company !== true;

            if (index === 0) {
              console.log('🔵 ApplicationSummary - isPrefilled:', isPrefilled);
              console.log('🔵 ApplicationSummary - applicant.id:', applicant?.id);
              console.log('🔵 ApplicationSummary - applicant.already_applied_to_company:', applicant?.already_applied_to_company);
              console.log('🔵 ApplicationSummary - isReturningUser:', isReturningUser);
              console.log('🔵 ApplicationSummary - isApplyingToDifferentCompany:', isApplyingToDifferentCompany);
            }

            const requiredSectionsForDifferentCompany = [
              'Current Employment & Company History',
              'Application Authorization & Signature',
              'Legal Documents',
            ];

            // For same-company returning applicants, NO sections are required
            // (they don't need to re-sign legal documents, re-enter employment history, etc.)
            const requiredSectionsForSameCompany: string[] = [];

            const requiredSections = isApplyingToDifferentCompany
              ? requiredSectionsForDifferentCompany
              : requiredSectionsForSameCompany;

            const isRequiredForReturningUser = requiredSections.includes(section.title) && isReturningUser;
            const isOptionalForReturningUser = isReturningUser && !requiredSections.includes(section.title);

            return (
              <Col md={12} key={index} className="mb-3">
                <Card
                  className="shadow-sm"
                  style={{
                    border: isRequiredForReturningUser && !isComplete ? '3px solid #ffc107' : undefined,
                    backgroundColor: isRequiredForReturningUser && !isComplete ? '#fffbf0' : undefined,
                  }}
                >
                  <Card.Body className="py-3">
                    {isRequiredForReturningUser && !isComplete && (
                      <div style={{
                        backgroundColor: '#ffc107',
                        color: '#000',
                        padding: '0.35rem 0.75rem',
                        marginBottom: '0.75rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        display: 'inline-block',
                      }}>
                        ⚠️ ACTION REQUIRED - Must Complete
                      </div>
                    )}
                    {isOptionalForReturningUser && (
                      <div style={{
                        backgroundColor: '#e7f5ff',
                        color: '#1971c2',
                        padding: '0.35rem 0.75rem',
                        marginBottom: '0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        display: 'inline-block',
                      }}>
                        ℹ️ Optional - Already saved from previous application
                      </div>
                    )}
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
                        ) : isRequiredForReturningUser ? (
                          <i
                            className="fa fa-square-o"
                            style={{
                              fontSize: '1.5rem',
                              color: '#ffc107',
                              textShadow: '0 0 3px rgba(255,193,7,0.3)',
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
                      <Col md={8}>
                        <h6
                          className="mb-1"
                          style={{
                            color: isRequiredForReturningUser ? '#856404' : '#000000',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                          }}
                        >
                          {section.title}
                        </h6>
                        <p
                          className={`mb-0`}
                          style={{
                            color: isComplete ? '#2c3e50' : (isRequiredForReturningUser ? '#856404' : '#000000'),
                            fontWeight: isComplete ? '400' : '600',
                            fontSize: '0.95rem',
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                          }}
                        >
                          {section.summary}
                        </p>
                      </Col>
                      <Col md={3} className="text-end">
                        {/* Prevent editing phone number (step 2) for returning users */}
                        {isEditingExistingApplicant && section.stepNumber === 2 ? (
                          <Badge bg="secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
                            <i className="fa fa-lock me-1" />
                            Locked
                          </Badge>
                        ) : (
                          <Button
                            variant={isRequiredForReturningUser && !isComplete ? 'warning' : 'outline-primary'}
                            size={isRequiredForReturningUser && !isComplete ? 'lg' : 'sm'}
                            onClick={() => handleEditSection(section.stepNumber)}
                            style={isRequiredForReturningUser && !isComplete ? {
                              fontWeight: 'bold',
                              padding: '0.5rem 1rem',
                              whiteSpace: 'nowrap',
                            } : undefined}
                          >
                            <i className="fa fa-edit me-1" />
                            {isRequiredForReturningUser && !isComplete ? 'Complete' : (isComplete ? 'Edit' : 'Complete')}
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <div className="text-center mt-4">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {/* Save Button */}
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={handleSaveApplication}
              disabled={isSaving}
              className="px-4"
            >
              {isSaving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa fa-save me-2" />
                  Save Application
                </>
              )}
            </Button>

            {/* Submit/Continue Button */}
            <Button
              variant={isPrefilled ? "success" : "primary"}
              size="lg"
              onClick={isPrefilled ? handleSubmitApplication : handleContinueToLongForm}
              className="px-5"
            >
              <i className={`fa ${isPrefilled ? 'fa-check' : 'fa-arrow-right'} me-2`} />
              {isPrefilled ? 'Submit Application' : 'Continue to Detailed Application'}
            </Button>
          </div>

          {/* Last saved indicator */}
          {lastSaved && (
            <div className="mt-2">
              <small className="text-success">
                <i className="fa fa-check-circle me-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </small>
            </div>
          )}
          {saveError && (
            <div className="mt-2">
              <small className="text-danger">
                <i className="fa fa-exclamation-circle me-1" />
                Save failed: {saveError}
              </small>
            </div>
          )}
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
