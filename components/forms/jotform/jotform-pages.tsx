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
  OtherQueues,
  PastEmploymentHistory,
  PastSuspension,
  Preferences,
  UnableForJob,
  ViolationHistory,
  WorkedBefore,
} from './longForm';
import { LegalDocumentsPage } from './longForm/legal-documents';
import { SubmitMissingDocuments } from './longForm/submit-missing-document';
import {
  AccidentViolation,
  CdlExperience,
  ContinueLongForm,
  HearAbout,
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

// Wrap long form components with async saving capability
const DriverApplicationWithSave = withAsyncSave(DriverApplication, 'DriverApplication');
const BackgroundInfoWithSave = withAsyncSave(BackgroundInfo, 'BackgroundInfo');
const HighestLevelEducationWithSave = withAsyncSave(HighestLevelEducation, 'HighestLevelEducation');
const DrivingExperienceWithSave = withAsyncSave(DrivingExperience, 'DrivingExperience');
const OtherQueuesWithSave = withAsyncSave(OtherQueues, 'OtherQueues');
const DriverLicenseWithSave = withAsyncSave(DriverLicense, 'DriverLicense');
const MedicalCardWithSave = withAsyncSave(MedicalCard, 'MedicalCard');
const EmergencyContactWithSave = withAsyncSave(EmergencyContact, 'EmergencyContact');
const EmploymentHistoryWithSave = withAsyncSave(EmploymentHistory, 'EmploymentHistory');
const PastEmploymentHistoryWithSave = withAsyncSave(PastEmploymentHistory, 'PastEmploymentHistory');
const WorkedBeforeWithSave = withAsyncSave(WorkedBefore, 'WorkedBefore');
const AccidentHistoryWithSave = withAsyncSave(AccidentHistory, 'AccidentHistory');
const ViolationHistoryWithSave = withAsyncSave(ViolationHistory, 'ViolationHistory');
const PastSuspensionWithSave = withAsyncSave(PastSuspension, 'PastSuspension');
const UnableForJobWithSave = withAsyncSave(UnableForJob, 'UnableForJob');
const FelonyConvictionWithSave = withAsyncSave(FelonyConviction, 'FelonyConviction');
const DrugTestWithSave = withAsyncSave(DrugTest, 'DrugTest');
const LegalDocumentsPageWithSave = withAsyncSave(LegalDocumentsPage, 'LegalDocumentsPage');

const getFullFormPages = (step: number): JSX.Element =>
  ({
    0: <SplashPage />,
    1: <AtsJobs />,
    2: <PhoneNumber />,
    3: <NamesAndBasicInfo />,
    4: <CdlExperience />,
    5: <AccidentViolation />,
    6: <TransmissionAndEndorsement />,
    7: <DuiAndEquipment />,
    8: <Preferences />,
    9: <HearAbout />,
    10: <ContinueLongForm />,
    11: <DriverApplication />,
    12: <BackgroundInfo />,
    13: <HighestLevelEducation />,
    14: <DrivingExperience />,
    15: <OtherQueues />,
    16: <DriverLicense />,
    17: <MedicalCard />,
    18: <EmergencyContact />,
    19: <EmploymentHistory />,
    20: <PastEmploymentHistory />,
    21: <WorkedBefore />,
    22: <AccidentHistory />,
    23: <ViolationHistory />,
    24: <PastSuspension />,
    25: <UnableForJob />,
    26: <FelonyConviction />,
    27: <DrugTest />,
    28: <LegalDocumentsPage />,
    29: <ThankyouPage />,
  }[step]);

const getFullFormStyle = (step: number): CSSProperties | undefined => ({}[step]);

const getLongFormPages = (step: number): JSX.Element =>
  ({
    0: <DriverApplicationWithSave />,
    1: <BackgroundInfoWithSave />,
    2: <HighestLevelEducationWithSave />,
    3: <DrivingExperienceWithSave />,
    4: <OtherQueuesWithSave />,
    5: <DriverLicenseWithSave />,
    6: <MedicalCardWithSave />,
    7: <EmergencyContactWithSave />,
    8: <EmploymentHistoryWithSave />,
    9: <PastEmploymentHistoryWithSave />,
    10: <WorkedBeforeWithSave />,
    11: <AccidentHistoryWithSave />,
    12: <ViolationHistoryWithSave />,
    13: <PastSuspensionWithSave />,
    14: <UnableForJobWithSave />,
    15: <FelonyConvictionWithSave />,
    16: <DrugTestWithSave />,
    17: <LegalDocumentsPageWithSave />,
    19: <ThankyouPage />,
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
    0: <DriverApplication isAutoRecruitmentLead={Boolean(jobId)} />,
    1: <WorkedBefore />,
    2: <LegalDocumentsPage />,
    3: <ThankyouPage />,
    4: <AlreadyAppliedPage />,
  }[step]);
const getLongFormStyle = (step: number): CSSProperties | undefined => ({}[step]);

export {
  getFullFormPages,
  getFullFormStyle,
  getLongFormPages,
  getLongFormStyle,
  getMissingDocumentsPages,
  getSuggestedJobPages,
};
