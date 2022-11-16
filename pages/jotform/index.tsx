import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { SplashPage } from "../../components/forms/jotform/shortForm/splash-page";
import { Names } from "../../components/forms/jotform/shortForm/names";
import { BasicInfo } from "../../components/forms/jotform/shortForm/basic-info";
import { CdlExperience } from "../../components/forms/jotform/shortForm/cdl-experience";
import { AccidentViolation } from "../../components/forms/jotform/shortForm/accident-violation";
import { HearAbout } from "../../components/forms/jotform/shortForm/hear-about";
import { ContinueLongForm } from "../../components/forms/jotform/shortForm/continue-longform";

import { DriverApplication } from "../../components/forms/jotform/longForm/driver-application";
import { BackgroundInfo } from "../../components/forms/jotform/longForm/background-info";
import { HighestLevelEducation } from "../../components/forms/jotform/longForm/highest-level-education";
import { DrivingExperience } from "../../components/forms/jotform/longForm/driving-experirence";
import { OtherQueues } from "../../components/forms/jotform/longForm/other-queues";
import { DriverLicense } from "../../components/forms/jotform/longForm/driver-license";
import { MedicalCard } from "../../components/forms/jotform/longForm/medical-card";
import { EmergencyContact } from "../../components/forms/jotform/longForm/emergency-contact";
import { EmploymentHistory } from "../../components/forms/jotform/longForm/employment-history";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { PastEmploymentHistory } from "../../components/forms/jotform/longForm/past-employment-history";
import { Preferences } from "../../components/forms/jotform/longForm/preference";
import { HalfWay } from "../../components/forms/jotform/longForm/half-way";
import { WorkedBefore } from "../../components/forms/jotform/longForm/worked-before";
import { AccidentHistory } from "../../components/forms/jotform/longForm/accident-history";
import { DrugTest } from "../../components/forms/jotform/longForm/drug-test";
import { FelonyConviction } from "../../components/forms/jotform/longForm/felony-conviction";
import { UnableForJob } from "../../components/forms/jotform/longForm/unable-for-job";
import { PastSuspension } from "../../components/forms/jotform/longForm/past-suspension";
import { ViolationHistory } from "../../components/forms/jotform/longForm/violaton-history";
import { AccordianPage } from "../../components/forms/jotform/longForm/accordian";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../context/jotform-context";
import { PageProps } from "../../types/jotform/page-props.type";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";

export default function jotFormLongForm() {
	const [applicant, setApplicant] = useState<ApplicantEntity>(
		new ApplicantEntity()
	);
	const [applicantExtras, setApplicantExtras] = useState<
		ApplicantExtrasEntity[]
	>([]);
	const updateApplicantExtras = (
		applicantExtrasEntity: ApplicantExtrasEntity
	) =>
		setApplicantExtras((oldApx) => {
			oldApx = oldApx?.filter((v) => v.type !== applicantExtrasEntity.type);
			return !!oldApx
				? [...oldApx, { ...applicantExtrasEntity }]
				: [{ ...applicantExtrasEntity }];
		});

	const [steps, setSteps] = useState<number>(0);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	useEffect(() => {
		console.log("applicantextrasvalues", applicantExtras);
	}, []);

	const getPageAccordingToStep = (step: number) => (
		{
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
		}[step]
	)

	return (
		<jotformContext.Provider
			value={{
				state: {
					applicant,
					applicantExtras,
					steps,
				},
				method: {
					setApplicant,
					updateApplicantExtras,
					setSteps,
					stepNext,
					stepBack,
				},
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main_form} style={{ border: "1px solid red" }}>
						{getPageAccordingToStep(steps)}
					</div>
				</div>
			</div>
		</jotformContext.Provider>
	);
}
