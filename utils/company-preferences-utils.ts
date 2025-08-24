import { CompanyPreferenceEntity } from '../models/company/company-preferences.entity';
import { CompanyPreferenceCategory } from '../enums/company/company-preference-category.enum';
import { CompanyPreferenceOnboardingChecklistLabel } from '../enums/company/company-preferences-onboarding-checklist-label.enum';
import { ApplicantOnBoardingChecklist } from '../enums/applicants/applicant-onboarding-checklist.enum';
import { CompanyEntity } from '../models/company/company.entity';
import CompanyApi from '../pages/api/company';

/**
 * Gets all required document types for onboarding checklist
 */
function getAllRequiredDocuments() {
  return [
    ApplicantOnBoardingChecklist.EMPLOYMENT_APPLICATION,
    ApplicantOnBoardingChecklist.DRIVER_AUTHORIZATION,
    ApplicantOnBoardingChecklist.RESUME_OPTIONAL,
    ApplicantOnBoardingChecklist.OFFER_LETTER_AND_ACCEPTANCE,
    ApplicantOnBoardingChecklist.DRIVER_LICENSE,
    ApplicantOnBoardingChecklist.MOTOR_VEHICLE_RECORD_MVR,
    ApplicantOnBoardingChecklist.DRUG_AND_ALCOHOL_CLEARINGHOUSE_QUERY,
    ApplicantOnBoardingChecklist.DRIVER_ROAD_TEST_CERTIFICATE_OR_EQUIVALENT,
    ApplicantOnBoardingChecklist.DRUG_AND_ALCOHOL_TEST_CHAIN_OF_CUSTODY,
    ApplicantOnBoardingChecklist.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD,
    ApplicantOnBoardingChecklist.MEDICAL_EXAMINATION_REPORT_LONG_FORM,
    ApplicantOnBoardingChecklist.SAFETY_PERFORMANCE_HISTORY,
    ApplicantOnBoardingChecklist.RECORD_OF_ATTEMPTS_SAFETY_PERFORMANCE_HISTORY,
    ApplicantOnBoardingChecklist.PSP_RECORD,
    ApplicantOnBoardingChecklist.PRE_EMPLOYMENT_DRUG_TEST,
    ApplicantOnBoardingChecklist.PROOF_OF_INSURANCE,
    ApplicantOnBoardingChecklist.VEHICLE_TITLE,
    ApplicantOnBoardingChecklist.EQUIPMENT_LEASE,
    ApplicantOnBoardingChecklist.SIGNED_HOURS_OF_SERVICE_RECORD_STATEMENT,
    ApplicantOnBoardingChecklist.TWIC_OPTIONAL,
  ];
}

/**
 * Core function to enable all documents for a company's onboarding checklist.
 * This function checks if preferences already exist and updates them, or creates new ones if they don't exist.
 */
async function enableAllDocumentsForCompany(companyId: number): Promise<void> {
  const api = new CompanyApi();
  
  // Check if preferences already exist
  const existingPreferences = await api.preferences.list(companyId, {
    category: CompanyPreferenceCategory.ONBOARDING_CHECKLIST,
  });
  
  const existingApplicantDocuments = existingPreferences.find(
    (pref) => pref.label === CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS
  );
  
  // Create the APPLICANT_DOCUMENTS preference with all required documents
  const applicantDocumentsPreference = new CompanyPreferenceEntity();
  applicantDocumentsPreference.category = CompanyPreferenceCategory.ONBOARDING_CHECKLIST;
  applicantDocumentsPreference.company = { id: companyId } as CompanyEntity;
  applicantDocumentsPreference.label = CompanyPreferenceOnboardingChecklistLabel.APPLICANT_DOCUMETS;
  applicantDocumentsPreference.value = getAllRequiredDocuments();

  if (existingApplicantDocuments?.id) {
    // Update existing preference
    applicantDocumentsPreference.id = existingApplicantDocuments.id;
    await api.preferences.update(companyId, existingApplicantDocuments.id, applicantDocumentsPreference);
    console.log('Default onboarding checklist preferences updated successfully for company:', companyId);
  } else {
    // Create new preference
    await api.preferences.create(companyId, applicantDocumentsPreference);
    console.log('Default onboarding checklist preferences created successfully for company:', companyId);
  }
}

/**
 * Creates default onboarding checklist preferences for a newly created company.
 * This function automatically sets up the APPLICANT_DOCUMENTS preference with all required documents.
 * Errors are caught and logged but not thrown to avoid failing company creation.
 */
export async function createDefaultOnboardingChecklistPreferences(companyId: number): Promise<void> {
  try {
    await enableAllDocumentsForCompany(companyId);
  } catch (error) {
    console.error('Error creating default onboarding checklist preferences for company:', companyId, error);
    // Don't throw error to avoid failing company creation if preferences fail
  }
}

/**
 * Manually enables all documents for a company's onboarding checklist.
 * This function is used when a user clicks the "Enable All Documents" button.
 * Errors are thrown so the user can see them.
 */
export async function enableAllDocumentsManually(companyId: number): Promise<void> {
  await enableAllDocumentsForCompany(companyId);
}
