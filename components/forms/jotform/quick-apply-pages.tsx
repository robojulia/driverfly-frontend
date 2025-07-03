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
import { ContinueLongForm, SplashPage } from './shortForm';
import { DuiAndEquipment } from './shortForm/dui-and-equipment';
import { TransmissionAndEndorsement } from './shortForm/transmission-and-endorsement';
import { ThankyouPage } from './thankyou-screen';

const getQuickApplyPages = (step: number): JSX.Element =>
  ({
    0: <SplashPage />,
    1: <TransmissionAndEndorsement />,
    2: <DuiAndEquipment />,
    3: <Preferences />,
    4: <ContinueLongForm />,
    5: <DriverApplication />,
    6: <BackgroundInfo />,
    7: <HighestLevelEducation />,
    8: <DrivingExperience />,
    9: <OtherQueues />,
    10: <DriverLicense />,
    11: <MedicalCard />,
    12: <EmergencyContact />,
    13: <EmploymentHistory />,
    14: <PastEmploymentHistory />,
    15: <WorkedBefore />,
    16: <AccidentHistory />,
    17: <ViolationHistory />,
    18: <PastSuspension />,
    19: <UnableForJob />,
    20: <FelonyConviction />,
    21: <DrugTest />,
    22: <AccordianPage />,
    23: <ThankyouPage />,
  }[step]);

const getQuickApplyStyle = (step: number): CSSProperties | undefined =>
  ({
    // 2: { width: "50%" },
  }[step]);

export { getQuickApplyPages, getQuickApplyStyle };
