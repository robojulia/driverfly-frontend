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
import { ContinueLongForm, HearAbout, SplashPage } from './shortForm';
import { DuiAndEquipment } from './shortForm/dui-and-equipment';
import { TransmissionAndEndorsement } from './shortForm/transmission-and-endorsement';
import { ThankyouPage } from './thankyou-screen';

const getQuickApplyPages = (step: number): JSX.Element =>
  ({
    0: <SplashPage />,
    1: <TransmissionAndEndorsement />,
    2: <DuiAndEquipment />,
    3: <Preferences />,
    4: <HearAbout />,
    5: <ContinueLongForm />,
    6: <DriverApplication />,
    7: <BackgroundInfo />,
    8: <HighestLevelEducation />,
    9: <DrivingExperience />,
    10: <OtherQueues />,
    11: <DriverLicense />,
    12: <MedicalCard />,
    13: <EmergencyContact />,
    14: <EmploymentHistory />,
    15: <PastEmploymentHistory />,
    16: <WorkedBefore />,
    17: <AccidentHistory />,
    18: <ViolationHistory />,
    19: <PastSuspension />,
    20: <UnableForJob />,
    21: <FelonyConviction />,
    22: <DrugTest />,
    23: <AccordianPage />,
    24: <ThankyouPage />,
  }[step]);

const getQuickApplyStyle = (step: number): CSSProperties | undefined =>
  ({
    // 2: { width: "50%" },
  }[step]);

export { getQuickApplyPages, getQuickApplyStyle };
