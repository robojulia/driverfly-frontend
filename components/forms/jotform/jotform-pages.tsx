import { CSSProperties } from 'react';
import {
  AccidentHistory,
  AccordianPage,
  BackgroundInfo,
  DriverApplication,
  DriverLicense,
  DrivingExperience,
  DrugTest,
  EmergencyContact,
  EmploymentHistory,
  FelonyConviction,
  HighestLevelEducation,
  MedicalCard,
  PastEmploymentHistory,
  PastSuspension,
  Preferences,
  UnableForJob,
  ViolationHistory,
  WorkedBefore, // Only used in getSuggestedJobPages flow
} from './longForm';
import { CombinedLicenseEdit } from './longForm/combined-license-edit';
import { LegalDocumentsPage } from './longForm/legal-documents';
import { SubmitMissingDocuments } from './longForm/submit-missing-document';
import {
  AccidentViolation,
  CdlExperience,
  ContinueLongForm,
  NamesAndBasicInfo,
  SplashPage,
  PhoneNumber,
} from './shortForm';
import { ThankyouPage } from './thankyou-screen';
import { AtsJobs } from './shortForm/ats-jobs';
import { TransmissionAndEndorsement } from './shortForm/transmission-and-endorsement';
import { DuiAndEquipment } from './shortForm/dui-and-equipment';
import { AlreadyAppliedPage } from './already-applied';
import { withAsyncSave } from './with-async-save';
import { ApplicationSummary } from './application-summary';

// Wrap long form components with async saving capability
const DriverApplicationWithSave = withAsyncSave(DriverApplication, 'DriverApplication');
const BackgroundInfoWithSave = withAsyncSave(BackgroundInfo, 'BackgroundInfo');
const HighestLevelEducationWithSave = withAsyncSave(HighestLevelEducation, 'HighestLevelEducation');
const DrivingExperienceWithSave = withAsyncSave(DrivingExperience, 'DrivingExperience');
const DriverLicenseWithSave = withAsyncSave(DriverLicense, 'DriverLicense');
const MedicalCardWithSave = withAsyncSave(MedicalCard, 'MedicalCard');
const EmergencyContactWithSave = withAsyncSave(EmergencyContact, 'EmergencyContact');
const EmploymentHistoryWithSave = withAsyncSave(EmploymentHistory, 'EmploymentHistory');
const PastEmploymentHistoryWithSave = withAsyncSave(PastEmploymentHistory, 'PastEmploymentHistory');
const AccidentHistoryWithSave = withAsyncSave(AccidentHistory, 'AccidentHistory');
const ViolationHistoryWithSave = withAsyncSave(ViolationHistory, 'ViolationHistory');
const PastSuspensionWithSave = withAsyncSave(PastSuspension, 'PastSuspension');
const UnableForJobWithSave = withAsyncSave(UnableForJob, 'UnableForJob');
const FelonyConvictionWithSave = withAsyncSave(FelonyConviction, 'FelonyConviction');
const DrugTestWithSave = withAsyncSave(DrugTest, 'DrugTest');
const LegalDocumentsPageWithSave = withAsyncSave(LegalDocumentsPage, 'LegalDocumentsPage');
const CombinedLicenseEditWithSave = withAsyncSave(CombinedLicenseEdit, 'CombinedLicenseEdit');

const getFullFormPages = (
  step: number,
  isDirectJobApplication?: boolean,
  isPrefilled?: boolean
): JSX.Element => {
  // Special case: if isPrefilled and step is -1, show ApplicationSummary
  if (isPrefilled && step === -1) {
    return <ApplicationSummary />;
  }

  const pages = {
    0: <SplashPage />,
    1: <AtsJobs />,
    2: <PhoneNumber />,
    3: <NamesAndBasicInfo />,
    4: <CdlExperience />,
    5: <AccidentViolation />,
    6: <TransmissionAndEndorsement />,
    7: <DuiAndEquipment />,
    8: <Preferences />,
    9: <ContinueLongForm />,
    10: <DriverApplicationWithSave />,
    11: <BackgroundInfoWithSave />,
    12: <HighestLevelEducationWithSave />,
    13: <DrivingExperienceWithSave />,
    14: <DriverLicenseWithSave />,
    15: <MedicalCardWithSave />,
    16: <EmergencyContactWithSave />,
    17: <EmploymentHistoryWithSave />,
    18: <PastEmploymentHistoryWithSave />,
    19: <AccidentHistoryWithSave />,
    20: <ViolationHistoryWithSave />,
    21: <PastSuspensionWithSave />,
    22: <UnableForJobWithSave />,
    23: <FelonyConvictionWithSave />,
    24: <DrugTestWithSave />,
    25: <LegalDocumentsPageWithSave />,
    26: <ThankyouPage />,
    99: <CombinedLicenseEditWithSave />, // Special page for combined license editing
  };

  // If it's a direct job application and user is trying to access AtsJobs (step 1),
  // redirect them to PhoneNumber (step 2) instead
  if (isDirectJobApplication && step === 1) {
    return pages[2]; // Return PhoneNumber page
  }

  return pages[step];
};

const getFullFormStyle = (
  step: number,
  isDirectJobApplication?: boolean
): CSSProperties | undefined => {
  // Adjust step for direct job applications
  if (isDirectJobApplication && step >= 1) {
    step = step + 1;
  }
  return {}[step];
};

const getLongFormPages = (step: number): JSX.Element =>
  ({
    0: <DriverApplicationWithSave />,
    1: <BackgroundInfoWithSave />,
    2: <HighestLevelEducationWithSave />,
    3: <DrivingExperienceWithSave />,
    4: <DriverLicenseWithSave />,
    5: <MedicalCardWithSave />,
    6: <EmergencyContactWithSave />,
    7: <EmploymentHistoryWithSave />,
    8: <PastEmploymentHistoryWithSave />,
    9: <AccidentHistoryWithSave />,
    10: <ViolationHistoryWithSave />,
    11: <PastSuspensionWithSave />,
    12: <UnableForJobWithSave />,
    13: <FelonyConvictionWithSave />,
    14: <DrugTestWithSave />,
    15: <LegalDocumentsPageWithSave />,
    16: <ThankyouPage />,
  }[step]);

const getMissingDocumentsPages = (step: number): JSX.Element =>
  ({
    0: <DriverLicense />,
    1: <MedicalCard />,
    2: <SubmitMissingDocuments />,
    3: <ThankyouPage />,
  }[step]);
const getSuggestedJobPages = (step: number, jobId?: number): JSX.Element =>
  ({
    0: <DriverApplication isAutoRecruitmentLead={false} />,
    1: <WorkedBefore />,
    2: <LegalDocumentsPage />,
    3: <ThankyouPage />,
    4: <AlreadyAppliedPage />,
  }[step]);
const getLongFormStyle = (step: number): CSSProperties | undefined => ({}[step]);

/**
 * Calculate total steps based on application type
 * @param isDirectJobApplication - Whether this is a direct job application (skips job selection)
 * @returns Total number of steps in the form
 */
const getTotalSteps = (isDirectJobApplication: boolean = false): number => {
  const baseSteps = 27; // Total steps in full form (reduced by 1 after removing duplicate WorkedBefore step)
  return isDirectJobApplication ? baseSteps - 1 : baseSteps; // Skip AtsJobs step for direct applications
};

export {
  getFullFormPages,
  getFullFormStyle,
  getLongFormPages,
  getLongFormStyle,
  getMissingDocumentsPages,
  getSuggestedJobPages,
  getTotalSteps,
};
