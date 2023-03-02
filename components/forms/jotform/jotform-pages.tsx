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
	PhoneNumber
} from "./shortForm";
import { ThankyouPage } from "./thankyou-screen";

const getFullFormPages = (step: number): JSX.Element =>
({
	0: <SplashPage />,
	1: <PhoneNumber />,
	2: <Names />,
	3: <BasicInfo />,
	4: <CdlExperience />,
	5: <AccidentViolation />,
	6: <Preferences />,
	7: <HearAbout />,
	8: <ContinueLongForm />,
	9: <DriverApplication />,
	10: <BackgroundInfo />,
	11: <HighestLevelEducation />,
	12: <DrivingExperience />,
	13: <OtherQueues />,
	14: <DriverLicense />,
	15: <MedicalCard />,
	16: <EmergencyContact />,
	17: <EmploymentHistory />,
	18: <PastEmploymentHistory />,
	19: <HalfWay />,
	20: <WorkedBefore />,
	21: <AccidentHistory />,
	22: <ViolationHistory />,
	23: <PastSuspension />,
	24: <UnableForJob />,
	25: <FelonyConviction />,
	26: <DrugTest />,
	27: <AccordianPage />,
	28: <ThankyouPage />
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
	10: <HalfWay />,
	11: <WorkedBefore />,
	12: <AccidentHistory />,
	13: <ViolationHistory />,
	14: <PastSuspension />,
	15: <UnableForJob />,
	16: <FelonyConviction />,
	17: <DrugTest />,
	18: <AccordianPage />,
	19: <ThankyouPage />
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
