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
    0: <DriverApplication />,
    1: <BackgroundInfo />,
    2: <HighestLevelEducation />,
    3: <DrivingExperience />,
    4: <OtherQueues />,
    5: <DriverLicense />,
    6: <MedicalCard />,
    7: <EmergencyContact />,
    8: <EmploymentHistory />,
    9: <PastEmploymentHistory />,
    10: <WorkedBefore />,
    11: <AccidentHistory />,
    12: <ViolationHistory />,
    13: <PastSuspension />,
    14: <UnableForJob />,
    15: <FelonyConviction />,
    16: <DrugTest />,
    17: <LegalDocumentsPage />,
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
