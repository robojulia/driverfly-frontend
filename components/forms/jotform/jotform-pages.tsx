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
  HalfWay,
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
import { SubmitMissingDocuments } from './longForm/submit-missing-document';
import {
  AccidentViolation,
  BasicInfo,
  CdlExperience,
  ContinueLongForm,
  HearAbout,
  Names,
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
    3: <Names />,
    4: <BasicInfo />,
    5: <CdlExperience />,
    6: <AccidentViolation />,
    7: <TransmissionAndEndorsement />,
    8: <DuiAndEquipment />,
    9: <Preferences />,
    10: <HearAbout />,
    11: <ContinueLongForm />,
    12: <DriverApplication />,
    13: <BackgroundInfo />,
    14: <HighestLevelEducation />,
    15: <DrivingExperience />,
    16: <OtherQueues />,
    17: <DriverLicense />,
    18: <MedicalCard />,
    19: <EmergencyContact />,
    20: <EmploymentHistory />,
    21: <PastEmploymentHistory />,
    22: <HalfWay />,
    23: <WorkedBefore />,
    24: <AccidentHistory />,
    25: <ViolationHistory />,
    26: <PastSuspension />,
    27: <UnableForJob />,
    28: <FelonyConviction />,
    29: <DrugTest />,
    30: <AccordianPage />,
    31: <ThankyouPage />,
  }[step]);

const getFullFormStyle = (step: number): CSSProperties | undefined =>
  ({
    2: { width: '50%' },
  }[step]);

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
    10: <HalfWay />,
    11: <WorkedBefore />,
    12: <AccidentHistory />,
    13: <ViolationHistory />,
    14: <PastSuspension />,
    15: <UnableForJob />,
    16: <FelonyConviction />,
    17: <DrugTest />,
    18: <AccordianPage />,
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
    2: <AccordianPage />,
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
