import { CSSProperties } from "react";
import { AccidentHistory, AccordianPage, BackgroundInfo, DriverApplication, DriverLicense, DrivingExperience, DrugTest, EmergencyContact, EmploymentHistory, FelonyConviction, HalfWay, HighestLevelEducation, MedicalCard, OtherQueues, PastEmploymentHistory, PastSuspension, Preferences, UnableForJob, ViolationHistory, WorkedBefore } from "./longForm";
import { AccidentViolation, BasicInfo, CdlExperience, ContinueLongForm, HearAbout, Names, SplashPage } from "./shortForm";

export const JotformPages = {
    0: <SplashPage />,
    1: <Names />,
    2: <BasicInfo />,
    3: <CdlExperience />,
    4: <AccidentViolation />,
    5: <HearAbout />,
    6: <ContinueLongForm />,
    7: <DriverApplication />,
    8: <BackgroundInfo />,
    9: <HighestLevelEducation />,
    10: <DrivingExperience />,
    11: <OtherQueues />,
    12: <DriverLicense />,
    13: <MedicalCard />,
    14: <EmergencyContact />,
    15: <EmploymentHistory />,
    16: <PastEmploymentHistory />,
    17: <Preferences />,
    18: <HalfWay />,
    19: <WorkedBefore />,
    20: <AccidentHistory />,
    21: <ViolationHistory />,
    22: <PastSuspension />,
    23: <UnableForJob />,
    24: <FelonyConviction />,
    25: <DrugTest />,
    26: <AccordianPage />,
}

export const getPageAccordingToStep = (step: number): JSX.Element => (JotformPages[step]);

export const JotformStyles = {
    2: { width: "50%" }
}

export const getStyleAccordingToStep = (step: number): CSSProperties | undefined => (JotformStyles[step])