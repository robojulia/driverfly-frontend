import { CSSProperties } from "react";
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
} from "./longForm";
import { SubmitMissingDocuments } from "./longForm/submit-missing-document";
import {
	AccidentViolation,
	BasicInfo,
	CdlExperience,
	ContinueLongForm,
	HearAbout,
	Names,
	SplashPage,
} from "./shortForm";
import { ThankyouPage } from "./thankyou-screen";

const getFullFormPages = (step: number): JSX.Element =>
({
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
	27: <ThankyouPage />
}[step]);

const getFullFormStyle = (step: number): CSSProperties | undefined =>
({
	2: { width: "50%" },
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
	10: <Preferences />,
	11: <HalfWay />,
	12: <WorkedBefore />,
	13: <AccidentHistory />,
	14: <ViolationHistory />,
	15: <PastSuspension />,
	16: <UnableForJob />,
	17: <FelonyConviction />,
	18: <DrugTest />,
	19: <AccordianPage />,
	27: <ThankyouPage />
}[step]);

const getMissingDocumentsPages = (step: number): JSX.Element =>
({
	0: <DriverLicense />,
	1: <MedicalCard />,
	2: <SubmitMissingDocuments />,
	3: <ThankyouPage />
}[step]);
const getLongFormStyle = (step: number): CSSProperties | undefined =>
	({}[step]);

export {
	getFullFormPages,
	getFullFormStyle,
	getLongFormPages,
	getLongFormStyle,
	getMissingDocumentsPages,
};
