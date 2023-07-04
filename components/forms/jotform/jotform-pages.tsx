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
import { AtsJobs } from "./shortForm/ats-jobs";

const getFullFormPages = (step: number): JSX.Element =>
({
	0: <SplashPage />,
	1: <AtsJobs />,
	2: <PhoneNumber />,
	3: <Names />,
	4: <BasicInfo />,
	5: <CdlExperience />,
	6: <AccidentViolation />,
	7: <Preferences />,
	8: <HearAbout />,
	9: <ContinueLongForm />,
	10: <DriverApplication />,
	11: <BackgroundInfo />,
	12: <HighestLevelEducation />,
	13: <DrivingExperience />,
	14: <OtherQueues />,
	15: <DriverLicense />,
	16: <MedicalCard />,
	17: <EmergencyContact />,
	18: <EmploymentHistory />,
	19: <PastEmploymentHistory />,
	20: <HalfWay />,
	21: <WorkedBefore />,
	22: <AccidentHistory />,
	23: <ViolationHistory />,
	24: <PastSuspension />,
	25: <UnableForJob />,
	26: <FelonyConviction />,
	27: <DrugTest />,
	28: <AccordianPage />,
	29: <ThankyouPage />,
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
